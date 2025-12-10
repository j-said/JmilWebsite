export default function OrderSummary({ items, total, onPlaceOrder, isSubmitting }) {
    return (
        <div className="bg-[var(--background)] p-6 rounded-2xl border border-[var(--muted)] shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-[var(--foreground)] border-b border-[var(--muted)] pb-4">
                Your Order
            </h2>

            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-[var(--muted)] flex-shrink-0">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-[var(--foreground)] line-clamp-2">
                                {item.name}
                            </h4>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-[color-mix(in_oklab,var(--foreground)_60%,transparent)]">
                                    Qty: {item.quantity}
                                </p>
                                <p className="text-sm font-bold text-brand-orange">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-[var(--muted)] pt-4 space-y-2">
                <div className="flex justify-between text-[var(--foreground)]">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--foreground)]">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[var(--foreground)] pt-2 border-t border-[var(--muted)] mt-2">
                    <span>Total</span>
                    <span className="text-brand-orange">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Submit Button (Mobile) */}
            <div className="lg:hidden mt-6">
                <button
                    type="button"
                    onClick={onPlaceOrder}
                    disabled={isSubmitting}
                    className={`w-full font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl
                        ${isSubmitting
                            ? 'bg-[var(--muted)] text-[var(--foreground)] opacity-50'
                            : 'bg-brand-orange text-brand-black hover:bg-brand-yellow'}`
                    }
                >
                    {isSubmitting ? 'Processing...' : `Place Order ($${total.toFixed(2)})`}
                </button>
            </div>
        </div>
    );
}