import { useState } from 'react';

/**
 * Editable copy of the applied filters, so the user can tick several boxes and
 * apply them at once. Shared by the desktop sidebar and the mobile sheet.
 */
export function useDraftFilters(applied) {
    const [draft, setDraft] = useState(applied);
    const [base, setBase] = useState(applied);

    // Applied filters changed from outside (URL, "Clear all", chip removed):
    // reset the draft during render instead of syncing in an effect.
    if (applied !== base) {
        setBase(applied);
        setDraft(applied);
    }

    const toggle = (type, value) => {
        setDraft((prev) => {
            const current = prev[type] ?? [];
            const nextValues = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            const next = { ...prev, [type]: nextValues };
            if (!nextValues.length) delete next[type];
            return next;
        });
    };

    const setPriceRange = (range) => {
        setDraft((prev) => {
            const next = { ...prev, priceRange: range };
            if (range.min === undefined && range.max === undefined) delete next.priceRange;
            return next;
        });
    };

    return {
        draft,
        toggle,
        setPriceRange,
        clear: () => setDraft({}),
        reset: () => setDraft(applied),
        isDirty: JSON.stringify(draft) !== JSON.stringify(applied),
        hasAny: Object.keys(draft).length > 0,
    };
}
