import { useCart } from '../../../context/CartContext';
import CartItem from './CartItem';

export default function CartSidebar() {
    const {
        items,
        isOpen,
        closeCart,
        getCartTotal,
        clearCart,
        getCartItemsCount
    } = useCart();

    const itemCount = getCartItemsCount();
    const total = getCartTotal();

    return (
        <>
            {/* Overlay with smooth transition */}
            <div
                className={`fixed inset-0 bg-black z-40 transition-all duration-300 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeCart}
            />

            {/* Cart Sidebar with slide animation */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-[var(--background)] shadow-2xl z-50 transform transition-transform duration-300 theme-transition-colors overflow-hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--muted)] flex-shrink-0">
                    <h2 className="text-xl font-bold text-[var(--foreground)] theme-transition-colors">
                        Shopping Cart ({itemCount})
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 text-[var(--foreground)] hover:text-brand-orange transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-[var(--muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                            </svg>
                            <p className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] theme-transition-colors">
                                Your cart is empty
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[var(--muted)] p-4 flex-shrink-0">
                        {/* Total */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-[var(--foreground)] theme-transition-colors">
                                Total:
                            </span>
                            <span className="text-xl font-bold text-brand-orange theme-transition-colors">
                                ${total.toFixed(2)}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button className="w-full bg-brand-orange text-brand-black font-semibold py-3 rounded-lg hover:bg-brand-yellow transition-all duration-300 transform hover:scale-105">
                                Checkout
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full py-2 text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-[var(--foreground)] transition-colors duration-200"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}