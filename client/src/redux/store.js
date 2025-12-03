import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

// Subscribe to store updates to save cart to localStorage
store.subscribe(() => {
  const state = store.getState();
  // Only save the items, not the isOpen state
  localStorage.setItem(
    "jmil_cart",
    JSON.stringify({
      items: state.cart.items,
    })
  );
});
