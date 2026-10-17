import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const DEFAULT_SORT = 'name';

const toNumber = (value) => {
    if (value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
};

/**
 * The URL is the single source of truth for the catalog state:
 * /shop?category=FPV&brand=DJI&brand=iFlight&minPrice=100&search=mini&sort=price&page=2
 *
 * Links, reloads and the back button all work, and there is no state to keep in sync.
 * `filters` uses the shape the filter components work with:
 * { categories: [], brands: [], features: [], priceRange: { min, max } } (empty keys omitted).
 */
export function useCatalogQuery() {
    const [params, setParams] = useSearchParams();

    const query = useMemo(() => {
        const filters = {};
        const lists = { categories: 'category', brands: 'brand', features: 'feature' };
        for (const [key, param] of Object.entries(lists)) {
            const values = params.getAll(param);
            if (values.length) filters[key] = values;
        }
        const min = toNumber(params.get('minPrice'));
        const max = toNumber(params.get('maxPrice'));
        if (min !== undefined || max !== undefined) filters.priceRange = { min, max };

        return {
            filters,
            search: params.get('search') ?? '',
            sort: params.get('sort') ?? DEFAULT_SORT,
            page: Math.max(1, toNumber(params.get('page')) ?? 1),
        };
    }, [params]);

    const update = useCallback(
        (changes) => {
            const next = { ...query, page: 1, ...changes };
            const out = new URLSearchParams();
            (next.filters.categories ?? []).forEach((v) => out.append('category', v));
            (next.filters.brands ?? []).forEach((v) => out.append('brand', v));
            (next.filters.features ?? []).forEach((v) => out.append('feature', v));
            const { min, max } = next.filters.priceRange ?? {};
            if (min !== undefined) out.set('minPrice', min);
            if (max !== undefined) out.set('maxPrice', max);
            if (next.search) out.set('search', next.search);
            if (next.sort !== DEFAULT_SORT) out.set('sort', next.sort);
            if (next.page > 1) out.set('page', next.page);
            setParams(out);
        },
        [query, setParams]
    );

    return {
        ...query,
        setFilters: (filters) => update({ filters }),
        setSearch: (search) => update({ search }),
        setSort: (sort) => update({ sort }),
        setPage: (page) => update({ page }),
        clearAll: () => update({ filters: {}, search: '' }),
        /** Params in the shape GET /products expects. */
        apiParams: {
            category: query.filters.categories,
            brand: query.filters.brands,
            feature: query.filters.features,
            minPrice: query.filters.priceRange?.min,
            maxPrice: query.filters.priceRange?.max,
            search: query.search,
            sort: query.sort,
            page: query.page,
        },
    };
}
