import api from "./api";

export const addReviewService = async (reviewData) => {
  try {
    const formData = new FormData();
    formData.append("rating", reviewData.rating);
    formData.append("review_message", reviewData.review_message);
    formData.append("product_id", reviewData.product_id);

    // Append image files if any
    if (reviewData.images && reviewData.images.length > 0) {
      reviewData.images.forEach((image) => {
        formData.append("image", image);
      });
    }

    const response = await api.post(
      `/review/add/${reviewData.product_id}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw (
      error?.response?.data || {
        message: "An error occurred while adding the review",
      }
    );
  }
};

export const getReviewsService = async (productId) => {
  try {
    const response = await api.get(`/review/${productId}`);
    return response.data;
  } catch (error) {
    throw (
      error?.response?.data || {
        message: "An error occurred while fetching the reviews",
      }
    );
  }
};

export const deleteReviewService = async (reviewId, token) => {
  try {
    const response = await api.delete(`/review/delete/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw (
      error?.response?.data || {
        message: "An error occurred while deleting the review",
      }
    );
  }
};
