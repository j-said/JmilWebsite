import { mockProducts } from '../../../../data/mockProducts';

const brands = [...new Set(mockProducts.map(product => product.brand))];

export default function BrandFilter({ selected, onChange }) {
    return (
        <div className="space-y-2 max-h-60 overflow-y-auto">
            {brands.map((brand) => (
                <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={selected.includes(brand)}
                        onChange={() => onChange(brand)}
                        className="w-4 h-4 accent-brand-orange cursor-pointer"
                    />
                    <span className="text-[var(--foreground)] group-hover:text-brand-orange transition-colors duration-200 theme-transition-colors">
                        {brand}
                    </span>
                </label>
            ))}
        </div>
    );
}