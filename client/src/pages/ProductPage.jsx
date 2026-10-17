import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopService } from '../services/shopService';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

// Components
import ProductGallery from '../components/market/products/ProductGallery';
import ProductInfo from '../components/market/products/ProductInfo';
import ProductTabs from '../components/market/products/ProductTabs';
import SimilarProducts from '../components/market/products/SimilarProducts';
import Loader from '../components/ui/Loader';

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function fetchProductData() {
            setIsLoading(true);
            setError(null);
            try {
                const productData = await shopService.getProductById(id, { signal });
                setProduct(productData);

                const similar = await shopService.getProducts(
                    { category: [productData.category], limit: 5 },
                    { signal }
                );
                setSimilarProducts(similar.items.filter((p) => p.id !== productData.id).slice(0, 4));
            } catch (err) {
                if (signal.aborted) return;
                setError(err.response?.status === 404 ? 'Product not found' : 'Could not load the product');
            }
            if (!signal.aborted) {
                setIsLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        fetchProductData();
        return () => controller.abort();
    }, [id]);

    if (isLoading) {
        return <Loader />;
    }

    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center theme-transition-colors">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                    {error || "Product not found"}
                </h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="text-brand-orange hover:text-brand-yellow font-bold underline"
                >
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 animate-fadeIn theme-transition-colors">
            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 mb-16">
                <ProductGallery product={product} />
                <ProductInfo
                    product={product}
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    isWishlisted={isInWishlist(product.id)}
                />
            </div>

            {/* Tabs Section */}
            <ProductTabs product={product} />

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <SimilarProducts products={similarProducts} />
            )}
        </div>
    );
}