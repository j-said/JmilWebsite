import { useSelector, useDispatch } from 'react-redux';
import { 
    addToCart, removeFromCart, updateQuantity, clearCart, 
    toggleCart, closeCart, openCart 
} from '../redux/cartSlice';

export const useCart = () => {
    const dispatch = useDispatch();
    const { items, isOpen } = useSelector(state => state.cart);

    const getCartTotal = () => items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const getCartItemsCount = () => items.reduce((total, item) => total + item.quantity, 0);

    return {
        items,
        isOpen,
        addToCart: (p) => dispatch(addToCart(p)),
        removeFromCart: (id) => dispatch(removeFromCart(id)),
        updateQuantity: (id, qty) => dispatch(updateQuantity({ id, quantity: qty })),
        clearCart: () => dispatch(clearCart()),
        toggleCart: () => dispatch(toggleCart()),
        closeCart: () => dispatch(closeCart()),
        openCart: () => dispatch(openCart()),
        getCartTotal,
        getCartItemsCount
    };
};