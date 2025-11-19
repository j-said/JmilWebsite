import { useState, useEffect } from 'react';

import PriceRange from '../types/PriceRange';
import CategoryFilter from '../types/CategoryFilter';
import BrandFilter from '../types/BrandFilter';
import FeaturesFilter from '../types/FeaturesFilter';

export default function MobileFilterSheet({
    isOpen,
    onClose,
    mode = 'filter',
    filters,
    onFiltersChange,
    onClearFilters,
    sortBy,
    onSortChange
}) {
    const [localFilters, setLocalFilters] = useState(filters || {});

    // Sync local filters when props change
    useEffect(() => {
        setLocalFilters(filters || {});
    }, [filters]);

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
    ];

    return (
        <>
            {/* Overlay with smooth transition */}
            <div
                className={`slider-overlay lg:hidden ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Bottom Sheet with smooth slide animation */}
            <div className={`slider-panel slider-panel-bottom lg:hidden ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--muted)] flex-shrink-0">
                    <h2 className="text-xl font-bold text-[var(--foreground)] theme-transition-colors">
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
                            {/*QL Clear All */}
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
                                <h4 className="font-semibold text-[var(--foreground)] mb-3 theme-transition-colors">
                                    Price Range
                                </h4>
                                <PriceRange
                                    value={localFilters.priceRange}
                                    onChange={handlePriceRangeChange}
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold text-[var(--foreground)] mb-3 theme-transition-colors">
                                    Categories
                                </h4>
                                <CategoryFilter
                                    selected={localFilters.categories || []}
                                    onChange={(value) => handleFilterChange('categories', value)}
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold text-[var(--foreground)] mb-3 theme-transition-colors">
                                    Brands
                                </h4>
                                <BrandFilter
                                    selected={localFilters.brands || []}
                                    onChange={(value) => handleFilterChange('brands', value)}
                                />
                            </div>

                            <div>
                                <h4 className="font-semibold text-[var(--foreground)] mb-3 theme-transition-colors">
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
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 theme-transition-colors ${option.value === sortBy
                                        ? 'bg-brand-orange/10 text-brand-orange font-medium border border-brand-orange transform scale-105'
                                        : 'text-[var(--foreground)] hover:bg-[color-mix(in_oklab,var(--foreground)_5%,var(--background))] border border-transparent hover:border-brand-orange/30'
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
                            className="w-full bg-brand-orange text-brand-black font-semibold py-3 rounded-lg hover:bg-brand-yellow transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Apply Filters
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}