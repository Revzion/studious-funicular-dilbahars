import { getB2BProfile } from "@/services/b2bServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// 🔰 Initial state (No localStorage usage)
const initialState = {
  b2bUser: null,
  token: null,
  isB2bAuthenticated: false,
  status: 'idle',
  error: null
};

// 📦 Thunk to fetch B2B profile
export const fetchB2bUser = createAsyncThunk(
  "b2bUser/fetchB2bUser",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getB2BProfile();
      const b2bUser = userData?.b2buser || userData?.user || userData;
      return b2bUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch B2B user';
      return rejectWithValue(errorMessage);
    }
  }
);

// 🧩 Redux slice
const b2bUserSlice = createSlice({
  name: "b2bUser",
  initialState,
  reducers: {
    setB2bUser: (state, action) => {
      state.b2bUser = action.payload.b2bUser;
      state.token = action.payload.token;
      state.isB2bAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },
    clearB2bUser: (state) => {
      state.b2bUser = null;
      state.token = null;
      state.isB2bAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchB2bUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchB2bUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.b2bUser = action.payload;
        state.isB2bAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchB2bUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.b2bUser = null;
        state.token = null;
        state.isB2bAuthenticated = false;
      });
  },
});

// 🟢 Actions
export const { setB2bUser, clearB2bUser } = b2bUserSlice.actions;

// 🔍 Selectors
export const selectB2bUser = (state) => state.b2bUser.b2bUser;
export const selectB2bToken = (state) => state.b2bUser.token;
export const selectIsB2bAuthenticated = (state) => state.b2bUser.isB2bAuthenticated;
export const selectB2bUserStatus = (state) => state.b2bUser.status;
export const selectB2bUserError = (state) => state.b2bUser.error;

export default b2bUserSlice.reducer;
