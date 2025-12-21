import api from "./api";

export const addToCartService = async (data) => {
  try {
    const response = await api.post("/cart/add-to-cart", data);
    return response.data;
  } catch (error) {
    console.error("Add to Cart Service Error:", error);
    throw (
      error.response?.data || {
        message: "Something went wrong while adding to cart",
      }
    );
  }
};

export const getCartService = async () => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await api.get("/cart/get-cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('response for cart', response)
    return response.data;
  } catch (error) {
    console.error("Get Cart Service Error:", error);
    throw (
      error.response?.data || {
        message: "Something went wrong while fetching cart",
      }
    );
  }
};

export const removeFromCartService = async (productId) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Remove From Cart Service Error:", error);
    throw (
      error.response?.data || {
        message: "Something went wrong while removing from cart",
      }
    );
  }
};

export const updateProductQuantityService = async (data) => {
  try {
    const response = await api.post("/cart/update-quantity", data);
    return response.data;
  } catch (error) {
    console.error("Update Quantity Error:", error);
    throw (
      error.response?.data || {
        message: "Unexpected error occurred while updating quantity",
      }
    );
  }
};

export const clearCartService = async () => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await api.delete("/cart/clear", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Clear Cart Service Error:", error);
    throw (
      error.response?.data || {
        message: "Something went wrong while clearing the cart",
      }
    );
  }
};
