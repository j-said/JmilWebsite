import { mockProducts } from '../../../../data/mockProducts';

const categories = [...new Set(mockProducts.map(product => product.category))];

export default function CategoryFilter({ selected, onChange }) {
    return (
        <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={selected.includes(category)}
                        onChange={() => onChange(category)}
                        className="w-4 h-4 accent-brand-orange cursor-pointer"
                    />
                    <span className="text-[var(--foreground)] group-hover:text-brand-orange transition-colors duration-200 theme-transition-colors">
                        {category}
                    </span>
                </label>
            ))}
        </div>
    );
}