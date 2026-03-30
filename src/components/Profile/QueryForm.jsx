"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Phone,
  Mail,
  User,
  MessageSquare,
  Send,
  Tag,
  ShoppingCart,
} from "lucide-react";
import { addQueryService } from "../../services/queryServices";
import { getMyOrdersService } from "@/services/orderServices";
import { useRouter } from "next/navigation";

export default function QueryForm({ onQuerySubmitted }) {
  const [formData, setFormData] = useState({
    message: "",
    query_type: "",
    orderId: "",
    other_query_type: "",
    images: [],
  });
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  useEffect(() => {
    if (formData.query_type === "Order") {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const response = await getMyOrdersService(0);
          console.log("response.orders", response.orders);
          setOrders(response.orders || []);
        } catch (error) {
          console.error("Error fetching orders:", error.message);
        } finally {
          setIsLoadingOrders(false);
        }
      };
      fetchOrders();
    } else {
      setOrders([]);
      setFormData((prev) => ({ ...prev, orderId: "" }));
    }
  }, [formData.query_type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOrderDropdownOpen &&
        !event.target.closest(".order-dropdown-container")
      ) {
        setIsOrderDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOrderDropdownOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.query_type) newErrors.query_type = "Query type is required";
    if (formData.query_type === "Order" && !formData.orderId)
      newErrors.orderId = "Order selection is required for Order query";
    if (formData.query_type === "Other" && !formData.other_query_type.trim())
      newErrors.other_query_type = "Other query description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "query_type") {
      setErrors((prev) => ({ ...prev, orderId: "", other_query_type: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validFiles = files.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxSize
    );
    if (formData.images.length + validFiles.length > 5) return;
    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const apiFormData = new FormData();
      apiFormData.append("message", formData.message.trim());
      apiFormData.append("query_type", formData.query_type);
      if (formData.query_type === "Order" && formData.orderId)
        apiFormData.append("orderId", formData.orderId);
      if (formData.query_type === "Other" && formData.other_query_type.trim())
        apiFormData.append(
          "other_query_type",
          formData.other_query_type.trim()
        );
      formData.images.forEach((imageObj) =>
        apiFormData.append("images", imageObj.file)
      );
      const response = await addQueryService(apiFormData);
      formData.images.forEach((imageObj) =>
        URL.revokeObjectURL(imageObj.preview)
      );
      setFormData({
        message: "",
        query_type: "",
        orderId: "",
        other_query_type: "",
        images: [],
      });
      if (onQuerySubmitted) onQuerySubmitted();
    } catch (error) {
      console.log("error", error);
      console.error("Error submitting query:", error || "An error occurred");
      const errorMessage =
        error || "An error occurred while submitting the query";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      if (
        errorMessage.includes(
          "your profile with an email before submitting a query"
        )
      ) {
        router.push("/profile?tab=profile-info");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOrderStatus = (order) => {
    const status = order.orderStatus;

    const statusMap = {
      Pending: {
        text: "Pending",
        color: "text-yellow-500",
      },
      Packed: {
        text: "Packed",
        color: "text-blue-500",
      },
      Shipped: {
        text: "Shipped",
        color: "text-indigo-500",
      },
      OutForDelivery: {
        text: "Out for Delivery",
        color: "text-orange-500",
      },
      Delivered: {
        text: "Delivered",
        color: "text-green-600",
      },
      Cancelled: {
        text: "Cancelled",
        color: "text-red-600",
      },
      "Return Requested": {
        text: "Return Requested",
        color: "text-purple-500",
      },
      Returned: {
        text: "Returned",
        color: "text-green-700",
      },
      "Exchange Requested": {
        text: "Exchange Requested",
        color: "text-blue-700",
      },
      Exchange: {
        text: "Exchange Completed",
        color: "text-green-700",
      },
      reject: {
        text: "Rejected",
        color: "text-red-700",
      },
    };

    // Return status style
    return {
      text: statusMap[status]?.text || "Unknown",
      color: statusMap[status]?.color || "text-gray-500",
      date: order.updatedAt || order.createdAt,
    };
  };

  const handleOrderSelect = (orderId) => {
    setFormData((prev) => ({ ...prev, orderId }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
            <h1 className="text-xl font-semibold text-center">
              Submit Your Query
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errors.form && (
              <p className="text-red-500 text-xs text-center">{errors.form}</p>
            )}
            <div className="space-y-1">
              <label
                htmlFor="query_type"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Tag className="w-4 h-4 mr-2 text-blue-500" /> Query Type *
              </label>
              <select
                id="query_type"
                name="query_type"
                value={formData.query_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all ${
                  errors.query_type
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200"
                } focus:outline-none`}
                required
              >
                <option value="">Select query type</option>
                <option value="Order">Order</option>
                <option value="Product">Product</option>
                <option value="Other">Other</option>
              </select>
              {errors.query_type && (
                <p className="text-red-500 text-xs">{errors.query_type}</p>
              )}
            </div>

            {formData.query_type === "Order" && (
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <ShoppingCart className="w-4 h-4 mr-2 text-blue-500" /> Select
                  Order *
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                  {isLoadingOrders ? (
                    <p className="text-gray-500 text-xs p-2">
                      Loading orders...
                    </p>
                  ) : orders.length > 0 ? (
                    orders.map((order) => {
                      const statusInfo = getOrderStatus(order);
                      const item = order.items[0]; // Assuming first item for brevity
                      const isSelected = formData.orderId === order._id;
                      return (
                        <div
                          key={order._id}
                          className={`flex items-center p-2 border-b last:border-b-0 cursor-pointer ${
                            isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleOrderSelect(order._id)}
                        >
                          <img
                            src={item.productId?.image[0]?.url}
                            alt={item.productId?.sku}
                            className="w-12 h-12 object-cover mr-2"
                          />
                          <div className="flex-1 text-sm">
                            <p className="font-medium truncate">
                              Item:{" "}
                              {item?.productId?.sku?.length > 20
                                ? `${item?.productId?.sku?.slice(0, 20)}...`
                                : item?.productId?.sku}
                            </p>
                            <p className="text-gray-500 text-xs truncate">
                              Order ID: {order._id.slice(-6)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={statusInfo.color}>
                              {statusInfo.text}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(statusInfo.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-xs p-2">
                      No orders available
                    </p>
                  )}
                </div>
                {errors.orderId && (
                  <p className="text-red-500 text-xs">{errors.orderId}</p>
                )}
              </div>
            )}

            {formData.query_type === "Other" && (
              <div className="space-y-1">
                <label
                  htmlFor="other_query_type"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Tag className="w-4 h-4 mr-2 text-blue-500" /> Query
                  Description *
                </label>
                <input
                  type="text"
                  id="other_query_type"
                  name="other_query_type"
                  value={formData.other_query_type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all ${
                    errors.other_query_type
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  } focus:outline-none`}
                  placeholder="Describe your query"
                  required
                />
                {errors.other_query_type && (
                  <p className="text-red-500 text-xs">
                    {errors.other_query_type}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="message"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-blue-500" /> Message
                *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none ${
                  errors.message
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200"
                } focus:outline-none`}
                placeholder="Enter your message..."
                required
              />
              {errors.message && (
                <p className="text-red-500 text-xs">{errors.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Upload className="w-4 h-4 mr-2 text-blue-500" /> Attachments
                (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center space-y-1"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload images or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF, WEBP up to 5MB (Max 5 images)
                  </span>
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded-b-md truncate">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-5 rounded-md font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
