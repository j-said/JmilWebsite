import { mockProducts } from '../../../../data/mockProducts';

const allFeatures = [...new Set(mockProducts.flatMap(product => product.features))];

export default function FeaturesFilter({ selected, onChange }) {
    return (
        <div className="space-y-2 max-h-60 overflow-y-auto">
            {allFeatures.map((feature) => (
                <label key={feature} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={selected.includes(feature)}
                        onChange={() => onChange(feature)}
                        className="w-4 h-4 accent-brand-orange cursor-pointer"
                    />
                    <span className="text-[var(--foreground)] group-hover:text-brand-orange transition-colors duration-200 theme-transition-colors">
                        {feature}
                    </span>
                </label>
            ))}
        </div>
    );
}