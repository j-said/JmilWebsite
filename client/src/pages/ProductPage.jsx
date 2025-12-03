import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useEffect } from 'react'; // Added useEffect
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Components
import ProductGallery from '../components/market/products/ProductGallery';
import ProductInfo from '../components/market/products/ProductInfo';
import ProductTabs from '../components/market/products/ProductTabs';
import SimilarProducts from '../components/market/products/SimilarProducts';

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const productId = parseInt(id);
    const product = mockProducts.find(p => p.id === productId);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    // Scroll to top when the page loads or the product ID changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const similarProducts = useMemo(() => {
        if (!product) return [];
        return mockProducts
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center theme-transition-colors">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Product not found</h2>
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
            <SimilarProducts products={similarProducts} />
        </div>
    );
}