"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  MapPin,
  Calendar,
  X,
  ChevronDown,
  ShoppingBag,
  Clock,
  Tag,
  ChevronUp,
  Repeat,
} from "lucide-react";
import {
  getMyOrdersService,
  cancelOrderService,
  sendReturnRequestService,
} from "@/services/orderServices";
import { addToCartService } from "@/services/cartServices";
import { useRouter } from "next/navigation";
import Cart from "../Cart/Cart";

export const OrdersList = ({ onOrderSelect, userId }) => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: [], timeRange: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [reorderLoading, setReorderLoading] = useState({});
  const [cancelLoading, setCancelLoading] = useState({});
  const [returnLoading, setReturnLoading] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showCart, setShowCart] = useState(false);

  const cancelReasons = [
    "Ordered by mistake",
    "Found cheaper elsewhere",
    "Delivery taking too long",
    "Item no longer needed",
    "Wrong item ordered",
    "Other",
  ];

  const isWithinReturnWindow = (deliveredAt) => {
    if (!deliveredAt) return false;

    const deliveredDate = new Date(deliveredAt);
    const today = new Date();

    const diffInDays = (today - deliveredDate) / (1000 * 60 * 60 * 24);
    return (diffInDays <= 7 && diffInDays >= 0);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getMyOrdersService();
        console.log("my orders", response);
        const ordersData = response.orders.map((order) => {
          const latestStatus = order.orderStatus?.toLowerCase() || "";

          const products = order.items?.map((item) => ({
            productName: item.productId?.subtitle || "Unknown Product",
            productQuantity: item.quantity || 0,
            productTotalAm: item.totalPrice || 0,
            productId: item.productId?._id || "Unknown ID",
            mainProductUrl:
              item.productId?.mainProduct?.customUrl || "Unknown URL",
            image: item.productId?.image?.[0]?.url || null,
          })) || [
            {
              productName: "Unknown Product",
              productQuantity: 0,
              productTotalAm: 0,
              productId: "Unknown ID",
              image: null,
            },
          ];

          return {
            id: order._id,
            products,
            price: order.payableAmount || 0,
            status: latestStatus,
            orderDate: order.createdAt,
            deliveryDate: order.deliveredAt,
            address: order.shippingAddress
              ? `${order.shippingAddress.addressLine1 || ""}, ${
                  order.shippingAddress.city || ""
                }, ${order.shippingAddress.state || ""}, ${
                  order.shippingAddress.country || ""
                } - ${order.shippingAddress.pincode || ""}`
              : "No address provided",
            cupon: order.coupons?.code || null,
            shippingCost: order.shippingCharge || 0,
            totalPrice: order.totalAmount || 0,
            cancelledAt: order.isCancelled ? order.updatedAt : null,
            cancelReason: order.cancelReason || null,
            customCancelReason: order.customCancelReason || null,
            isCancelled: order.isCancelled || false,
            paymentInfo: order.paymentInfo || { method: "Unknown" },
          };
        });

        const sortedOrders = ordersData.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (err) {
        console.error("Fetch Orders Error:", err);
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    let filtered = [...orders];

    if (searchQuery.trim()) {
      filtered = filtered.filter((order) =>
        order.products.some((product) =>
          product.productName
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim())
        )
      );
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter((order) =>
        filters.status.includes(order.status)
      );
    }

    if (filters.timeRange.length > 0) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        const currentDate = new Date();

        return filters.timeRange.some((range) => {
          if (range === "last30days") {
            const thirtyDaysAgo = new Date(
              currentDate - 30 * 24 * 60 * 60 * 1000
            );
            return orderDate >= thirtyDaysAgo;
          }
          if (range === "2024") {
            return orderDate.getFullYear() === 2024;
          }
          return false;
        });
      });
    }

    const sortedFiltered = filtered.sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );
    setFilteredOrders(sortedFiltered);
  }, [orders, searchQuery, filters]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilters = () => {
    setFilters({ status: [], timeRange: [] });
    setSearchQuery("");
  };

  const toggleProductsDropdown = (orderId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const openModal = (type, orderId) => {
    setModalType(type);
    setSelectedOrderId(orderId);
    setReason("");
    setCustomReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedOrderId(null);
    setReason("");
    setCustomReason("");
  };

  const handleReorder = async (order) => {
    try {
      setReorderLoading((prev) => ({ ...prev, [order.id]: true }));
      let productsAdded = 0;
      for (const product of order.products) {
        if (product.productId !== "Unknown ID" && product.productQuantity > 0) {
          await addToCartService({
            product_id: product.productId,
            product_quantity: product.productQuantity,
          });
          productsAdded++;
        }
      }

      if (productsAdded > 0) {
        setShowCart(true);
      }
    } catch (err) {
      console.error("Reorder Error:", err);
    } finally {
      setReorderLoading((prev) => ({ ...prev, [order.id]: false }));
    }
  };

  const handleCancelOrder = async () => {
    if (!reason.trim()) return;
    try {
      setCancelLoading((prev) => ({ ...prev, [selectedOrderId]: true }));
      await cancelOrderService(selectedOrderId, {
        cancelReason: reason,
        customCancelReason: reason === "Other" ? customReason : null,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrderId
            ? {
                ...order,
                status: "cancelled",
                cancelledAt: new Date(),
                cancelReason: reason,
                customCancelReason: reason === "Other" ? customReason : null,
              }
            : order
        )
      );
      closeModal();
    } catch (err) {
      console.error("Cancel Order Error:", err);
    } finally {
      setCancelLoading((prev) => ({ ...prev, [selectedOrderId]: false }));
    }
  };

  const handleReturnRequest = async () => {
    if (!reason.trim()) return;
    try {
      setReturnLoading((prev) => ({ ...prev, [selectedOrderId]: true }));
      await sendReturnRequestService(selectedOrderId, reason);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrderId
            ? { ...order, status: "return requested" }
            : order
        )
      );
      closeModal();
    } catch (err) {
      console.error("Return Request Error:", err);
    } finally {
      setReturnLoading((prev) => ({ ...prev, [selectedOrderId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      delivered: {
        color:
          "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg",
        icon: CheckCircle,
      },
      cancelled: {
        color: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
        icon: XCircle,
      },
      returned: {
        color:
          "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg",
        icon: RefreshCw,
      },
      "return requested": {
        color:
          "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg",
        icon: RefreshCw,
      },
      shipped: {
        color:
          "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg",
        icon: Truck,
      },
      outfordelivery: {
        color:
          "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
        icon: Truck,
      },
      packed: {
        color:
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg",
        icon: Package,
      },
      pending: {
        color:
          "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
        icon: Clock,
      },
    };

    const normalizedStatus = status ? status.toLowerCase() : "pending";
    const config = configs[normalizedStatus] || configs.pending;
    const Icon = config.icon;

    return (
      <div
        className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold ${config.color} transition-all duration-300`}
      >
        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline capitalize">
          {normalizedStatus.replace(/([a-z])([A-Z])/g, "$1 $2")}
        </span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getActiveFiltersCount = () => {
    return filters.status.length + filters.timeRange.length;
  };

  const getTotalQuantity = (products) => {
    return products.reduce(
      (total, product) => total + product.productQuantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Loading Your Orders
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            Please wait while we fetch your order history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center p-6 sm:p-8">
          <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-red-700 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-6">
      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6">
            <div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 flex-wrap">
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                    Order Time
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      {
                        value: "last30days",
                        label: "Last 30 days",
                        icon: Calendar,
                      },
                      { value: "2024", label: "2024", icon: Calendar },
                    ].map((time) => {
                      const Icon = time.icon;
                      const isSelected = filters.timeRange.includes(time.value);
                      return (
                        <label
                          key={time.value}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all duration-200 text-xs sm:text-sm ${
                            isSelected
                              ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="font-medium text-gray-700">
                            {time.label}
                          </span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-200 rounded focus:ring-blue-400"
                            checked={isSelected}
                            onChange={() =>
                              handleFilterChange("timeRange", time.value)
                            }
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-300 text-sm font-medium shadow-sm transition-all duration-200"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {getActiveFiltersCount() > 0 && (
                      <span className="bg-white text-blue-600 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex sm:hidden items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-300 text-sm font-medium shadow-sm transition-all duration-200"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {getActiveFiltersCount() > 0 && (
                      <span className="bg-white text-blue-600 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-all duration-200"
                    >
                      Clear ({getActiveFiltersCount()})
                    </button>
                  )}
                </div>
              </div>
            </div>
            {showFilters && (
              <div className="hidden sm:block bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 mb-6">
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <FilterContent
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 sm:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-[90%] bg-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filters
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20 custom-scrollbar">
              <FilterContent
                filters={filters}
                handleFilterChange={handleFilterChange}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                {modalType === "cancel" ? "Cancel Order" : "Return Request"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-800 mb-2 block">
                Reason for {modalType === "cancel" ? "Cancellation" : "Return"}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a reason</option>
                {cancelReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {reason === "Other" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please specify the reason..."
                  className="w-full p-3 mt-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={
                  modalType === "cancel"
                    ? handleCancelOrder
                    : handleReturnRequest
                }
                disabled={
                  !reason.trim() ||
                  (reason === "Other" && !customReason.trim()) ||
                  (modalType === "cancel"
                    ? cancelLoading[selectedOrderId]
                    : returnLoading[selectedOrderId])
                }
                className={`flex-1 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 ${
                  !reason.trim() ||
                  (reason === "Other" && !customReason.trim()) ||
                  (modalType === "cancel"
                    ? cancelLoading[selectedOrderId]
                    : returnLoading[selectedOrderId])
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {modalType === "cancel" && cancelLoading[selectedOrderId]
                  ? "Cancelling..."
                  : modalType === "return" && returnLoading[selectedOrderId]
                  ? "Requesting..."
                  : modalType === "cancel"
                  ? "Cancel Order"
                  : "Submit Return"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredOrders.length > 0 && (
          <div className="mt-4 mb-4 text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
        <div className="space-y-4 sm:space-y-6">
          {filteredOrders?.map((order) => (
            <div
              key={order.id}
              className="group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl border border-white/20 hover:border-blue-200 transition-all duration-300"
              onClick={() => onOrderSelect(order)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900">
                        Order #{order.id.slice(-8)}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          {order.products.length} item
                          {order.products.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          Total Qty: {getTotalQuantity(order.products)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-2">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ₹{order.price.toLocaleString()}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div className="mb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProductsDropdown(order.id);
                    }}
                    className="flex items-center justify-between w-full p-2 sm:p-3 text-sm sm:text-base bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">
                        View Products ({order.products.length})
                      </span>
                    </div>
                    {expandedProducts[order.id] ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedProducts[order.id] && (
                    <div className="mt-3 space-y-3">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex gap-3 sm:gap-4 p-2 sm:p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.productName}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    `/products/${
                                      product?.mainProductUrl || "#"
                                    }?subproduct=${product?.productId || ""}`
                                  );
                                }}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/products/${
                                    product?.mainProductUrl || "#"
                                  }?subproduct=${product?.productId || ""}`
                                );
                              }}
                              className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2 cursor-pointer"
                            >
                              {product.productName}
                            </h4>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                              <span className="text-gray-600">
                                Qty: {product.productQuantity}
                              </span>
                              <span className="font-semibold text-blue-600">
                                ₹{product.productTotalAm.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 mb-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-2">{order.address}</span>
                </div>
                {order.cancelReason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800 font-semibold mb-1">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">
                        Cancellation Reason
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-red-700">
                      {order.cancelReason}
                    </p>
                    {order.customCancelReason && (
                      <p className="text-xs sm:text-sm text-red-700">
                        Details: {order.customCancelReason}
                      </p>
                    )}
                  </div>
                )}
                {order.isCancelled &&
                  order.paymentInfo?.method === "ONLINE" && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 font-semibold mb-1">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">
                          Refund Initiated
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-green-700">
                        Refund of ₹{order.price.toLocaleString()} initiated.
                      </p>
                    </div>
                  )}
                <div className="flex flex-wrap justify-end gap-2 sm:gap-3 mt-4">
                  {["pending", "packed"].includes(order.status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("cancel", order.id);
                      }}
                      disabled={cancelLoading[order.id]}
                      className={`flex items-center h-9 sm:h-10 gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                        cancelLoading[order.id]
                          ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                      }`}
                    >
                      {cancelLoading[order.id] ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Cancel</span>
                        </>
                      )}
                    </button>
                  )}
                  {order.status === "delivered" &&
                    order.deliveryDate &&
                    isWithinReturnWindow(order.deliveryDate) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal("return", order.id);
                        }}
                        disabled={returnLoading[order.id]}
                        className={`flex items-center h-9 sm:h-10 gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                          returnLoading[order.id]
                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                        }`}
                      >
                        {returnLoading[order.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                            <span>Requesting...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Return</span>
                          </>
                        )}
                      </button>
                    )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(order);
                    }}
                    disabled={reorderLoading[order.id]}
                    className={`flex items-center h-9 sm:h-10 gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                      reorderLoading[order.id]
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                    }`}
                  >
                    {reorderLoading[order.id] ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                        <span>Adding to Cart...</span>
                      </>
                    ) : (
                      <>
                        <Repeat className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Reorder</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3">
              No orders found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto">
              {searchQuery || getActiveFiltersCount() > 0
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't placed any orders yet. Start shopping to see your orders here!"}
            </p>
            {(searchQuery || getActiveFiltersCount() > 0) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterContent = ({ filters, handleFilterChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          Order Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[
            {
              value: "pending",
              label: "Pending",
              icon: Clock,
              color: "text-yellow-600",
            },
            {
              value: "packed",
              label: "Packed",
              icon: Package,
              color: "text-cyan-600",
            },
            {
              value: "shipped",
              label: "Shipped",
              icon: Truck,
              color: "text-blue-600",
            },
            {
              value: "outfordelivery",
              label: "Out for Delivery",
              icon: Truck,
              color: "text-purple-600",
            },
            {
              value: "delivered",
              label: "Delivered",
              icon: CheckCircle,
              color: "text-green-600",
            },
            {
              value: "cancelled",
              label: "Cancelled",
              icon: XCircle,
              color: "text-red-600",
            },
            {
              value: "returned",
              label: "Returned",
              icon: RefreshCw,
              color: "text-orange-600",
            },
            {
              value: "return requested",
              label: "Return Requested",
              icon: RefreshCw,
              color: "text-amber-600",
            },
          ].map((status) => {
            const Icon = status.icon;
            const isSelected = filters.status.includes(status.value);
            return (
              <label
                key={status.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200 text-sm hover:shadow-md ${
                  isSelected
                    ? "border-blue-400 bg-blue-50 ring-2 ring-blue-400 shadow-md"
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isSelected ? "text-blue-600" : status.color
                  }`}
                />
                <span className="font-medium text-gray-700 flex-1">
                  {status.label}
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                  checked={isSelected}
                  onChange={() => handleFilterChange("status", status.value)}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
