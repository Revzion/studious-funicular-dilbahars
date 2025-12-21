import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as wishlistService from "../../services/wishlistServices";

// Thunks
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const data = await wishlistService.getMyWishlist();
      // console.log("fetchWishlist", data);
      return data.wishlist;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const likeProduct = createAsyncThunk(
  "wishlist/likeProduct",
  async ({ productId, collectionName }, { rejectWithValue }) => {
    try {
      const data = await wishlistService.likeProduct(productId, collectionName);
      // console.log("likeProduct", data);
      return data.wishlist;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const unlikeProduct = createAsyncThunk(
  "wishlist/unlikeProduct",
  async ({ productId, collectionName }, { rejectWithValue }) => {
    try {
      const data = await wishlistService.unlikeProduct(
        productId,
        collectionName
      );
      // console.log("unlikeProduct", data);
      return data.wishlist;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  "wishlist/deleteCollection",
  async (collectionName, { rejectWithValue }) => {
    try {
      const data = await wishlistService.deleteCollection(collectionName);
      // console.log("deleteCollection", data);
      return data.collections;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(likeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(likeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(unlikeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlikeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(unlikeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.loading = false;
        if (state.wishlist) {
          state.wishlist.collections = action.payload;
        }
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
