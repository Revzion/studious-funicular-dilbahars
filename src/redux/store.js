import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice";
import b2bUserReducer from "./slice/b2bUserSlice";
import companyReducer from "./slice/companySlice";

// NEW: Function to load guest cart from localStorage
const loadGuestCartFromLocalStorage = () => {
  try {
    const guestCartData = localStorage.getItem('guestCart');
    if (guestCartData) {
      const parsedData = JSON.parse(guestCartData);
      // Validate the structure to prevent invalid data
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
    }
    return [];
  } catch (error) {
    console.error("Failed to load guest cart from localStorage:", error);
    return [];
  }
};

const store = configureStore({
  reducer: {
    user: userReducer,
    b2bUser: b2bUserReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    company: companyReducer,
  },
  // NEW: Inject preloaded state for guest cart
  preloadedState: {
    cart: {
      items: [],
      guestItems: loadGuestCartFromLocalStorage(),
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      total: 0,
      status: 'idle',
      error: null,
    },
  },
});

export default store;