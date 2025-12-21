import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCompanyProfileService } from "@/services/companyServices";

export const fetchCompanyProfile = createAsyncThunk(
  "company/fetchCompanyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCompanyProfileService();
      // console.log("company fetched", response);
      return response.data[0];
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch company profile"
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    companyProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCompanyProfile: (state) => {
      state.companyProfile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.companyProfile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompanyProfile } = companySlice.actions;
export default companySlice.reducer;
