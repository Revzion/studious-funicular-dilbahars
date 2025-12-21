import api from "./api";

export const addOrderService = async (orderData) => {
  try {
    const response = await api.post("/order/create", orderData);
    return response.data;
  } catch (error) {
    console.error("Add Order Service Error:", error);
    throw error?.response?.data || { message: "Unable to place order" };
  }
};

export const createRazorpayOrderService = async (amount, product, cupon) => {
  try {
    const response = await api.post("/order/razorpay", {
      amount,
      product,
      cupon,
    });
    return response.data;
  } catch (error) {
    console.error("create Razorpay Order Service Error:", error);
    throw error || "Failed to create Razorpay order";
  }
};

export const cancelOrderService = async (orderId, { cancelReason, customCancelReason }) => {
  try {
    const response = await api.patch(`/order/cancel/${orderId}`, { cancelReason, customCancelReason });
    return response.data;
  } catch (error) {
    console.error("Cancel Order Service Error:", error);
    throw error?.response?.data || { message: "Something went wrong while cancelling the order" };
  }
};

export const getMyOrdersService = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/order/my-orders?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Get My Orders Service Error:", error);
    throw (
      error?.response?.data || {
        message: "Something went wrong while fetching orders",
      }
    );
  }
};

export const getMyOrderByIdService = async (orderId) => {
  try {
    const response = await api.get(`/order/my-orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Get Order By ID Service Error:", error);
    throw (
      error?.response?.data || {
        message: "Something went wrong while fetching the order",
      }
    );
  }
};

export const sendReturnRequestService = async (orderId, reason) => {
  try {
    const response = await api.patch(`/order/return/${orderId}`, { reason });
    return response.data;
  } catch (error) {
    console.error("Send Return Request Service Error:", error);
    throw (
      error?.response?.data || { message: "Failed to submit return request" }
    );
  }
};

// export const sendExchangeRequestService = async (
//   orderId,
//   { itemId, newProductId, reason }
// ) => {
//   try {
//     const response = await api.patch(`/order/exchange/${orderId}`, {
//       itemId,
//       newProductId,
//       reason,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Send Exchange Request Service Error:", error);
//     throw (
//       error?.response?.data || { message: "Failed to submit exchange request" }
//     );
//   }
// };

export const trackOrderService = async (orderId) => {
  try {
    const response = await api.get(`/order/track/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Track Order Service Error:", error);
    throw (
      error?.response?.data || {
        message: "Something went wrong while tracking the order",
      }
    );
  }
};
