import { useState, useEffect } from 'react';

import PriceRange from './types/PriceRange';
import CategoryFilter from './types/CategoryFilter';
import BrandFilter from './types/BrandFilter';
import FeaturesFilter from './types/FeaturesFilter';


export default function FilterSidebar({
    filters,
    onFiltersChange,
    onClearFilters
}) {
    const [localFilters, setLocalFilters] = useState(filters || {});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Sync when parent filters change
    useEffect(() => {
        setLocalFilters(filters || {});
        setHasUnsavedChanges(false);
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
        setHasUnsavedChanges(true);
    };

    const handlePriceRangeChange = (min, max) => {
        const newFilters = {
            ...localFilters,
            priceRange: { min, max }
        };
        setLocalFilters(newFilters);
        setHasUnsavedChanges(true);
    };

    const handleApplyFilters = () => {
        onFiltersChange(localFilters);
        setHasUnsavedChanges(false);
    };

    const handleClearAll = () => {
        const emptyFilters = {};
        setLocalFilters(emptyFilters);
        setHasUnsavedChanges(true);
    };

    const handleReset = () => {
        setLocalFilters(filters || {});
        setHasUnsavedChanges(false);
    };

    const hasActiveFilters = Object.keys(localFilters).length > 0;

    return (
        <div className="w-80 bg-[var(--background)] border border-[var(--muted)] rounded-xl p-6 theme-transition">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--foreground)] theme-transition">
                    Filters
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-brand-orange hover:text-brand-yellow transition-colors duration-200 font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Filters Content */}
            <div className="space-y-6 mb-6">
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

            {/* Apply/Reset Buttons */}
            <div className="space-y-3 pt-4 border-t border-[var(--muted)]">
                <button
                    onClick={handleApplyFilters}
                    disabled={!hasUnsavedChanges}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${hasUnsavedChanges
                        ? 'bg-brand-orange text-brand-black hover:bg-brand-yellow shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))] text-[color-mix(in_oklab,var(--foreground)_40%,transparent)] cursor-not-allowed'
                        }`}
                >
                    Apply Filters
                </button>

                {hasUnsavedChanges && (
                    <button
                        onClick={handleReset}
                        className="w-full py-2 px-4 text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-[var(--foreground)] transition-colors duration-200"
                    >
                        Reset Changes
                    </button>
                )}
            </div>

            {/* Unsaved Changes Indicator */}
            {hasUnsavedChanges && (
                <div className="mt-3 text-xs text-brand-orange text-center animate-pulse">
                    You have unsaved filter changes
                </div>
            )}
        </div>
    );
}