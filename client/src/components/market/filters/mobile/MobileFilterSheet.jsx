import { useState } from 'react';

import PriceRange from '../types/PriceRange';
import CategoryFilter from '../types/CategoryFilter';
import BrandFilter from '../types/BrandFilter';
import FeaturesFilter from '../types/FeaturesFilter';

export default function MobileFilterSheet({
    isOpen,
    onClose,
    mode = 'filter', // 'filter' or 'sort'
    filters,
    onFiltersChange,
    onClearFilters,
    sortBy,
    onSortChange
}) {
    const [localFilters, setLocalFilters] = useState(filters || {});

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...localFilters };

        if (!newFilters[filterType]) {
            newFilters[filterType] = [];
        }

        if (newFilters[filterType].includes(value)) {
            newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
            newFilters[filterType] = [...newFilters[filterType], value];
        }

        if (newFilters[filterType].length === 0) {
            delete newFilters[filterType];
        }

        setLocalFilters(newFilters);
    };

    const handlePriceRangeChange = (min, max) => {
        setLocalFilters({
            ...localFilters,
            priceRange: { min, max }
        });
    };

    const handleApply = () => {
        onFiltersChange(localFilters);
        onClose();
    };

    const handleClearAll = () => {
        const emptyFilters = {};
        setLocalFilters(emptyFilters);
        onClearFilters(emptyFilters);
    };

    const sortOptions = [
        { value: 'name', label: 'Name: A to Z' },
        { value: 'name-desc', label: 'Name: Z to A' },
        { value: 'price', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed bottom-0 left-0 right-0 bg-[var(--background)] rounded-t-2xl shadow-2xl z-50 lg:hidden transform transition-transform duration-300 theme-transition max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--muted)] flex-shrink-0">
                    <h2 className="text-xl font-bold text-[var(--foreground)] theme-transition">
                        {mode === 'filter' ? 'Filters' : 'Sort By'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--foreground)] hover:text-brand-orange transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {mode === 'filter' ? (
                        <div className="space-y-6">
                            {/* Clear All */}
                            {Object.keys(localFilters).length > 0 && (
                                <div className="text-right">
                                    <button
                                        onClick={handleClearAll}
                                        className="text-sm text-brand-orange hover:text-brand-yellow transition-colors duration-200 font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}

                            {/* Filter Components */}
                            <div>
                                <h4 className="font-semibold text-[var(--foreground)] mb-3 theme-transition">
                                    Price Range
                                </h4>
                                <PriceRange
                                    value={localFilters.priceRange}
                                    onChange={handlePriceRangeChange}
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold text-[var(--foreground)] mb-3 theme-transition">
                                    Categories
                                </h4>
                                <CategoryFilter
                                    selected={localFilters.categories || []}
                                    onChange={(value) => handleFilterChange('categories', value)}
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold text-[var(--foreground)] mb-3 theme-transition">
                                    Brands
                                </h4>
                                <BrandFilter
                                    selected={localFilters.brands || []}
                                    onChange={(value) => handleFilterChange('brands', value)}
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold text-[var(--foreground)] mb-3 theme-transition">
                                    Features
                                </h4>
                                <FeaturesFilter
                                    selected={localFilters.features || []}
                                    onChange={(value) => handleFilterChange('features', value)}
                                />
                            </div>
                        </div>
                    ) : (
                        /* Sort Options */
                        <div className="space-y-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onSortChange(option.value);
                                        onClose();
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 theme-transition ${option.value === sortBy
                                        ? 'bg-brand-orange/10 text-brand-orange font-medium border border-brand-orange'
                                        : 'text-[var(--foreground)] hover:bg-[color-mix(in_oklab,var(--foreground)_5%,var(--background))] border border-transparent'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Apply Button (only for filters) */}
                {mode === 'filter' && (
                    <div className="p-4 border-t border-[var(--muted)] flex-shrink-0">
                        <button
                            onClick={handleApply}
                            className="w-full bg-brand-orange text-brand-black font-semibold py-3 rounded-lg hover:bg-brand-yellow transition-all duration-300"
                        >
                            Apply Filters
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}