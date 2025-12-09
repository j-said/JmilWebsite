import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../redux/wishlistSlice';

export const useWishlist = () => {
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state.wishlist.items);

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    return {
        wishlist,
        toggleWishlist: (p) => dispatch(toggleWishlist(p)),
        isInWishlist,
        count: wishlist.length
    };
};