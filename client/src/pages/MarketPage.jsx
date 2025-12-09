import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductGrid from '../components/market/products/ProductGrid';
import FilterSidebar from '../components/market/filters/FilterSidebar';
import SearchBar from '../components/market/filters/SearchBar';
import SortDropdown from '../components/market/filters/SortDropdown';
import ActiveFilters from '../components/market/filters/ActiveFilters';
import MobileFilterBar from '../components/market/filters/mobile/MobileFilterBar';
import MobileFilterSheet from '../components/market/filters/mobile/MobileFilterSheet';
import Pagination from '../components/ui/Pagination';
import Breadcrumbs from '../components/ui/Breadcrumbs';

import { shopService } from '../services/shopService';

export default function MarketPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Data States
    const [products, setProducts] = useState([]);
    const [availableFilters, setAvailableFilters] = useState({ categories: [], brands: [], features: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);

    // Filter States
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [mobileSheet, setMobileSheet] = useState({ open: false, mode: 'filter' });
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 12;

    // Initial Load
    useEffect(() => {
        async function fetchFilters() {
            try {
                const data = await shopService.getFiltersInfo();
                setAvailableFilters(data);
            } catch (error) {
                console.error("Failed to load filters", error);
            }
        }
        fetchFilters();
    }, []);

    // Sync URL Params -> State
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const brandParam = searchParams.get('brand');

        if (categoryParam || brandParam) {
            setFilters(prev => ({
                ...prev,
                categories: categoryParam ? [decodeURIComponent(categoryParam)] : [],
                brands: brandParam ? [decodeURIComponent(brandParam)] : []
            }));
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [searchParams]);

    // Main Data Fetching (Simple & Clean)
    useEffect(() => {
        async function fetchProducts() {
            setIsLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    sort: sortBy,
                    search: searchQuery,
                    ...filters,
                };

                if (filters.priceRange) {
                    params.minPrice = filters.priceRange.min;
                    params.maxPrice = filters.priceRange.max;
                    delete params.priceRange;
                }

                const data = await shopService.getProducts(params);

                setProducts(data.products || []);
                setTotalProducts(data.total || 0);
            } catch (error) {
                console.error("Failed to fetch products", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        }

        // Debounce search slightly to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters, searchQuery, sortBy, currentPage]);


    // Handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    };

    const removeFilter = (type, value) => {
        const newFilters = { ...filters };
        if (type === 'priceRange') {
            delete newFilters.priceRange;
        } else if (Array.isArray(newFilters[type])) {
            newFilters[type] = newFilters[type].filter(item => item !== value);
            if (newFilters[type].length === 0) delete newFilters[type];
        }
        setFilters(newFilters);
        if ((type === 'categories' || type === 'brands') && searchParams.size > 0) {
            setSearchParams({});
        }
    };

    const clearAllFilters = () => {
        setFilters({});
        setSearchQuery('');
        setSearchParams({});
        setCurrentPage(1);
    };

    const openMobileSheet = (mode) => setMobileSheet({ open: true, mode });
    const closeMobileSheet = () => setMobileSheet(prev => ({ ...prev, open: false }));

    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-[var(--background)] theme-transition-colors">
            <div className="lg:hidden">
                <MobileFilterBar
                    filters={filters}
                    onOpenMobileSheet={openMobileSheet}
                    productCount={totalProducts}
                />
            </div>

            <div className="hidden lg:block container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <Breadcrumbs />
                        <h1 className="text-3xl font-bold text-[var(--foreground)] theme-transition-colors">
                            Drone Shop
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        <SortDropdown value={sortBy} onChange={setSortBy} />
                    </div>
                </div>
            </div>

            <div className="lg:hidden container mx-auto px-4 py-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search drones..." />
            </div>

            <div className="container mx-auto px-4 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="hidden lg:block lg:w-80 flex-shrink-0">
                        <FilterSidebar
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            onClearFilters={clearAllFilters}
                            availableFilters={availableFilters}
                        />
                    </div>

                    <div className="flex-1">
                        <ActiveFilters
                            filters={filters}
                            onRemoveFilter={removeFilter}
                            onClearAll={clearAllFilters}
                        />

                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] theme-transition-colors">
                                Showing {products.length} of {totalProducts} results
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
                            </div>
                        ) : (
                            <ProductGrid
                                products={products}
                                title=""
                                subtitle=""
                            />
                        )}

                        <div className="mt-12">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <MobileFilterSheet
                isOpen={mobileSheet.open}
                onClose={closeMobileSheet}
                mode={mobileSheet.mode}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearAllFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                availableFilters={availableFilters}
            />
        </div>
    );
}