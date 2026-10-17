export default function CheckboxListFilter({ selected = [], onChange, options = [] }) {
    return (
        <div className="space-y-2 max-h-60 overflow-y-auto">
            {options.map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => onChange(option)}
                        className="w-4 h-4 accent-brand-orange cursor-pointer"
                    />
                    <span className="text-[var(--foreground)] group-hover:text-brand-orange transition-colors duration-200 theme-transition-colors">
                        {option}
                    </span>
                </label>
            ))}
        </div>
    );
}
