import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const imageUrl = product.imageUrl || `https://placehold.co/400x300/1a1a1a/FFA500?text=${encodeURIComponent(product.name)}`;

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="group bg-[var(--background)] border border-[var(--muted)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 theme-transition">
            <Link to={`/shop/${product.id}`} className="block">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-3 right-3 p-2 bg-[var(--background)] rounded-full hover:bg-white transition-colors duration-200"
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        {isWishlisted ? '❤️' : '🤍'}
                    </button>

                    {/* Sale Badge */}
                    {product.onSale && (
                        <div className="absolute top-3 left-3 bg-brand-orange text-brand-black px-2 py-1 rounded-md text-sm font-semibold">
                            Sale
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-[var(--foreground)] mb-2 line-clamp-2 theme-transition">
                        {product.name}
                    </h3>

                    <p className="text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-3 line-clamp-2 theme-transition">
                        {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {product.originalPrice && (
                                <span className="text-sm text-[color-mix(in_oklab,var(--foreground)_40%,transparent)] line-through theme-transition">
                                    ${product.originalPrice}
                                </span>
                            )}
                            <span className="text-lg font-bold text-brand-orange theme-transition">
                                ${product.price}
                            </span>
                        </div>

                        {/* Rating */}
                        {product.rating && (
                            <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">⭐</span>
                                <span className="text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] theme-transition">
                                    {product.rating}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to cart logic here
                        }}
                        className="w-full mt-3 bg-brand-orange text-brand-black font-semibold py-2 px-4 rounded-lg hover:bg-brand-yellow transition-all duration-300 theme-transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </Link>
        </div>
    );
}