import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCartService,
  getCartService,
  removeFromCartService,
  updateProductQuantityService,
  clearCartService,
} from "../../services/cartServices";
import { setCart, addToCart, clearCart, clearGuestCart, setCartStatus, setCartError } from "../slice/cartSlice";

// 1. Fetch Cart Items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await getCartService();
      console.log('response', response)
      dispatch(setCart(response.cart));
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

// 2. Add to Cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const { product_id, product_quantity } = data;
      if (!product_id || !product_quantity) {
        console.error("Invalid cart data:", data);
        throw new Error("Invalid product ID or quantity");
      }

      const normalizedData = {
        product_id,
        product_quantity: Number(product_quantity),
      };

      const response = await addToCartService(normalizedData);

      const cart = response.cart || response.data?.cart;
      if (!cart) {
        console.error("No cart in response:", response);
        throw new Error("Cart not returned from server");
      }

      const updatedProduct = cart.product?.find(
        (item) =>
          item.product_id === product_id || item.product_id?._id === product_id
      );

      if (!updatedProduct) {
        console.error("Added product not found in cart:", product_id);
        throw new Error("Added product not found in cart");
      }

      const productDetails = updatedProduct.product || {
        sku: "Unknown Product",
        saleingPrice: 0,
        image: null,
      };

      dispatch(
        addToCart({
          _id: cart._id,
          product_id,
          product_quantity: normalizedData.product_quantity,
          productDetails,
        })
      );

      const updatedCart = await dispatch(fetchCartItems()).unwrap();

      return cart;
    } catch (error) {
      console.error("addItemToCart error:", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Failed to add item to cart"
      );
    }
  }
);

// 3. Remove from Cart
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await removeFromCartService(productId);
      dispatch(setCart(response.cart));
      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to remove item from cart"
      );
    }
  }
);

// 4. Update Quantity
export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateProductQuantityService(data);
      const updatedCart = response.cart.product.map((item) => {
        const product = item.product_id;
        return {
          _id: item._id,
          product_id: product._id,
          product_quantity: item.product_quantity,
          productDetails: {
            sku: product.sku,
            saleingPrice: product.saleingPrice,
            image: product.image?.[0] || null,
          },
        };
      });

      dispatch(setCart(updatedCart));
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update item quantity");
    }
  }
);

// 5. Clear User Cart
export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await clearCartService();
      dispatch(clearCart());
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

// 6. NEW: Transfer Guest Cart to User
export const transferGuestCartToUser = createAsyncThunk(
  'cart/transferGuestCartToUser',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setCartStatus('loading'));
      
      const guestItems = getState().cart.guestItems;
      
      if (guestItems.length === 0) {
        return { success: true, transferredCount: 0 };
      }

      // Use your existing addToCartService for each guest item
      const transferPromises = guestItems.map(item =>
        addToCartService({
          product_id: item.product_id,
          product_quantity: item.product_quantity
        })
      );

      await Promise.all(transferPromises);
      
      // Clear guest cart after successful transfer
      dispatch(clearGuestCart());
      
      // Fetch updated cart items using your existing thunk
      await dispatch(fetchCartItems());
      
      return {
        success: true,
        transferredCount: guestItems.length
      };
    } catch (error) {
      console.error('Guest cart transfer error:', error);
      dispatch(setCartError(error.message || 'Failed to transfer guest cart'));
      return rejectWithValue(error.message || 'Failed to transfer guest cart');
    } finally {
      dispatch(setCartStatus('idle'));
    }
  }
);
