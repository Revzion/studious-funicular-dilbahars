"use client"
import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Download, MessageCircle, ChevronRight, ChevronLeft, Calendar, Package, Truck, XCircle, CheckCircle, RefreshCw } from 'lucide-react';

// Mock data for orders
const mockOrders = [
  {
    id: 1,
    productName: "Naturoz Popular California Almonds",
    price: 434,
    status: "delivered",
    statusText: "Delivered on Feb 17",
    color: "",
    size: "",
    image: "/api/placeholder/80/80",
    orderDate: "2024-02-15",
    deliveryDate: "2024-02-17",
    refundId: null,
    cancellationReason: null,
    seller: "SKBINTERNATIONAL"
  },
  {
    id: 2,
    productName: "Nendle Cotton Floral Sofa Cover",
    price: 419,
    status: "refund_completed",
    statusText: "Refund Completed",
    color: "Brown",
    size: "",
    image: "/api/placeholder/80/80",
    orderDate: "2024-02-01",
    deliveryDate: null,
    refundId: "122033558274487161871",
    cancellationReason: "You returned this order because there were quality issues with the fabric.",
    seller: "HOME DECOR"
  },
  {
    id: 3,
    productName: "SKOLL Women Heels",
    price: 307,
    status: "cancelled",
    statusText: "Cancelled on Dec 28, 2024",
    color: "Black",
    size: "4",
    image: "/api/placeholder/80/80",
    orderDate: "2024-12-26",
    deliveryDate: null,
    refundId: null,
    cancellationReason: "As per your request, your item has been cancelled",
    seller: "FASHION STORE"
  },
  {
    id: 4,
    productName: "Kenstar KTG02KGPR0-DBM Grill",
    price: 709,
    status: "cancelled",
    statusText: "Cancelled on Sep 27, 2024",
    color: "Black",
    size: "",
    image: "/api/placeholder/80/80",
    orderDate: "2024-09-25",
    deliveryDate: null,
    refundId: null,
    cancellationReason: "You requested a cancellation due to quality issues with the product.",
    seller: "ELECTRONICS HUB"
  },
  {
    id: 5,
    productName: "Strapit Laptop Sleeve Case 15.6-16 inch",
    price: 224,
    status: "delivered",
    statusText: "Delivered on Sep 04, 2024",
    color: "Black",
    size: "",
    image: "/api/placeholder/80/80",
    orderDate: "2024-09-01",
    deliveryDate: "2024-09-04",
    refundId: null,
    cancellationReason: null,
    seller: "TECH ACCESSORIES"
  }
];

export const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    timeRange: [],
    priceRange: ''
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter orders based on selected filters and search
  useEffect(() => {
    let filtered = mockOrders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.seller.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(order => filters.status.includes(order.status));
    }

    // Time range filter
    if (filters.timeRange.length > 0) {
      const currentDate = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        if (filters.timeRange.includes('last30days')) {
          const thirtyDaysAgo = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= thirtyDaysAgo;
        }
        if (filters.timeRange.includes('2024')) {
          return orderDate.getFullYear() === 2024;
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  }, [searchQuery, filters]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'refund_completed':
        return <RefreshCw className="w-4 h-4 text-orange-500" />;
      default:
        return <Package className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'refund_completed':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (selectedOrder) {
    return <OrderDetailPage order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center text-sm text-gray-600">
          <span>Home</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>My Account</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">My Orders</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:w-64 bg-white border-r border-gray-200 p-4`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
          
          {/* Order Status Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">ORDER STATUS</h3>
            <div className="space-y-2">
              {[
                { value: 'on_the_way', label: 'On the way' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'refund_completed', label: 'Returned' }
              ].map(status => (
                <label key={status.value} className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={filters.status.includes(status.value)}
                    onChange={() => handleFilterChange('status', status.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Time Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">ORDER TIME</h3>
            <div className="space-y-2">
              {[
                { value: 'last30days', label: 'Last 30 days' },
                { value: '2024', label: '2024' },
                { value: '2023', label: '2023' },
                { value: '2022', label: '2022' },
                { value: '2021', label: '2021' },
                { value: 'older', label: 'Older' }
              ].map(time => (
                <label key={time.value} className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={filters.timeRange.includes(time.value)}
                    onChange={() => handleFilterChange('timeRange', time.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{time.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center p-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your orders here"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Search Orders
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{order.productName}</h3>
                    {order.color && (
                      <p className="text-sm text-gray-600">Color: {order.color}</p>
                    )}
                    {order.size && (
                      <p className="text-sm text-gray-600">Size: {order.size}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">₹{order.price}</p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.statusText}
                    </div>
                    
                    {order.status === 'delivered' && (
                      <button className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700">
                        <Star className="w-4 h-4" />
                        Rate & Review Product
                      </button>
                    )}
                  </div>
                </div>

                {/* Refund/Cancellation Info */}
                {order.refundId && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Refund Completed</strong> (Refund ID: {order.refundId})
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      The money was sent to your Bank Account linked with UPI ID ******1317@ybl on Feb 07 11:48 AM.
                    </p>
                  </div>
                )}

                {order.cancellationReason && !order.refundId && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-700">{order.cancellationReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderDetailPage = ({ order, onBack }) => {
  const [activeTab, setActiveTab] = useState('details');

  const shippingDetails = {
    name: "Harshita",
    address: "Near bhartiya degree College\nChamdhera road, B P M Gandhi &amp; Marriage Place\nMahendragarh\nHaryana - 123029",
    phone: "8168562374"
  };

  const priceBreakdown = {
    listPrice: 600,
    sellingPrice: 555,
    extraDiscount: -106,
    specialPrice: 449,
    deliveryCharge: 0,
    handlingFee: 7,
    tenPercentOff: -25,
    platformFee: 3,
    total: 434
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Orders
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Product Header */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-gray-900 mb-2">{order.productName}</h1>
                  <p className="text-gray-600">Seller: {order.seller}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">₹{order.price}</p>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Confirmed, Feb 15</p>
                      <p className="text-sm text-gray-600">Your order has been placed</p>
                    </div>
                  </div>
                  
                  {order.status === 'delivered' && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Delivered, Feb 17</p>
                        <p className="text-sm text-gray-600">Your item has been delivered</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Section for Delivered Orders */}
              {order.status === 'delivered' && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate this product</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-8 h-8 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors" />
                    ))}
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Submit Rating
                  </button>
                </div>
              )}

              {/* Chat Section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <MessageCircle className="w-5 h-5" />
                  Chat with us
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Invoice */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Shipping details</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{shippingDetails.name}</p>
                <div className="whitespace-pre-line">{shippingDetails.address}</div>
                <p>Phone number: {shippingDetails.phone}</p>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Price Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">List price</span>
                  <span>₹{priceBreakdown.listPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling price</span>
                  <span>₹{priceBreakdown.sellingPrice}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Extra Discount</span>
                  <span>- ₹{Math.abs(priceBreakdown.extraDiscount)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Special Price</span>
                  <span>₹{priceBreakdown.specialPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="text-green-600">₹{priceBreakdown.deliveryCharge} Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Handling Fee</span>
                  <span>₹{priceBreakdown.handlingFee}</span>
                </div>
                <div className="flex justify-between text-green-600 text-xs">
                  <span>Get extra 10% off upto ₹25 on 5 item(s)</span>
                  <span>- ₹{Math.abs(priceBreakdown.tenPercentOff)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform fee</span>
                  <span>₹{priceBreakdown.platformFee}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{priceBreakdown.total}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>1 coupon:</strong><br />
                  Get extra 10% off upto ₹25 on 5 item(s)<br />
                  (price inclusive of cashback/coupon) ₹25
                </p>
              </div>

              <div className="mt-4 text-sm">
                <p><strong>Cash On Delivery:</strong> ₹{priceBreakdown.total}.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
