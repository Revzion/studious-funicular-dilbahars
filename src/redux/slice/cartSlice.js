import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],           // Authenticated user cart items
  guestItems: [],      // Guest cart items with product details
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
  totalDiscount: 0,    // Added for consistency with Cart.jsx
  status: 'idle',
  error: null,
};

// Helper function to calculate shipping based on company profile
const calculateShipping = (subtotal, companyProfile) => {
  if (!companyProfile || !companyProfile.shipping) {
    return 0; // No shipping if company profile not available
  }

  const { minAmount, shippingCharge } = companyProfile.shipping;
  return subtotal >= minAmount ? 0 : shippingCharge;
};

// Helper function to recalculate cart totals
const recalculateCartTotals = (state, companyProfile = null) => {
  state.itemCount = state.items.reduce(
    (total, item) => total + item.product_quantity,
    0
  );
  state.subtotal = state.items.reduce(
    (total, item) =>
      total + (item.productDetails?.mrp || item.productDetails?.saleingPrice || 0) * item.product_quantity,
    0
  );
  state.totalDiscount = state.items.reduce(
    (total, item) =>
      total + (((item.productDetails?.mrp || item.productDetails?.saleingPrice || 0) * (item.productDetails?.discount || 0)) / 100) * item.product_quantity,
    0
  );
  state.shipping = calculateShipping(state.subtotal, companyProfile);
  state.total = state.subtotal + state.shipping - state.totalDiscount;
};

// Helper function to recalculate guest cart totals
const recalculateGuestCartTotals = (state, companyProfile = null) => {
  state.itemCount = state.guestItems.reduce(
    (total, item) => total + item.product_quantity,
    0
  );
  state.subtotal = state.guestItems.reduce(
    (total, item) =>
      total + (item.productDetails?.mrp || item.productDetails?.saleingPrice || 0) * item.product_quantity,
    0
  );
  state.totalDiscount = state.guestItems.reduce(
    (total, item) =>
      total + (((item.productDetails?.mrp || item.productDetails?.saleingPrice || 0) * (item.productDetails?.discount || 0)) / 100) * item.product_quantity,
    0
  );
  state.shipping = calculateShipping(state.subtotal, companyProfile);
  state.total = state.subtotal + state.shipping - state.totalDiscount;
};

// Helper function to save guest cart to localStorage
const saveGuestCartToLocalStorage = (guestItems) => {
  try {
    localStorage.setItem('guestCart', JSON.stringify(guestItems));
  } catch (error) {
    console.error("Failed to save guest cart to localStorage:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Updated to include mrp and discount
    addToCart: (state, action) => {
      const { product_id, product_quantity, productDetails } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product_id === product_id
      );

      if (existingItem) {
        existingItem.product_quantity += product_quantity;
      } else {
        state.items.push({
          product_id,
          product_quantity,
          productDetails: {
            image: productDetails.image,
            saleingPrice: productDetails.saleingPrice,
            sku: productDetails.sku,
            category: productDetails.category,
            mrp: productDetails.mrp || productDetails.saleingPrice || 0, // Fallback
            discount: productDetails.discount || 0, // Fallback
          },
          _id: action.payload._id,
        });
      }

      recalculateCartTotals(state, action.payload.companyProfile);
    },

    updateQuantity: (state, action) => {
      const { product_id, quantity } = action.payload;
      const item = state.items.find((item) => item.product_id === product_id);

      if (item) {
        item.product_quantity = Math.max(0, quantity);
        recalculateCartTotals(state, action.payload.companyProfile);
      }
    },

    removeFromCart: (state, action) => {
      const { product_id, companyProfile } = action.payload;
      state.items = state.items.filter(
        (item) => item.product_id !== product_id
      );

      recalculateCartTotals(state, companyProfile);
    },

    setCart: (state, action) => {
      const { items, companyProfile } = action.payload;
      state.items = items || action.payload; // Support both new and old payload structure
      recalculateCartTotals(state, companyProfile);
    },

    updateShipping: (state, action) => {
      const companyProfile = action.payload;
      state.shipping = calculateShipping(state.subtotal, companyProfile);
      state.total = state.subtotal + state.shipping - state.totalDiscount;
    },

    clearCart: (state) => {
      return initialState;
    },

    // Updated to include mrp and discount
    addGuestItem: (state, action) => {
      const { product_id, product_quantity, productDetails } = action.payload;
      const existingItemIndex = state.guestItems.findIndex(
        item => item.product_id === product_id
      );

      if (existingItemIndex !== -1) {
        state.guestItems[existingItemIndex].product_quantity += product_quantity;
      } else {
        state.guestItems.push({
          product_id,
          product_quantity,
          productDetails: {
            image: productDetails.image,
            saleingPrice: productDetails.saleingPrice,
            sku: productDetails.sku,
            category: productDetails.category,
            mrp: productDetails.mrp || productDetails.saleingPrice || 0, // Fallback to saleingPrice
            discount: productDetails.discount || 0, // Default to 0
          },
          _id: productDetails._id,
        });
      }

      recalculateGuestCartTotals(state, action.payload.companyProfile);
      saveGuestCartToLocalStorage(state.guestItems);
    },

    updateGuestItemQuantity: (state, action) => {
      const { product_id, quantity } = action.payload;
      const itemIndex = state.guestItems.findIndex(
        item => item.product_id === product_id
      );

      if (itemIndex !== -1) {
        if (quantity <= 0) {
          state.guestItems.splice(itemIndex, 1);
        } else {
          state.guestItems[itemIndex].product_quantity = quantity;
        }
        
        recalculateGuestCartTotals(state);
        saveGuestCartToLocalStorage(state.guestItems);
      }
    },

    removeGuestItem: (state, action) => {
      const { product_id } = action.payload;
      state.guestItems = state.guestItems.filter(item => item.product_id !== product_id);
      recalculateGuestCartTotals(state);
      saveGuestCartToLocalStorage(state.guestItems);
    },

    clearGuestCart: (state) => {
      state.guestItems = [];
      if (state.items.length === 0) {
        state.itemCount = 0;
        state.subtotal = 0;
        state.shipping = 0;
        state.total = 0;
        state.totalDiscount = 0;
      }
      saveGuestCartToLocalStorage(null);
    },

    loadGuestItemsFromStorage: (state, action) => {
      const guestItems = action.payload || [];
      state.guestItems = guestItems.map(item => ({
        ...item,
        productDetails: {
          ...item.productDetails,
          mrp: item.productDetails.mrp || item.productDetails.saleingPrice || 0,
          discount: item.productDetails.discount || 0,
        },
      }));
      recalculateGuestCartTotals(state);
    },

    setCartStatus: (state, action) => {
      state.status = action.payload;
    },

    setCartError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  setCart,
  updateShipping,
  clearCart,
  addGuestItem,
  updateGuestItemQuantity,
  removeGuestItem,
  clearGuestCart,
  loadGuestItemsFromStorage,
  setCartStatus,
  setCartError,
} = cartSlice.actions;

// Enhanced selectors
export const selectCartItems = (state) => state.cart.items;
export const selectGuestCartItems = (state) => state.cart.guestItems;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;

export const selectCurrentCartItems = (state, isLoggedIn) => 
  isLoggedIn ? state.cart.items : state.cart.guestItems;

export default cartSlice.reducer;