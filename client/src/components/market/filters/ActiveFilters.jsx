export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }) {
    const hasActiveFilters = Object.entries(filters).some(([type, value]) => {
        if (type === 'priceRange') return true;
        return Array.isArray(value) && value.length > 0;
    });

    if (!hasActiveFilters) {
        return null;
    }

    const getFilterLabel = (type, value) => {
        switch (type) {
            case 'categories': return value;
            case 'brands': return `Brand: ${value}`;
            case 'features': return value;
            case 'priceRange': {
                const { min, max } = filters.priceRange;
                if (min === undefined) return `Price: up to $${max}`;
                if (max === undefined) return `Price: from $${min}`;
                return `Price: $${min} - $${max}`;
            }
            default: return value;
        }
    };

    const getFilterValues = (type, values) => {
        if (type === 'priceRange') {
            return [values];
        }
        return Array.isArray(values) ? values : [values];
    };

    return (
        <div className="bg-[var(--background)] border border-[var(--muted)] rounded-xl p-4 mb-6 theme-transition-colors animate-fadeIn">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-[var(--foreground)] theme-transition-colors">
                    Active Filters:
                </span>

                {Object.entries(filters).map(([type, values]) => {
                    if (Array.isArray(values) && values.length === 0) return null;

                    return getFilterValues(type, values).map((value) => (
                        <span
                            key={type === 'priceRange' ? type : `${type}-${value}`}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-brand-orange/10 text-brand-orange theme-transition-colors"
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
                    ));
                })}

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