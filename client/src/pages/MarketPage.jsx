import { useState, useMemo } from 'react';

import ProductGrid from '../components/market/products/ProductGrid';
import FilterSidebar from '../components/market/filters/FilterSidebar';
import SearchBar from '../components/market/filters/SearchBar';
import SortDropdown from '../components/market/filters/SortDropdown';
import ActiveFilters from '../components/market/filters/ActiveFilters';
import MobileFilterBar from '../components/market/filters/mobile/MobileFilterBar';
import MobileFilterSheet from '../components/market/filters/mobile/MobileFilterSheet';

import { mockProducts } from '../data/mockProducts';

export default function MarketPage() {
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [mobileSheet, setMobileSheet] = useState({ open: false, mode: 'filter' });

    // Filter products based on search and filters
    const filteredProducts = useMemo(() => {
        let results = mockProducts;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (filters.categories) {
            results = results.filter(product =>
                filters.categories.some(category =>
                    product.category === category
                )
            );
        }

        // Brand filter
        if (filters.brands) {
            results = results.filter(product =>
                filters.brands.some(brand =>
                    product.brand === brand
                )
            );
        }

        //Hv Price range filter
        if (filters.priceRange) {
            results = results.filter(product =>
                product.price >= filters.priceRange.min &&
                product.price <= filters.priceRange.max
            );
        }

        // Rating filter
        if (filters.ratings) {
            results = results.filter(product =>
                filters.ratings.some(rating =>
                    product.rating >= rating
                )
            );
        }

        // Features filter
        if (filters.features) {
            results = results.filter(product =>
                filters.features.some(feature =>
                    product.features?.includes(feature)
                )
            );
        }

        // Sort products
        results.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'newest':
                    return b.id - a.id;
                default:
                    return 0;
            }
        });

        return results;
    }, [filters, searchQuery, sortBy]);

    const removeFilter = (type, value) => {
        const newFilters = { ...filters };

        if (type === 'priceRange') {
            delete newFilters.priceRange;
        } else if (Array.isArray(newFilters[type])) {
            newFilters[type] = newFilters[type].filter(item => item !== value);
            if (newFilters[type].length === 0) {
                delete newFilters[type];
            }
        }

        setFilters(newFilters);
    };

    const clearAllFilters = () => {
        setFilters({});
        setSearchQuery('');
    };

    const openMobileSheet = (mode) => {
        setMobileSheet({ open: true, mode });
    };

    const closeMobileSheet = () => {
        // FIX: Не скидаємо mode на 'filter', щоб уникнути "стрибка" контенту під час анімації закриття.
        setMobileSheet(prev => ({ ...prev, open: false }));
    };

    return (
        <div className="min-h-screen bg-[var(--background)] theme-transition-colors">
            {/* Mobile Filter Bar - Hidden on desktop */}
            <div className="lg:hidden">
                <MobileFilterBar
                    filters={filters}
                    onOpenMobileSheet={openMobileSheet}
                    productCount={filteredProducts.length}
                />
            </div>

            {/* Search and Sort Header - Hidden on mobile */}
            <div className="hidden lg:block container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <h1 className="text-3xl font-bold text-[var(--foreground)] theme-transition-colors">
                        Drone Shop
                    </h1>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                        <SortDropdown
                            value={sortBy}
                            onChange={setSortBy}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="lg:hidden container mx-auto px-4 py-4">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search drones..."
                />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block lg:w-80 flex-shrink-0">
                        <FilterSidebar
                            filters={filters}
                            onFiltersChange={setFilters}
                            onClearFilters={clearAllFilters}
                        />
                    </div>

                    {/* Products Area */}
                    <div className="flex-1">
                        {/* Active Filters */}
                        <ActiveFilters
                            filters={filters}
                            onRemoveFilter={removeFilter}
                            onClearAll={clearAllFilters}
                        />

                        {/* Results Count */}
                        <div className="mb-6">
                            <p className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] theme-transition-colors">
                                Showing {filteredProducts.length} of {mockProducts.length} products
                            </p>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid
                            products={filteredProducts}
                            title=""
                            subtitle=""
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Filter Sheet */}
            <MobileFilterSheet
                isOpen={mobileSheet.open}
                onClose={closeMobileSheet}
                mode={mobileSheet.mode}
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearAllFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />
        </div>
    );
}