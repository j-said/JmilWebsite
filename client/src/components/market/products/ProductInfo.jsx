import { useState } from 'react';

export default function ProductInfo({ product, addToCart, toggleWishlist, isWishlisted }) {
    const [selectedConfig, setSelectedConfig] = useState(0);

    return (
        <div className="flex flex-col h-full theme-transition-colors">
            {/* Header & Wishlist */}
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-[--foreground] theme-transition-colors">
                    {product.name}
                </h1>
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`
                        p-3 rounded-full transition-all duration-300 shadow-sm
                        ${isWishlisted
                            ? 'bg-brand-orange text-brand-black hover:bg-brand-yellow scale-110'
                            : 'bg-[--background] border border-[--muted] text-[--foreground] hover:border-brand-orange hover:text-brand-orange'
                        }
                    `}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isWishlisted ? "currentColor" : "none"}
                        stroke="currentColor"
                        className="w-6 h-6"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center flex-wrap gap-4 mb-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-brand-orange theme-transition-colors">
                        ${product.price}
                    </span>
                    {product.originalPrice && (
                        <span className="text-lg line-through text-[color-mix(in_oklab,--foreground_50%,transparent)] theme-transition-colors">
                            ${product.originalPrice}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-1 bg-[--muted]/30 px-3 py-1.5 rounded-lg theme-transition-colors">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-medium text-[--foreground]">
                        {product.rating} ({product.reviewCount} reviews)
                    </span>
                </div>

                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${product.inStock ? 'text-green-600 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>

            {/* Description */}
            <p className="text-[color-mix(in_oklab,--foreground_80%,transparent)] mb-8 leading-relaxed text-lg theme-transition-colors">
                {product.description}
            </p>

            {/* Tags Section (Moved here as requested) */}
            <div className="mb-8 theme-transition-colors">
                <h4 className="text-xs font-bold mb-3 text-[color-mix(in_oklab,--foreground_60%,transparent)] uppercase tracking-wide">
                    Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-3 py-1.5 bg-[--muted] rounded-full text-[--foreground] theme-transition-colors">
                        #{product.brand}
                    </span>
                    <span className="text-xs px-3 py-1.5 bg-[--muted] rounded-full text-[--foreground] theme-transition-colors">
                        #{product.category.replace(/\s+/g, '')}
                    </span>
                    {product.features.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 bg-[--muted] rounded-full text-[--foreground] theme-transition-colors">
                            #{f.replace(/\s+/g, '')}
                        </span>
                    ))}
                </div>
            </div>

            {/* Configuration Placeholder */}
            <div className="mb-8 theme-transition-colors">
                <h3 className="font-bold mb-3 flex justify-between text-[--foreground]">
                    Configuration <span className="text-xs text-brand-orange border border-brand-orange px-2 py-0.5 rounded">Coming Soon</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                    {['Standard', 'Fly More Combo', 'Cine Premium'].map((cfg, idx) => (
                        <button
                            key={cfg}
                            onClick={() => setSelectedConfig(idx)}
                            className={`px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium ${selectedConfig === idx
                                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange shadow-sm'
                                    : 'border-[--muted] text-[--foreground] opacity-70 hover:opacity-100 hover:border-brand-orange/50'
                                }`}
                        >
                            {cfg}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-auto pt-6 theme-transition-colors">
                <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] duration-200 flex items-center justify-center gap-2 ${product.inStock
                            ? 'bg-brand-orange text-brand-black hover:bg-brand-yellow shadow-lg hover:shadow-xl'
                            : 'bg-[--muted] text-[--foreground] cursor-not-allowed opacity-50'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
}