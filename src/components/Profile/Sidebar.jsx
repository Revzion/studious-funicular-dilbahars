"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Settings,
  MapPin,
  Menu,
  X,
  Lock,
  HelpCircle,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { ProfileInformation } from "./Profile";
import { getProfileService } from "../../services/b2cServices";
import ManageAddresses from "./ManageAddress";
import ChangePassword from "./ChangePassword";
import { OrderDetail } from "../Orders/OrderDetail";
import { OrdersList } from "../Orders/OrderList";
import MyQueries from "./MyQueries";
import { useSearchParams } from "next/navigation";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile-info");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await getProfileService();
        if (response.success && response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "orders" || tab === "queries" || tab === "profile-info" ) {
      setActiveTab(tab);
      setShowOrderDetails(false);
      setSelectedOrderData(null);
    }
  }, [searchParams]);

  const menuItems = [
    { id: "orders", label: "MY ORDERS", icon: ShoppingBag },
    { id: "queries", label: "MY QUERIES", icon: HelpCircle },
    {
      id: "profile",
      label: "ACCOUNT SETTINGS",
      icon: Settings,
      isHeader: true,
    },
    {
      id: "profile-info",
      label: "Profile Information",
      icon: User,
      parent: "profile",
    },
    {
      id: "addresses",
      label: "Manage Addresses",
      icon: MapPin,
      parent: "profile",
    },
    // {
    //   id: "reset-password",
    //   label: "Reset Password",
    //   icon: Lock,
    //   parent: "profile",
    // },
  ];

  // Multiple handler functions for different callback names
  const handleOrderClick = (orderData) => {
    let formattedOrderData;

    if (typeof orderData === "string") {
      formattedOrderData = { id: orderData };
    } else if (orderData && typeof orderData === "object") {
      formattedOrderData = {
        id: orderData._id || orderData.id || orderData.orderId,
        productName: orderData.productName || orderData.product_name,
        productQuantity: orderData.productQuantity || orderData.quantity || 1,
        productTotalAm:
          orderData.productTotalAm || orderData.total || orderData.amount,
        price: orderData.price || orderData.totalPrice || orderData.paybleAm,
        status: orderData.status || "pending",
        image: orderData.image || orderData.product_image,
        address: orderData.address || orderData.shippingAddress,
        orderDate:
          orderData.orderDate || orderData.createdAt || orderData.placedOn,
        cupon: orderData.cupon || orderData.coupon,
        totalPrice: orderData.totalPrice || orderData.total,
        shippingCost: orderData.shippingCost || 0,
        ...orderData,
      };
    } else {
      console.error("Invalid orderData:", orderData);
      return;
    }

    setSelectedOrderData(formattedOrderData);
    setShowOrderDetails(true);
  };

  const handleOrderSelect = (orderData) => {
    return handleOrderClick(orderData);
  };

  const handleOrderView = (orderData) => {
    return handleOrderClick(orderData);
  };

  const handleViewOrder = (orderData) => {
    return handleOrderClick(orderData);
  };

  const handleOrderPress = (orderData) => {
    return handleOrderClick(orderData);
  };

  const handleBackToOrders = () => {
    setShowOrderDetails(false);
    setSelectedOrderData(null);
  };

  const getUserId = () => {
    const id = user?._id || user?.id || user?.userId || null;
    return id;
  };

  const renderContent = () => {
    if (!user && profileLoading) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">
            Loading user information...
          </p>
        </div>
      );
    }

    if (showOrderDetails && selectedOrderData) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <button
              onClick={handleBackToOrders}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Orders</span>
            </button>
          </div>
          <div className="p-6">
            <OrderDetail
              orderData={selectedOrderData}
              onBack={handleBackToOrders}
            />
          </div>
        </div>
      );
    }

    // Regular tab content
    switch (activeTab) {
      case "profile-info":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <ProfileInformation />
          </div>
        );

      case "addresses":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <ManageAddresses />
          </div>
        );

      // case "reset-password":
      //   return (
      //     <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      //       <ChangePassword />
      //     </div>
      //   );

      case "orders":
        const userId = getUserId();
        // console.log("Rendering orders with userId:", userId);

        if (!userId) {
          return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="text-red-500 mb-4">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to Load Orders
              </h3>
              <p className="text-gray-500 mb-6">
                User information is not available. Please try logging out and
                logging back in.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Refresh Page
              </button>
            </div>
          );
        }

        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
              <p className="text-gray-600 mt-1">
                Track and manage your purchases
              </p>
            </div>
            <div className="p-6">
              <OrdersList
                userId={userId}
                userID={userId}
                user={user}
                currentUser={user}
                // All possible callback function names
                onOrderClick={handleOrderClick}
                onOrderSelect={handleOrderSelect}
                onOrderView={handleOrderView}
                onViewOrder={handleViewOrder}
                onOrderPress={handleOrderPress}
                handleOrderClick={handleOrderClick}
                handleOrderSelect={handleOrderSelect}
                handleOrderView={handleOrderView}
                orderClick={handleOrderClick}
                orderSelect={handleOrderSelect}
                selectOrder={handleOrderSelect}
                viewOrder={handleOrderView}
              />
            </div>
          </div>
        );

      case "queries":
        const queryUserId = getUserId();

        if (!queryUserId) {
          return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="text-red-500 mb-4">
                <HelpCircle className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to Load Queries
              </h3>
              <p className="text-gray-500">
                User information is not available.
              </p>
            </div>
          );
        }

        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-900">My Queries</h2>
              <p className="text-gray-600 mt-1">
                Track and manage your submitted queries and responses
              </p>
            </div>
            <div className="p-6">
              <MyQueries
                userId={queryUserId}
                user={user}
                currentUser={user}
                userID={queryUserId}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Your Account
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Select an option from the menu to get started with managing your
              account settings and orders.
            </p>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    if (showOrderDetails) return "Order Details";

    switch (activeTab) {
      case "profile-info":
        return "Profile Information";
      case "addresses":
        return "Manage Addresses";
      // case "reset-password":
      //   return "Reset Password";
      case "orders":
        return "My Orders";
      case "queries":
        return "My Queries";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-24 z-20">
        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {menuItems
              .filter((item) => !item.isHeader)
              .map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (showOrderDetails && item.id === "orders");

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id !== "orders") {
                        setShowOrderDetails(false);
                        setSelectedOrderData(null);
                      }
                    }}
                    className={`flex flex-col items-center justify-center px-3 py-2 min-w-[80px] flex-1 max-w-[120px] rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 mb-1 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span className="text-xs font-medium text-center leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          <div className="hidden lg:block relative z-0">
            <div className="w-80 bg-white shadow-sm rounded-xl border border-gray-200">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                {profileLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white flex-shrink-0">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 font-medium">
                        Welcome back,
                      </p>
                      <p className="font-bold text-gray-900 text-xl truncate">
                        {user?.fullname?.firstname || user?.firstname || "User"}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-2 overflow-y-auto">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      activeTab === item.id ||
                      (showOrderDetails && item.id === "orders");

                    if (item.isHeader) {
                      return (
                        <div
                          key={item.id}
                          className="px-3 py-4 border-t border-gray-100 first:border-t-0 mt-6 first:mt-0"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-1 bg-blue-100 rounded-lg flex-shrink-0">
                              <Icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider truncate">
                              {item.label}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (item.id !== "orders") {
                            setShowOrderDetails(false);
                            setSelectedOrderData(null);
                          }
                        }}
                        className={`w-56 text-left py-3 px-4 transition-all duration-200 rounded-xl group relative overflow-hidden
                          ${
                            isActive
                              ? "text-blue-800 py-2 px-4 rounded-full border border-blue-300 transform scale-[1.02]"
                              : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700"
                          }
                          ${item.parent ? "ml-4 text-sm" : ""}
                        `}
                      >
                        <div className="flex items-center space-x-3 relative z-10 min-w-0">
                          <div
                            className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                              isActive
                                ? "bg-white/20"
                                : "bg-gray-100 group-hover:bg-blue-100"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 transition-colors ${
                                isActive
                                  ? "text-blue-800"
                                  : "text-gray-500 group-hover:text-blue-600"
                              }`}
                            />
                          </div>
                          <span className="font-medium truncate flex-1">
                            {item.label}
                          </span>
                        </div>
                        {isActive && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[calc(100vh-12rem)]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
