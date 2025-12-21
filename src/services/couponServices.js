import api from "./api";

// Service to add a new coupon
export const addCoupon = async (couponData) => {
  try {
    const response = await api.post("/coupon/add", couponData);
    return response.data;
  } catch (error) {
    console.error("Error adding coupon:", error);
    throw error.response?.data || { error: "Failed to add coupon" };
  }
};

// Service to update an existing coupon
export const updateCoupon = async (id, couponData) => {
  try {
    const response = await api.put(`/coupon/update/${id}`, couponData);
    return response.data;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error.response?.data || { error: "Failed to update coupon" };
  }
};

// Service to get all coupons with query parameters
export const getAllCoupons = async (params = {}) => {
  try {
    const response = await api.get("/coupon/all", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error.response?.data || { error: "Failed to fetch coupons" };
  }
};

// Service to get a single coupon by ID
export const getCouponById = async (id) => {
  try {
    const response = await api.get(`/coupon/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupon by ID:", error);
    throw error.response?.data || { error: "Failed to fetch coupon" };
  }
};

// Service to evaluate coupons
export const evaluateCoupons = async (items) => {
  try {
    const response = await api.post("/coupon/evaluate", { items });
    return response.data;
  } catch (error) {
    console.error("Error evaluating coupons:", error);
    throw error.response?.data || { error: "Failed to evaluate coupons" };
  }
};

// Service to preview a single coupon
export const previewSingleCoupon = async (couponCode, items) => {
  try {
    const response = await api.post("/coupon/preview", { couponCode, items });
    return response.data;
  } catch (error) {
    console.error("Error previewing coupon:", error);
    throw error.response?.data || { error: "Failed to preview coupon" };
  }
};
