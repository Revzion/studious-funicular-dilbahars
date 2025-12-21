import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfileService } from "../../services/b2cServices";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getProfileService();
      console.log("userData", userData);
      const user = userData.user || userData.data || userData;
      return user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user";

      if (
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("401")
      ) {
        return rejectWithValue("Unauthorized");
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    initializeAuth: (state) => {
      // No localStorage — start fresh
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;

        if (
          action.payload.includes("Unauthorized") ||
          action.payload.includes("No token")
        ) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      });
  },
});

export const { setUser, clearUser, initializeAuth } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
