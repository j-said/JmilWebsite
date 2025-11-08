export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }) {
    if (Object.keys(filters).length === 0) {
        return null;
    }

    const getFilterLabel = (type, value) => {
        switch (type) {
            case 'categories':
                return value;
            case 'brands':
                return `Brand: ${value}`;
            case 'features':
                return value;
            case 'priceRange':
                return `Price: $${filters.priceRange.min} - $${filters.priceRange.max}`;
            default:
                return value;
        }
    };

    const getFilterValues = (type, values) => {
        if (type === 'priceRange') {
            return [values];
        }
        return Array.isArray(values) ? values : [values];
    };

    return (
        <div className="bg-[var(--background)] border border-[var(--muted)] rounded-xl p-4 mb-6 theme-transition">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-[var(--foreground)] theme-transition">
                    Active Filters:
                </span>

                {Object.entries(filters).map(([type, values]) =>
                    getFilterValues(type, values).map((value) => (
                        <span
                            key={`${type}-${value}`}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-brand-orange/10 text-brand-orange theme-transition"
                        >
                            {getFilterLabel(type, value)}
                            <button
                                onClick={() => onRemoveFilter(type, value)}
                                className="ml-2 hover:text-brand-orange/70 transition-colors duration-200"
                                aria-label={`Remove ${getFilterLabel(type, value)} filter`}
                            >
                                ×
                            </button>
                        </span>
                    ))
                )}

                <button
                    onClick={onClearAll}
                    className="text-sm text-brand-orange hover:text-brand-yellow transition-colors duration-200 ml-2"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
}