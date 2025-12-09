import { useState, useEffect } from 'react';

export default function PriceRange({ value, onChange }) {
    // Оператор ?? (nullish coalescing) важливий, щоб 0 не перетворювався на ''
    const [minPrice, setMinPrice] = useState(value?.min ?? '');
    const [maxPrice, setMaxPrice] = useState(value?.max ?? '');

    // Синхронізація ВНИЗ (Parent -> Child)
    // Спрацьовує, коли змінюються пропси (наприклад, натиснуто "Clear All" або завантажено URL)
    useEffect(() => {
        const propMin = value?.min !== undefined ? value.min.toString() : '';
        const propMax = value?.max !== undefined ? value.max.toString() : '';

        // Оновлюємо локальні поля, тільки якщо значення від батька відрізняються від поточних.
        // Це дозволяє уникнути проблем з курсором при вводі, але гарантує очищення полів при Reset.
        if (propMin !== minPrice) {
            setMinPrice(propMin);
        }
        if (propMax !== maxPrice) {
            setMaxPrice(propMax);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]); // Залежність ТІЛЬКИ від value

    // Обробники вводу (Child -> Parent)
    const handleMinChange = (e) => {
        const newVal = e.target.value;
        setMinPrice(newVal); // Миттєве оновлення UI

        // Передача даних батьку
        const numMin = newVal === '' ? 0 : parseInt(newVal);
        const numMax = maxPrice === '' ? 10000 : parseInt(maxPrice);

        if (!isNaN(numMin)) {
            onChange(numMin, numMax);
        }
    };

    const handleMaxChange = (e) => {
        const newVal = e.target.value;
        setMaxPrice(newVal); // Миттєве оновлення UI

        const numMax = newVal === '' ? 10000 : parseInt(newVal);
        const numMin = minPrice === '' ? 0 : parseInt(minPrice);

        if (!isNaN(numMax)) {
            onChange(numMin, numMax);
        }
    };

    const handleQuickSelect = (min, max) => {
        // Оновлюємо і локальний стан, і батьківський компонент
        setMinPrice(min.toString());
        setMaxPrice(max.toString());
        onChange(min, max);
    };

    return (
        <div className="space-y-3">
            <div className="flex space-x-3">
                <div className="flex-1">
                    <label className="block text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-1 theme-transition-colors">
                        Min
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={handleMinChange}
                        className="w-full px-3 py-2 border border-[var(--muted)] rounded-lg bg-[var(--background)] text-[var(--foreground)] theme-transition-colors focus:border-brand-orange focus:outline-none"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-1 theme-transition-colors">
                        Max
                    </label>
                    <input
                        type="number"
                        placeholder="10000"
                        value={maxPrice}
                        onChange={handleMaxChange}
                        className="w-full px-3 py-2 border border-[var(--muted)] rounded-lg bg-[var(--background)] text-[var(--foreground)] theme-transition-colors focus:border-brand-orange focus:outline-none"
                    />
                </div>
            </div>

            {/* Quick select buttons */}
            <div className="flex flex-wrap gap-2">
                {[
                    { label: 'Under $100', min: 0, max: 100 },
                    { label: '$100-$500', min: 100, max: 500 },
                    { label: '$500-$1000', min: 500, max: 1000 },
                    { label: 'Over $1000', min: 1000, max: 10000 }
                ].map((range) => (
                    <button
                        key={range.label}
                        onClick={() => handleQuickSelect(range.min, range.max)}
                        className="text-xs px-2 py-1 border border-[var(--muted)] rounded-md hover:border-brand-orange hover:text-brand-orange transition-colors duration-200 theme-transition-colors"
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </div>
    );
}