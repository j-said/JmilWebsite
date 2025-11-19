import { useState, useEffect } from 'react';

export default function PriceRange({ value, onChange }) {
    const [minPrice, setMinPrice] = useState(value?.min?.toString() || '');
    const [maxPrice, setMaxPrice] = useState(value?.max?.toString() || '');

    // Only update parent when values change (no auto-apply)
    useEffect(() => {
        if (minPrice !== '' || maxPrice !== '') {
            onChange(
                minPrice ? parseInt(minPrice) : 0,
                maxPrice ? parseInt(maxPrice) : 10000
            );
        }
    }, [minPrice, maxPrice, onChange]);

    return (
        <div className="space-y-3">
            <div className="flex space-x-3">
                <div className="flex-1">
                    <label className="block text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-1 theme-transition-colors">
                        Min
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--muted)] rounded-lg bg-[var(--background)] text-[var(--foreground)] theme-transition-colors focus:border-brand-orange focus:outline-none"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-1 theme-transition-colors">
                        Max
                    </label>
                    <input
                        type="number"
                        placeholder="10000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--muted)] rounded-lg bg-[var(--background)] text-[var(--foreground)] theme-transition-colors focus:border-brand-orange focus:outline-none"
                    />
                </div>
            </div>

            {/* Quick select buttons */}
            <div className="flex flex-wrap gap-2">
                {[
                    { label: 'Under $100', min: 0, max: 100 },
                    { label: '$100-$500', min: 100, max: 500 },
                    { label: '$500-$1000', min: 500, max: 1000 },
                    { label: 'Over $1000', min: 1000, max: 10000 }
                ].map((range) => (
                    <button
                        key={range.label}
                        onClick={() => {
                            setMinPrice(range.min.toString());
                            setMaxPrice(range.max.toString());
                        }}
                        className="text-xs px-2 py-1 border border-[var(--muted)] rounded-md hover:border-brand-orange hover:text-brand-orange transition-colors duration-200 theme-transition-colors"
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </div>
    );
}