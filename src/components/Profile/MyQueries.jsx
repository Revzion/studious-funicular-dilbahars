"use client";
import React, { useState, useEffect } from "react";
import { getUserQueriesService } from "../../services/queryServices";
import QueryForm from "./QueryForm";
import {
  MessageCircle,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Image,
  RefreshCw,
  PlusCircle,
  X,
  ArrowLeft,
  Package,
  ShoppingCart,
  Phone,
  Mail,
  Folder,
} from "lucide-react";
// import { toast } from "../Toast/Toast";

const MyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [isQueryFormOpen, setIsQueryFormOpen] = useState(false);
  const [newQuery, setNewQuery] = useState("");

  useEffect(() => {
    fetchUserQueries();
  }, []);

  const fetchUserQueries = async (showToast = false) => {
    try {
      setLoading(!showToast);
      const response = await getUserQueriesService();
      console.log("getUserQueriesService", response);
      setQueries(response.queries || response.data || []);
      setError(null);

      if (showToast) {
        // toast.success("Queries refreshed successfully!");
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch queries";
      setError(errorMessage);

      if (showToast) {
        // toast.error(`Failed to refresh queries: ${errorMessage}`);
      } else {
        // toast.error(`Error loading queries: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchUserQueries(true);
  };

  const handleRetry = () => {
    fetchUserQueries();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getStatusBadge = (query) => {
    const isResolved = query.isresolve;
    return isResolved ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Resolved
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "order":
        return <Package className="w-4 h-4" />;
      case "product":
        return <ShoppingCart className="w-4 h-4" />;
      case "support":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  const getCustomerTypeColor = (customerType) => {
    return customerType === "b2c"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get unique categories
  const categories = [
    ...new Set(queries.map((q) => q.query_type).filter(Boolean)),
  ];

  const filteredQueries = queries.filter((query) => {
    // Filter by status
    let statusMatch = true;
    if (filter === "resolved") {
      statusMatch = query.isresolve === true;
    } else if (filter === "pending") {
      statusMatch = query.isresolve === false;
    }

    // Filter by category
    let categoryMatch = true;
    if (selectedCategory !== "all") {
      categoryMatch = query.query_type === selectedCategory;
    }

    return statusMatch && categoryMatch;
  });

  // Group queries by category
  const queriesByCategory = filteredQueries.reduce((acc, query) => {
    const category = query.query_type || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(query);
    return acc;
  }, {});

  // Callback function to handle successful query submission
  const handleQuerySubmitted = () => {
    setIsQueryFormOpen(false);
    fetchUserQueries(true);
  };

  // If query form is open, show only the query form
  if (isQueryFormOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="pl-5 sm:pl-7 pt-2 sm:pt-3">
          <button
            onClick={() => setIsQueryFormOpen(false)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
        <QueryForm onQuerySubmitted={handleQuerySubmitted} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-blue-200 rounded w-1/3"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-48 shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Queries
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Add Query Button */}
        <div className="mb-4 sm:mb-8 flex justify-end">
          <button
            onClick={() => setIsQueryFormOpen(true)}
            className="flex items-center bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group "
          >
            <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
            Add New Query
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Queries
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {queries.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-3" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Resolved
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {queries.filter((q) => q.isresolve === true).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Pending
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {queries.filter((q) => q.isresolve === false).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <Folder className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Categories
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap gap-4 sm:gap-8 px-4 sm:px-6 py-2">
              {[
                { key: "all", label: "All Queries", count: queries.length },
                {
                  key: "resolved",
                  label: "Resolved",
                  count: queries.filter((q) => q.isresolve === true).length,
                },
                {
                  key: "pending",
                  label: "Pending",
                  count: queries.filter((q) => q.isresolve === false).length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleFilterChange(tab.key)}
                  className={`py-2 sm:py-4 text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Folder className="w-4 h-4 mr-2" />
                All Categories ({queries.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {getCategoryIcon(category)}
                  <span className="ml-2">
                    {category} (
                    {queries.filter((q) => q.query_type === category).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Queries List - Grouped by Category */}
        {filteredQueries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No queries found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {filter === "all" && selectedCategory === "all"
                ? "You haven't submitted any queries yet."
                : `No queries found for the selected filters.`}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(queriesByCategory).map(
              ([category, categoryQueries]) => (
                <div
                  key={category}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      {getCategoryIcon(category)}
                      <h2 className="ml-3 text-lg font-semibold text-gray-900">
                        {category} ({categoryQueries.length})
                      </h2>
                    </div>
                  </div>

                  {/* Queries in Category */}
                  <div className="divide-y divide-gray-200">
                    {categoryQueries.map((query, index) => (
                      <div
                        key={query._id || index}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        {/* Query Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                Query #{query._id?.slice(-8) || index + 1}
                              </h3>
                              {getStatusBadge(query)}
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCustomerTypeColor(
                                  query.customer_type
                                )}`}
                              >
                                {query.customer_type?.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 gap-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(query.createdAt)}
                              </div>
                              {query.updatedAt !== query.createdAt && (
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  Updated: {formatDate(query.updatedAt)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <User className="w-4 h-4 mr-2 text-blue-600" />
                            Customer Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 mr-2">
                                Name:
                              </span>
                              <span className="text-gray-900">
                                {query.name || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="text-gray-900">
                                {query.email || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="text-gray-900">
                                {query.phone_no || "N/A"}
                              </span>
                            </div>
                            {query.order && (
                              <div className="flex items-center">
                                <Package className="w-4 h-4 mr-1 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  Order: {query.order.slice(-8)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Query Message */}
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <MessageCircle className="w-4 h-4 mr-2 text-yellow-600" />
                            Query Message
                          </h4>
                          <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">
                            {query.message || "No message provided"}
                          </p>
                          {query.images && query.images.length > 0 && (
                            <div className="mt-3 flex items-center text-sm text-yellow-600">
                              <Image className="w-4 h-4 mr-1" />
                              {query.images.length} image(s) attached
                            </div>
                          )}
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 mt-5">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                            Query Response
                          </h4>
                          <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">
                            {query.res_message || "No Response Provided"}
                          </p>
                          {/* {query.images && query.images.length > 0 && (
                            <div className="mt-3 flex items-center text-sm text-green-600">
                              <Image className="w-4 h-4 mr-1" />
                              {query.images.length} image(s) attached
                            </div>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQueries;
