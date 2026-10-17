import { useState, useEffect } from 'react';

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
import { useCatalogQuery } from '../hooks/useCatalogQuery';

const ITEMS_PER_PAGE = 12;

export default function MarketPage() {
    const catalog = useCatalogQuery();
    const { filters, search, sort, page, apiParams } = catalog;

    const [result, setResult] = useState({ items: [], total: 0, pages: 0 });
    const [facets, setFacets] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileSheet, setMobileSheet] = useState({ open: false, mode: 'filter' });

    useEffect(() => {
        shopService.getFacets().then(setFacets).catch(() => setFacets(null));
    }, []);

    // Re-fetch whenever the URL query changes. The abort signal drops stale
    // responses, so a slow earlier request can't overwrite a newer one.
    const queryKey = JSON.stringify(apiParams);
    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError(null);
        shopService
            .getProducts({ ...JSON.parse(queryKey), limit: ITEMS_PER_PAGE }, { signal: controller.signal })
            .then((data) => {
                setResult(data);
                setIsLoading(false);
            })
            .catch((err) => {
                if (controller.signal.aborted) return;
                setError(err);
                setResult({ items: [], total: 0, pages: 0 });
                setIsLoading(false);
            });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return () => controller.abort();
    }, [queryKey]);

    const removeFilter = (type, value) => {
        const next = { ...filters };
        if (type === 'priceRange') {
            delete next.priceRange;
        } else {
            next[type] = next[type].filter((item) => item !== value);
            if (!next[type].length) delete next[type];
        }
        catalog.setFilters(next);
    };

    const openMobileSheet = (mode) => setMobileSheet({ open: true, mode });
    const closeMobileSheet = () => setMobileSheet((prev) => ({ ...prev, open: false }));

    return (
        <div className="min-h-screen bg-[var(--background)] theme-transition-colors">
            <div className="lg:hidden">
                <MobileFilterBar
                    filters={filters}
                    onOpenMobileSheet={openMobileSheet}
                    productCount={result.total}
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
                        <SearchBar value={search} onChange={catalog.setSearch} />
                        <SortDropdown value={sort} onChange={catalog.setSort} />
                    </div>
                </div>
            </div>

            <div className="lg:hidden container mx-auto px-4 py-4">
                <SearchBar value={search} onChange={catalog.setSearch} placeholder="Search drones..." />
            </div>

            <div className="container mx-auto px-4 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="hidden lg:block lg:w-80 flex-shrink-0">
                        <FilterSidebar
                            filters={filters}
                            onFiltersChange={catalog.setFilters}
                            facets={facets}
                        />
                    </div>

                    <div className="flex-1">
                        <ActiveFilters
                            filters={filters}
                            onRemoveFilter={removeFilter}
                            onClearAll={catalog.clearAll}
                        />

                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] theme-transition-colors">
                                Showing {result.items.length} of {result.total} results
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl border border-red-400 bg-red-500/10 text-red-500">
                                Could not load products. Is the API running?
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
                            </div>
                        ) : (
                            <ProductGrid products={result.items} />
                        )}

                        <div className="mt-12">
                            <Pagination
                                currentPage={page}
                                totalPages={result.pages}
                                onPageChange={catalog.setPage}
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
                onFiltersChange={catalog.setFilters}
                sortBy={sort}
                onSortChange={catalog.setSort}
                facets={facets}
            />
        </div>
    );
}
