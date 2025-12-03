import { useCart } from '../../../context/CartContext';

export default function CartItem({ item }) {
    const { removeFromCart, updateQuantity } = useCart();

    const handleQuantityChange = (newQuantity) => {
        updateQuantity(item.id, newQuantity);
    };

    const subtotal = item.price * item.quantity;

    return (
        <div className="flex items-center space-x-4 p-3 bg-[color-mix(in_oklab,var(--background)_95%,var(--muted))] rounded-lg theme-transition-colors">
            {/* Product Image */}
            <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            />

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--foreground)] text-sm line-clamp-2 theme-transition-colors">
                    {item.name}
                </h3>
                <p className="text-brand-orange font-semibold theme-transition-colors">
                    ${item.price}
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-[var(--muted)] rounded-md hover:border-brand-orange hover:text-brand-orange transition-colors duration-200"
                >
                    -
                </button>

                <span className="w-8 text-center text-[var(--foreground)] theme-transition-colors">
                    {item.quantity}
                </span>

                <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-[var(--muted)] rounded-md hover:border-brand-orange hover:text-brand-orange transition-colors duration-200"
                >
                    +
                </button>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => removeFromCart(item.id)}
                className="p-1 text-[color-mix(in_oklab,var(--foreground)_40%,transparent)] hover:text-red-500 transition-colors duration-200"
                aria-label="Remove item"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}