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
 * @route   GET /api/news
 * @desc    Get all news posts for the homepage
 */
app.get('/api/news', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM news_posts ORDER BY created_at DESC'
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'No news posts found' });
        }

        res.json(result.rows);

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