import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../../context/CartContext';

export default function ProductCard({ product }) {
    const [isShaking, setIsShaking] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();
    const imageUrl = product.imageUrl || `https://placehold.co/400x300/1a1a1a/FFA500?text=${encodeURIComponent(product.name)}`;

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    return (
        <div className={`group relative border border-[var(--muted)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full ${isShaking ? 'animate-shake' : ''}`}>
            <Link to={`/shop/${product.id}`} className="block flex-1">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Wishlist Button (Fixed Hover) */}
                    <button
                        onClick={toggleWishlist}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-md z-10
                            ${isWishlisted
                                ? 'bg-brand-orange text-brand-black scale-110'
                                : 'bg-[var(--background)]/80 text-[var(--foreground)] hover:bg-brand-yellow hover:text-brand-black'
                            }`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={isWishlisted ? "currentColor" : "none"}
                            stroke="currentColor"
                            className="w-5 h-5"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>

                    {/* Sale Badge */}
                    {product.onSale && (
                        <div className="absolute top-3 left-3 bg-brand-orange text-brand-black px-2 py-1 rounded-md text-sm font-bold shadow-sm">
                            Sale
                        </div>
                    )}

                    {/* Out of Stock Badge */}
                    {!product.inStock && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold shadow-sm">
                            Out of Stock
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-bold text-[var(--foreground)] mb-2 line-clamp-2 theme-transition-colors group-hover:text-brand-orange">
                        {product.name}
                    </h3>

                    <p className="text-sm text-[color-mix(in_oklab,var(--foreground)_70%,transparent)] mb-3 line-clamp-2 theme-transition-colors">
                        {product.description}
                    </p>

                    {/* Price & Rating */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            {product.originalPrice && (
                                <span className="text-xs text-[color-mix(in_oklab,var(--foreground)_50%,transparent)] line-through">
                                    ${product.originalPrice}
                                </span>
                            )}
                            <span className="text-xl font-bold text-brand-orange">
                                ${product.price}
                            </span>
                        </div>

                        {product.rating && (
                            <div className="flex items-center space-x-1 bg-[var(--muted)]/30 px-2 py-1 rounded-lg">
                                <span className="text-yellow-400 text-sm">⭐</span>
                                <span className="text-sm font-medium text-[var(--foreground)]">
                                    {product.rating}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to Cart (Outside Link to avoid nesting issues) */}
            <div className="px-4 pb-4 mt-auto">
                <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2
                        ${product.inStock
                            ? 'bg-brand-orange text-brand-black hover:bg-brand-yellow hover:scale-[1.02] shadow-md hover:shadow-lg'
                            : 'bg-[var(--muted)] text-[var(--foreground)] opacity-50 cursor-not-allowed'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
            </div>
        </div>
    );
}