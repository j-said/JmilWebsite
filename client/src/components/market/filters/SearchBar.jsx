import { useState, useEffect } from 'react';

export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
    const [localValue, setLocalValue] = useState(value || '');

    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onChange(localValue);
        }
    };

    const handleSearchClick = () => {
        onChange(localValue);
    };

    const clearSearch = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <div className="relative w-full sm:w-96">
            <div className="relative flex items-center">
                {/* Input */}
                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-4 pr-12 py-3 border border-[var(--muted)] rounded-full bg-[var(--background)] text-[var(--foreground)] placeholder-[color-mix(in_oklab,var(--foreground)_40%,transparent)] theme-transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 shadow-sm"
                />

                {/* Clear 'X' Button */}
                {localValue && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-12 p-1 text-[color-mix(in_oklab,var(--foreground)_40%,transparent)] hover:text-[var(--foreground)] transition-colors"
                        aria-label="Clear search"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Round Search Button */}
                <button
                    onClick={handleSearchClick}
                    className="absolute right-1 p-2 bg-brand-orange text-brand-black rounded-full hover:bg-brand-yellow transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
                    aria-label="Search"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}