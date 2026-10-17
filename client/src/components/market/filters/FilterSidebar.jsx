import { useDraftFilters } from '../../../hooks/useDraftFilters';
import FilterFields from './FilterFields';

export default function FilterSidebar({ filters, onFiltersChange, facets }) {
    const { draft, toggle, setPriceRange, clear, reset, isDirty, hasAny } = useDraftFilters(filters);
    const headerClass = "font-bold text-brand-orange dark:text-brand-yellow mb-3 theme-transition-colors";

    return (
        <div className="w-80 bg-[var(--background)] border border-[var(--muted)] rounded-xl p-6 theme-transition-colors sticky top-24">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-brand-orange dark:text-brand-yellow theme-transition-colors">Filters</h3>
                {hasAny && (
                    <button onClick={clear} className="text-sm text-[var(--foreground)] hover:text-brand-orange transition-colors duration-200 font-medium">Clear All</button>
                )}
            </div>

            <div className="space-y-6 mb-6">
                <FilterFields
                    draft={draft}
                    facets={facets}
                    onToggle={toggle}
                    onPriceRangeChange={setPriceRange}
                    headerClass={headerClass}
                />
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--muted)]">
                <button
                    onClick={() => onFiltersChange(draft)}
                    disabled={!isDirty}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${isDirty ? 'bg-brand-orange text-brand-black hover:bg-brand-yellow shadow-lg hover:shadow-xl transform hover:scale-105' : 'bg-[var(--muted)] text-[color-mix(in_oklab,var(--foreground)_40%,transparent)] cursor-not-allowed'}`}
                >
                    Apply Filters
                </button>
                {isDirty && (
                    <button onClick={reset} className="w-full py-2 px-4 text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-[var(--foreground)] transition-colors duration-200">Reset Changes</button>
                )}
            </div>
        </div>
    );
}
