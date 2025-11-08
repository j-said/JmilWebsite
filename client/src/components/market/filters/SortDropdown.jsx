import { useState } from 'react';

const sortOptions = [
    { value: 'name', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'bestselling', label: 'Best Selling' },
];

export default function SortDropdown({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = sortOptions.find(option => option.value === value) || sortOptions[0];

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full sm:w-48">
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-[var(--muted)] rounded-xl bg-[var(--background)] text-[var(--foreground)] theme-transition hover:border-brand-orange focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="text-sm font-medium">{selectedOption.label}</span>
                <svg
                    className={`h-5 w-5 text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Options List */}
                    <div className="absolute z-20 w-full mt-1 bg-[var(--background)] border border-[var(--muted)] rounded-xl shadow-lg theme-transition">
                        <ul
                            className="py-2 max-h-60 overflow-auto"
                            role="listbox"
                        >
                            {sortOptions.map((option) => (
                                <li key={option.value}>
                                    <button
                                        onClick={() => handleSelect(option.value)}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 theme-transition ${option.value === value
                                                ? 'bg-brand-orange/10 text-brand-orange font-medium'
                                                : 'text-[var(--foreground)] hover:bg-[color-mix(in_oklab,var(--foreground)_5%,var(--background))]'
                                            }`}
                                        role="option"
                                        aria-selected={option.value === value}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}