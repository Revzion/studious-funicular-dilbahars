"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Package,
  ShoppingBag,
  Repeat,
  CreditCard,
  Gift,
  Clock,
  X,
} from "lucide-react";
import {
  getMyOrderByIdService,
  cancelOrderService,
  sendReturnRequestService,
} from "../../services/orderServices";
import { addToCartService } from "../../services/cartServices";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/slice/userSlice";
import TrackOrderTimelineSection from "./TrackOrderTimelineSection";

export const OrderDetail = ({ orderData, onBack }) => {
  const token = useSelector(selectToken);
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const timelineRef = useRef(null);

  const cancelReasons = [
    "Ordered by mistake",
    "Found cheaper elsewhere",
    "Delivery taking too long",
    "Item no longer needed",
    "Wrong item ordered",
    "Other",
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderData?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getMyOrderByIdService(orderData.id);
        console.log('response', response)
        const products = response.order.items?.map((item) => ({
          productName: item.productId?.subtitle || "Unknown Product",
          productQuantity: item.quantity || 0,
          productTotalAm: item.totalPrice || 0,
          productId: item.productId?._id || null,
          mainProductUrl: item.productId?.mainProduct?.customUrl || null,
          image: item.productId?.image?.[0]?.url || null,
          sku: item.productId?.sku || "N/A",
          pricePerUnit: item.pricePerUnit || 0,
        })) || [
          {
            productName: orderData.productName || "Unknown Product",
            productQuantity: orderData.productQuantity || 0,
            productTotalAm: orderData.productTotalAm || 0,
            productId: orderData.id || null,
            image: orderData.image || null,
            sku: "N/A",
            pricePerUnit: 0,
          },
        ];

        setOrder({
          id: response.order._id || orderData.id,
          products,
          price: response.order.payableAmount || orderData.price || 0,
          status: response.order.orderStatus?.toLowerCase() || "pending",
          address: response.order.shippingAddress
            ? {
                address: `${response.order.shippingAddress.addressLine1 || ""}, ${response.order.shippingAddress.city || ""}, ${response.order.shippingAddress.state || ""}, ${response.order.shippingAddress.country || ""} - ${response.order.shippingAddress.pincode || ""}`,
                phone: response.order.shippingAddress.phone || "N/A",
                fullname: response.order.shippingAddress.name || "N/A",
                email: response.order.shippingAddress.email || "N/A",
              }
            : {
                address: orderData.address || "No address provided",
                phone: "N/A",
                fullname: "N/A",
                email: "N/A",
              },
          billingAddress: response.order.billingAddress
            ? {
                address: `${response.order.billingAddress.addressLine1 || ""}, ${response.order.billingAddress.city || ""}, ${response.order.billingAddress.state || ""}, ${response.order.billingAddress.country || ""} - ${response.order.billingAddress.pincode || ""}`,
                phone: response.order.billingAddress.phone || "N/A",
                fullname: response.order.billingAddress.name || "N/A",
                email: response.order.billingAddress.email || "N/A",
              }
            : {
                address: "No billing address provided",
                phone: "N/A",
                fullname: "N/A",
                email: "N/A",
              },
          paymentInfo: response.order.paymentInfo || {
            paymentId: "N/A",
            method: "N/A",
            status: "N/A",
            paidAt: null,
          },
          createdAt: response.order.createdAt || orderData.orderDate || new Date().toISOString(),
          updatedAt: response.order.updatedAt || new Date().toISOString(),
          cupon: response.order.coupons?.code || orderData.cupon || null,
          totalPrice: response.order.totalAmount || orderData.totalPrice || 0,
          shippingCost: response.order.shippingCharge || orderData.shippingCost || 0,
          discountAmount: response.order.discountAmount || 0,
          cancelledAt: response.order.isCancelled ? response.order.updatedAt : null,
          isGift: response.order.isGift || false,
          giftMessage: response.order.giftMessage || "",
          statusHistory: response.order.statusHistory || [],
          cancelReason: response.order.cancelReason || null,
          customCancelReason: response.order.customCancelReason || null,
        });
      } catch (err) {
        console.error("Fetch Order Error:", err);
        const products = orderData.products && orderData.products.length > 0
          ? orderData.products.map((product) => ({
              productName: product.productName || "Unknown Product",
              productQuantity: product.productQuantity || 0,
              productTotalAm: product.productTotalAm || 0,
              productId: product.productId || null,
              image: product.image || null,
              sku: "N/A",
              pricePerUnit: 0,
            }))
          : [
              {
                productName: orderData.productName || "Unknown Product",
                productQuantity: orderData.productQuantity || 0,
                productTotalAm: orderData.productTotalAm || 0,
                productId: orderData.id || null,
                image: orderData.image || null,
                sku: "N/A",
                pricePerUnit: 0,
              },
            ];

        setOrder({
          id: orderData.id,
          products,
          price: orderData.price || 0,
          status: orderData.status || "pending",
          address: {
            address: orderData.address || "No address provided",
            phone: "N/A",
            fullname: "N/A",
            email: "N/A",
          },
          billingAddress: {
            address: "No billing address provided",
            phone: "N/A",
            fullname: "N/A",
            email: "N/A",
          },
          paymentInfo: {
            paymentId: "N/A",
            method: "N/A",
            status: "N/A",
            paidAt: null,
          },
          createdAt: orderData.orderDate || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cupon: orderData.cupon || null,
          totalPrice: orderData.totalPrice || 0,
          shippingCost: orderData.shippingCost || 0,
          discountAmount: 0,
          cancelledAt: orderData.cancelledAt || null,
          isGift: false,
          giftMessage: "",
          statusHistory: [],
          cancelReason: null,
          customCancelReason: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderData]);

  const openModal = (type) => {
    setModalType(type);
    setReason("");
    setCustomReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setReason("");
    setCustomReason("");
  };

  const handleReorder = async () => {
    try {
      setReorderLoading(true);
      let productsAdded = 0;
      for (const product of order.products) {
        if (product.productId && product.productQuantity > 0) {
          await addToCartService({
            product_id: product.productId,
            product_quantity: product.productQuantity,
          });
          productsAdded++;
        }
      }

      if (productsAdded > 0) {
        router.push("/cart");
      }
    } catch (err) {
      console.error("Reorder Error:", err);
    } finally {
      setReorderLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!reason.trim()) return;
    try {
      setCancelLoading(true);
      await cancelOrderService(order.id, {
        cancelReason: reason,
        customCancelReason: reason === "Other" ? customReason : null,
      });
      setOrder((prev) => ({
        ...prev,
        status: "cancelled",
        cancelledAt: new Date(),
        cancelReason: reason,
        customCancelReason: reason === "Other" ? customReason : null,
      }));
      closeModal();
    } catch (err) {
      console.error("Cancel Order Error:", err);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReturnRequest = async () => {
    if (!reason.trim()) return;
    try {
      setReturnLoading(true);
      await sendReturnRequestService(order.id, reason);
      setOrder((prev) => ({ ...prev, status: "return requested" }));
      closeModal();
    } catch (err) {
      console.error("Return Request Error:", err);
    } finally {
      setReturnLoading(false);
    }
  };

  const getOrderSteps = () => {
    if (!order) return [];

    const baseSteps = [
      {
        id: 1,
        title: "Order Confirmed",
        date: new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        status: "completed",
        icon: CheckCircle,
      },
    ];

    const statusHistorySteps = order.statusHistory.map((status, index) => ({
      id: baseSteps.length + index + 1,
      title: status.status.charAt(0).toUpperCase() + status.status.slice(1),
      date: new Date(status.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      status: "completed",
      icon:
        status.status.toLowerCase() === "cancelled"
          ? XCircle
          : status.status.toLowerCase() === "delivered"
          ? CheckCircle
          : status.status.toLowerCase() === "shipped" ||
            status.status.toLowerCase() === "outfordelivery"
          ? Truck
          : status.status.toLowerCase() === "returned" ||
            status.status.toLowerCase() === "return requested"
          ? RefreshCw
          : Package,
    }));

    const currentStatusStep =
      order.status !== "pending" &&
      !order.statusHistory.some((s) => s.status.toLowerCase() === order.status)
        ? [
            {
              id: baseSteps.length + statusHistorySteps.length + 1,
              title: order.status.charAt(0).toUpperCase() + order.status.slice(1),
              date: new Date(order.cancelledAt || order.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              status: order.status === "cancelled" ? "cancelled" : "completed",
              icon:
                order.status === "cancelled"
                  ? XCircle
                  : order.status === "delivered"
                  ? CheckCircle
                  : order.status === "shipped" ||
                    order.status === "outfordelivery"
                  ? Truck
                  : order.status === "returned" ||
                    order.status === "return requested"
                  ? RefreshCw
                  : Package,
            },
          ]
        : [];

    return [...baseSteps, ...statusHistorySteps, ...currentStatusStep];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
      case "outfordelivery":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
      case "return requested":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getDisplayedProducts = () => {
    if (!order?.products) return [];
    if (showAllProducts || order.products.length <= 3) {
      return order.products;
    }
    return order.products.slice(0, 3);
  };

  const shippingDetails = order?.address || {
    address: "No address provided",
    phone: "N/A",
    fullname: "No name",
    email: "N/A",
  };

  const billingDetails = order?.billingAddress || {
    address: "No billing address provided",
    phone: "N/A",
    fullname: "No name",
    email: "N/A",
  };

  const priceBreakdown = {
    listPrice: order?.totalPrice || 0,
    sellingPrice: order?.products.reduce((sum, product) => sum + (product.productTotalAm || 0), 0) || 0,
    extraDiscount: order?.discountAmount || 0,
    deliveryCharge: order?.shippingCost || 0,
    discount: order?.discountAmount || 0,
    total: order?.price || 0,
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center py-8 sm:py-12 bg-red-50 rounded-lg p-4 sm:p-6">
          <XCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-red-600" />
          <p className="text-sm sm:text-base font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg p-4 sm:p-6">
          <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm sm:text-base font-medium text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Order Details</h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm">Order ID: #{order.id}</p>
                <p className="text-gray-600 text-xs sm:text-sm">Placed on: {formatDateTime(order.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Products Section */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-5 py-3 sm:py-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Products ({order.products.length})
                    </h2>
                    {order.products.length > 3 && (
                      <button
                        onClick={() => setShowAllProducts(!showAllProducts)}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors self-start sm:self-auto"
                      >
                        {showAllProducts ? (
                          <>
                            Show Less <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          </>
                        ) : (
                          <>
                            Show All ({order.products.length - 3} more) <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {/* Action Buttons - Responsive Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2">
                    <button
                      className="flex items-center h-9 sm:h-10 gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                      onClick={() => {
                        timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        setTimeout(() => timelineRef.current?.focus?.(), 600);
                      }}
                    >
                      Track Order
                    </button>

                    {["pending", "packed"].includes(order.status) && (
                      <button
                        onClick={() => openModal("cancel")}
                        disabled={cancelLoading}
                        className={`flex items-center justify-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
                          cancelLoading
                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                        }`}
                      >
                        {cancelLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border border-white border-t-transparent"></div>
                            <span className="hidden sm:inline">Cancelling...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Cancel</span>
                          </>
                        )}
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button
                        onClick={() => openModal("return")}
                        disabled={returnLoading}
                        className={`flex items-center justify-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
                          returnLoading
                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                        }`}
                      >
                        {returnLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border border-white border-t-transparent"></div>
                            <span className="hidden sm:inline">Requesting...</span>
                            <span className="sm:hidden">...</span>
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
                      onClick={handleReorder}
                      disabled={reorderLoading}
                      className={`flex items-center justify-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
                        reorderLoading
                          ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                      } ${["pending", "packed"].includes(order.status) ? "col-span-1" : "col-span-2 sm:col-span-1"}`}
                    >
                      {reorderLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border border-white border-t-transparent"></div>
                          <span className="hidden sm:inline">Adding...</span>
                          <span className="sm:hidden">...</span>
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

              {/* Products List - Enhanced Mobile Layout */}
              <div className="p-3 sm:p-4 lg:p-5">
                <div className="space-y-3"
                
                >
                  {getDisplayedProducts().map((product, index) => (
                    <div
                      key={product.productId || index}
                      className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex gap-3 flex-1">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.productName}
                              onClick={(e) =>{
                                e.stopPropagation() 
                                router.push(`/products/${product?.mainProductUrl  || "#"}?subproduct=${product?.productId || ""}`)}}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Package className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 
                            onClick={(e) =>{ 
                              e.stopPropagation()
                              router.push(`/products/${product?.mainProductUrl  || "#"}?subproduct=${product?.productId || ""}`)}}
                            className="font-medium text-gray-900 text-s sm:text-base lg:text-sm mb-1 line-clamp-2 cursor-pointer">
                            {product.productName}
                          </h3>
                          <p className="text-s sm:text-sm lg:text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center text-sm gap-1">
                              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                              Qty: <span className="font-medium">{product.productQuantity}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              Unit Price: <span className="font-medium">₹{product.pricePerUnit.toLocaleString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col sm:items-end justify-between sm:justify-start sm:text-right">
                        <span className="text-xs sm:text-sm text-gray-500 sm:mb-1">Total</span>
                        <p className="text-base sm:text-lg lg:text-xl font-semibold text-blue-600">
                          ₹{product.productTotalAm.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {!showAllProducts && order.products.length > 3 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-center text-blue-700 font-medium text-xs sm:text-sm">
                      {order.products.length - 3} more product{order.products.length - 3 > 1 ? "s" : ""} in this order
                    </p>
                  </div>
                )}
              </div>
            </div>

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
                        <option key={r} value={r}>{r}</option>
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
                      className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={modalType === "cancel" ? handleCancelOrder : handleReturnRequest}
                      disabled={(!reason.trim() || (reason === "Other" && !customReason.trim())) || (modalType === "cancel" ? cancelLoading : returnLoading)}
                      className={`flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
                        (!reason.trim() || (reason === "Other" && !customReason.trim())) || (modalType === "cancel" ? cancelLoading : returnLoading)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {modalType === "cancel" && cancelLoading ? "Cancelling..." : modalType === "return" && returnLoading ? "Requesting..." : modalType === "cancel" ? "Cancel Order" : "Submit Return"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <TrackOrderTimelineSection ref={timelineRef} orderId={orderData.id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-5">
            {/* Shipping Details */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Shipping Details
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <p className="font-medium text-gray-900">{shippingDetails.fullname}</p>
                <p>{shippingDetails.address}</p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  {shippingDetails.phone}
                </p>
                <p>{shippingDetails.email}</p>
              </div>
            </div>

            {/* Billing Details */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Billing Details
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <p className="font-medium text-gray-900">{billingDetails.fullname}</p>
                <p>{billingDetails.address}</p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  {billingDetails.phone}
                </p>
                <p>{billingDetails.email}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Price Breakdown
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>List Price</span>
                  <span>₹{priceBreakdown.listPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selling Price</span>
                  <span>₹{priceBreakdown.sellingPrice.toLocaleString()}</span>
                </div>
                {priceBreakdown.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{priceBreakdown.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{priceBreakdown.deliveryCharge === 0 ? "Free" : `₹${priceBreakdown.deliveryCharge.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{priceBreakdown.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Payment Information
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Payment ID</span>
                  <span>{order.paymentInfo.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method</span>
                  <span>{order.paymentInfo.method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span>{order.paymentInfo.status}</span>
                </div>
                {order.paymentInfo.paidAt && (
                  <div className="flex justify-between">
                    <span>Paid At</span>
                    <span>{formatDateTime(order.paymentInfo.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gift Information */}
            {order.isGift && (
              <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Gift Details
                </h2>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <p className="font-medium">Gift Message:</p>
                  <p>{order.giftMessage || "No message provided"}</p>
                </div>
              </div>
            )}

            {/* Cancellation Reason */}
            {order.cancelReason && (
              <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  Cancellation Reason
                </h2>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <p className="font-medium">Reason:</p>
                  <p>{order.cancelReason}</p>
                  {order.customCancelReason && (
                    <>
                      <p className="font-medium">Details:</p>
                      <p>{order.customCancelReason}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};