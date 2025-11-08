export default function MobileFilterBar({
    filters,
    onOpenMobileSheet,
    productCount
}) {
    const activeFilterCount = Object.keys(filters).length;

    return (
        <div className="lg:hidden bg-[var(--background)] border-b border-[var(--muted)] theme-transition sticky top-0 z-30">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Results count */}
                    <div className="flex-1">
                        <p className="text-sm text-[var(--foreground)] theme-transition">
                            <span className="font-semibold">{productCount}</span> products
                        </p>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Sort Button */}
                        <button
                            onClick={() => onOpenMobileSheet('sort')}
                            className="flex items-center space-x-2 px-4 py-2 border border-[var(--muted)] rounded-lg text-sm font-medium text-[var(--foreground)] hover:border-brand-orange hover:text-brand-orange transition-colors duration-200"
                        >
                            <span>Sort</span>
                        </button>

                        {/* Filter Button */}
                        <button
                            onClick={() => onOpenMobileSheet('filter')}
                            className="flex items-center space-x-2 px-4 py-2 border border-[var(--muted)] rounded-lg text-sm font-medium text-[var(--foreground)] hover:border-brand-orange hover:text-brand-orange transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                            </svg>
                            <span>Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="bg-brand-orange text-brand-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}