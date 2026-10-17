const QUICK_RANGES = [
    { label: 'Under $100', min: undefined, max: 100 },
    { label: '$100-$500', min: 100, max: 500 },
    { label: '$500-$1000', min: 500, max: 1000 },
    { label: 'Over $1000', min: 1000, max: undefined },
];

const parse = (raw) => (raw === '' ? undefined : Math.max(0, Number(raw)));

/** Fully controlled: `value` is { min, max } with either side optional. */
export default function PriceRange({ value, onChange }) {
    const min = value?.min;
    const max = value?.max;
    const inputClass =
        'w-full px-3 py-2 border border-[var(--muted)] rounded-lg bg-[var(--background)] text-[var(--foreground)] theme-transition-colors focus:border-brand-orange focus:outline-none';
    const labelClass =
        'block text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-1 theme-transition-colors';

    return (
        <div className="space-y-3">
            <div className="flex space-x-3">
                <label className="flex-1">
                    <span className={labelClass}>Min</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={min ?? ''}
                        onChange={(e) => onChange({ min: parse(e.target.value), max })}
                        className={inputClass}
                    />
                </label>
                <label className="flex-1">
                    <span className={labelClass}>Max</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="Any"
                        value={max ?? ''}
                        onChange={(e) => onChange({ min, max: parse(e.target.value) })}
                        className={inputClass}
                    />
                </label>
            </div>

            <div className="flex flex-wrap gap-2">
                {QUICK_RANGES.map((range) => (
                    <button
                        key={range.label}
                        type="button"
                        onClick={() => onChange({ min: range.min, max: range.max })}
                        className="text-xs px-2 py-1 border border-[var(--muted)] rounded-md hover:border-brand-orange hover:text-brand-orange transition-colors duration-200 theme-transition-colors"
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
