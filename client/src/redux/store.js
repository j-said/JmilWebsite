import { configureStore } from '@reduxjs/toolkit';
import { TOKEN_KEY, configureAuth } from '../api/axiosClient';
import authReducer, { logout } from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    },
});

configureAuth({
    getToken: () => store.getState().auth.token,
    onUnauthorized: () => store.dispatch(logout()),
});

// Persistence lives here, not inside reducers (reducers must stay pure).
// Each slice is written only when its reference actually changes.
const persisted = [
    { select: (s) => s.cart.items, key: 'jmil_cart', serialize: (items) => JSON.stringify({ items }) },
    { select: (s) => s.wishlist.items, key: 'jmil_wishlist', serialize: JSON.stringify },
    { select: (s) => s.auth.token, key: TOKEN_KEY, serialize: (token) => token },
];
let previous = persisted.map(({ select }) => select(store.getState()));

store.subscribe(() => {
    const state = store.getState();
    persisted.forEach(({ select, key, serialize }, i) => {
        const value = select(state);
        if (value === previous[i]) return;
        previous[i] = value;
        try {
            if (value === null || value === undefined) localStorage.removeItem(key);
            else localStorage.setItem(key, serialize(value));
        } catch {
            // Storage can be unavailable (private mode, quota); the app keeps working in memory.
        }
    });
});
