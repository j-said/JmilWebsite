import { useState, useEffect } from 'react';

export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
    const [localValue, setLocalValue] = useState(value || '');

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onChange(localValue);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [localValue, onChange]);

    const clearSearch = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <div className="relative w-full sm:w-80">
            <div className="relative">
                {/* Search Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[color-mix(in_oklab,var(--foreground)_40%,transparent)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-[var(--muted)] rounded-xl bg-[var(--background)] text-[var(--foreground)] placeholder-[color-mix(in_oklab,var(--foreground)_40%,transparent)] theme-transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                />

                {/* Clear Button */}
                {localValue && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        aria-label="Clear search"
                    >
                        <svg className="h-5 w-5 text-[color-mix(in_oklab,var(--foreground)_40%,transparent)] hover:text-[var(--foreground)] transition-colors duration-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Search Suggestions (optional) */}
            {localValue && (
                <div className="absolute z-10 w-full mt-1 bg-[var(--background)] border border-[var(--muted)] rounded-xl shadow-lg theme-transition-colors">
                    <div className="p-2">
                        <div className="text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] px-3 py-2 theme-transition-colors">
                            Press Enter to search for "{localValue}"
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}