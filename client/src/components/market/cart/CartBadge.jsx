import { useCart } from '../../../context/CartContext';


export default function CartBadge() {
    const { getCartItemsCount, toggleCart } = useCart();
    const itemCount = getCartItemsCount();

    return (
        <button
            onClick={toggleCart}
            className="relative p-2 text-[var(--foreground)] hover:text-brand-orange transition-colors duration-200"
            aria-label="Open cart"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
            </svg>

            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-brand-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
}