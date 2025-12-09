import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadWishlist = () => {
  try {
    const saved = localStorage.getItem("jmil_wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlist(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      // Side effect: save to localStorage
      localStorage.setItem("jmil_wishlist", JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
