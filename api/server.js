import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const HOST = process.env.HOST_NAME || 'localhost';
const PORT = process.env.HOST_PORT || 3001;

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware

// --- Database Connection ---
const pool = new Pool({
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
});

// --- API Routes ---

/**
 * @route   GET /api/products/filters
 * @desc    Get metadata for filters (brands, categories, price range, features)
 */
app.get('/api/products/filters', async (req, res) => {
    try {
        // Run queries in parallel for performance
        const [brandsRes, categoriesRes, priceRes, featuresRes] = await Promise.all([
            pool.query('SELECT DISTINCT brand FROM products ORDER BY brand'),
            pool.query('SELECT DISTINCT category FROM products ORDER BY category'),
            pool.query('SELECT MIN(price) as min_price, MAX(price) as max_price FROM products'),
            // Unnest array to get unique features
            pool.query('SELECT DISTINCT unnest(features) as feature FROM products ORDER BY feature')
        ]);

        res.json({
            brands: brandsRes.rows.map(r => r.brand),
            categories: categoriesRes.rows.map(r => r.category),
            features: featuresRes.rows.map(r => r.feature),
            priceRange: {
                min: parseFloat(priceRes.rows[0].min_price),
                max: parseFloat(priceRes.rows[0].max_price)
            }
        });
    } catch (err) {
        console.error('Error fetching filters:', err);
        res.status(500).json({ error: 'Failed to load filters' });
    }
});

/**
 * @route   GET /api/products
 * @desc    Get products with filtering, sorting, and pagination
 */
app.get('/api/products', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            sort = 'name',
            search = '',
            minPrice,
            maxPrice,
            category, categories, // support both
            brand, brands,       // support both
            features
        } = req.query;

        const offset = (page - 1) * limit;
        const queryParams = [];
        let queryConditions = ['1=1'];

        const filterCategories = categories || category;
        const filterBrands = brands || brand;

        // Search Filter
        if (search) {
            queryParams.push(`%${search}%`);
            queryConditions.push(`(name ILIKE $${queryParams.length} OR description ILIKE $${queryParams.length})`);
        }

        // Category Filter
        if (filterCategories) {
            // Перетворюємо на масив, якщо прийшов рядок
            const cats = Array.isArray(filterCategories) ? filterCategories : [filterCategories];
            queryParams.push(cats);
            queryConditions.push(`category = ANY($${queryParams.length})`);
        }

        // Brand Filter
        if (filterBrands) {
            const brnds = Array.isArray(filterBrands) ? filterBrands : [filterBrands];
            queryParams.push(brnds);
            queryConditions.push(`brand = ANY($${queryParams.length})`);
        }

        // Price Range
        if (minPrice) {
            queryParams.push(minPrice);
            queryConditions.push(`price >= $${queryParams.length}`);
        }
        if (maxPrice) {
            queryParams.push(maxPrice);
            queryConditions.push(`price <= $${queryParams.length}`);
        }

        // Features Filter
        if (features) {
            const featureList = Array.isArray(features) ? features : [features];
            queryParams.push(featureList);
            queryConditions.push(`features @> $${queryParams.length}`);
        }

        // Sorting
        let orderBy = 'name ASC';
        switch (sort) {
            case 'name-desc': orderBy = 'name DESC'; break;
            case 'price': orderBy = 'price ASC'; break;
            case 'price-desc': orderBy = 'price DESC'; break;
            case 'rating': orderBy = 'rating DESC'; break;
            case 'newest': orderBy = 'created_at DESC'; break;
            default: orderBy = 'name ASC';
        }

        const whereClause = queryConditions.join(' AND ');

        const sql = `
            SELECT * FROM products 
            WHERE ${whereClause} 
            ORDER BY ${orderBy} 
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
        `;

        const countSql = `SELECT COUNT(*) FROM products WHERE ${whereClause}`;

        const finalParams = [...queryParams, limit, offset];
        const countParams = queryParams;

        const [productsRes, countRes] = await Promise.all([
            pool.query(sql, finalParams),
            pool.query(countSql, countParams)
        ]);

        res.json({
            products: productsRes.rows.map(p => ({
                ...p,
                price: parseFloat(p.price),
                originalPrice: p.original_price ? parseFloat(p.original_price) : null,
                rating: parseFloat(p.rating),
                imageUrl: p.image_url,
                inStock: p.in_stock,
                reviewCount: p.review_count,
                onSale: p.on_sale
            })),
            total: parseInt(countRes.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Single Product Route
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const p = result.rows[0];
        const product = {
            ...p,
            price: parseFloat(p.price),
            originalPrice: p.original_price ? parseFloat(p.original_price) : null,
            rating: parseFloat(p.rating),
            imageUrl: p.image_url,
            inStock: p.in_stock,
            reviewCount: p.review_count,
            onSale: p.on_sale
        };

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   GET /api/news
 * @desc    Get news posts with pagination
 * @query   limit (default 5), offset (default 0)
 */
app.get('/api/news', async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = parseInt(limit) || 5;
        offset = parseInt(offset) || 0;

        const MAX_LIMIT = 50;
        if (limit > MAX_LIMIT) limit = MAX_LIMIT;

        const countResult = await pool.query('SELECT COUNT(*) FROM news_posts');
        const totalPosts = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            'SELECT * FROM news_posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        res.json({
            data: result.rows,
            pagination: {
                total: totalPosts,
                limit,
                offset
            }
        });

    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Failed to retrieve news posts' });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// --- Start Server ---
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});