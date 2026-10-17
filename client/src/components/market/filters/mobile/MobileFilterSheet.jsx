import { SORT_OPTIONS } from '../../../../constants/sortOptions';
import { useDraftFilters } from '../../../../hooks/useDraftFilters';
import FilterFields from '../FilterFields';

export default function MobileFilterSheet({
    isOpen,
    onClose,
    mode = 'filter',
    filters,
    onFiltersChange,
    sortBy,
    onSortChange,
    facets,
}) {
    const { draft, toggle, setPriceRange, clear, hasAny } = useDraftFilters(filters);

    const handleApply = () => {
        onFiltersChange(draft);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`slider-overlay lg:hidden ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className={`slider-panel slider-panel-bottom lg:hidden ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--muted)] flex-shrink-0">
                    <h2 className="text-xl font-bold text-[var(--foreground)] theme-transition-colors">
                        {mode === 'filter' ? 'Filters' : 'Sort By'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--foreground)] hover:text-brand-orange transition-colors duration-200"
                        aria-label="Close"
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
                            {hasAny && (
                                <div className="text-right">
                                    <button
                                        onClick={clear}
                                        className="text-sm text-brand-orange hover:text-brand-yellow transition-colors duration-200 font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}

                            <FilterFields
                                draft={draft}
                                facets={facets}
                                onToggle={toggle}
                                onPriceRangeChange={setPriceRange}
                                headerClass="font-semibold text-[var(--foreground)] mb-3 theme-transition-colors"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {SORT_OPTIONS.map((option) => (
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

                {/* Apply Button */}
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
