import PriceRange from './types/PriceRange';
import CheckboxListFilter from './types/CheckboxListFilter';

const LIST_FILTERS = [
    { key: 'categories', title: 'Categories' },
    { key: 'brands', title: 'Brands' },
    { key: 'features', title: 'Features' },
];

/** Filter inputs shared by the desktop sidebar and the mobile sheet. */
export default function FilterFields({ draft, facets, onToggle, onPriceRangeChange, headerClass }) {
    return (
        <>
            <div>
                <h4 className={headerClass}>Price Range</h4>
                <PriceRange value={draft.priceRange} onChange={onPriceRangeChange} />
            </div>
            {LIST_FILTERS.map(({ key, title }) => (
                <div key={key}>
                    <h4 className={headerClass}>{title}</h4>
                    <CheckboxListFilter
                        selected={draft[key]}
                        onChange={(value) => onToggle(key, value)}
                        options={facets?.[key] ?? []}
                    />
                </div>
            ))}
        </>
    );
}
