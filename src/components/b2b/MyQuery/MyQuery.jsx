"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getB2bUserQueriesService } from "../../../services/queryServices";
import B2bQueryForm from "./B2bQueryForm";

const MyQuery = () => {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const b2bUser = useSelector((state) => state.b2bUser.b2bUser);

  const fetchQueries = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getB2bUserQueriesService();
      // console.log("getB2bUserQueriesService", response);
      setQueries(response.queries || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError(err.message || "An error occurred while fetching your queries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (b2bUser) {
      fetchQueries();
    }
  }, [b2bUser]);

  const toggleForm = () => {
    if (!b2bUser) {
      setError("You must be logged in to add a query.");
      return;
    }
    setShowForm(!showForm);
  };

  const getStatusBadge = (isResolved) => {
    if (isResolved) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Resolved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        Pending
      </span>
    );
  };

  const getQueryTypeIcon = (queryType) => {
    switch (queryType?.toLowerCase()) {
      case "rfq":
        return (
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "product":
        return (
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  // Calculate stats
  const pendingCount = queries.filter((q) => !q.isresolve).length;
  const resolvedCount = queries.filter((q) => q.isresolve).length;
  const categories = [
    ...new Set(queries.map((q) => q.query_type?.toLowerCase())),
  ];

  // Filter queries based on selected category
  const filteredQueries =
    selectedCategory === "all"
      ? queries
      : queries.filter((q) => q.query_type?.toLowerCase() === selectedCategory);

  if (!b2bUser) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-sm text-gray-600">
            Please log in to view or manage your queries.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Add Query Button */}
      <div className="bg-white rounded-lg shadow p-4">
        <button
          onClick={toggleForm}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                showForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"
              }
            />
          </svg>
          {showForm ? "Close Form" : "Add New Query"}
        </button>

        {showForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <B2bQueryForm onSuccess={fetchQueries} />
          </div>
        )}
      </div>

      {/* Show other content only when form is not open */}
      {!showForm && (
        <>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">My Queries</h1>
                <p className="text-sm text-blue-100">
                  Manage and track your business inquiries
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <div className="text-xl font-bold">{total}</div>
                <div className="text-sm text-blue-100">Total Queries</div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-600">Total Queries</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {pendingCount}
                </div>
                <div className="text-sm text-gray-600">Pending Queries</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {resolvedCount}
                </div>
                <div className="text-sm text-gray-600">Resolved Queries</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-red-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-sm text-gray-600">Loading your queries...</p>
              </div>
            </div>
          )}

          {/* No Queries State */}
          {!loading && filteredQueries.length === 0 && !error && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                No queries found
              </h3>
              <p className="text-sm text-gray-600">
                Get started by creating your first query.
              </p>
            </div>
          )}

          {/* Queries List */}
          {filteredQueries.length > 0 && (
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <div
                  key={query._id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-4">
                    {/* Header with Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                        {getQueryTypeIcon(query.query_type)}
                        <h3 className="text-lg font-bold text-gray-900">
                          {query.name}
                        </h3>
                      </div>
                      {getStatusBadge(query.isresolve)}
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{query.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{query.phone_no}</span>
                      </div>
                    </div>

                    {/* Query Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-700">
                          Query Type:
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {query.query_type}
                        </span>
                      </div>

                      {query.rfq && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-700">
                            RFQ ID:
                          </span>
                          <span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded">
                            {query.rfq}
                          </span>
                        </div>
                      )}

                      {query.product && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-700">
                            Product ID:
                          </span>
                          <span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded">
                            {query.product}
                          </span>
                        </div>
                      )}

                      {query.other_query_type && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-700">
                            Other Query Type:
                          </span>
                          <span className="text-xs text-gray-600">
                            {query.other_query_type}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">
                        Message:
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {query.message}
                        </p>
                      </div>
                    </div>

                    {/* Images */}
                    {query.images && query.images.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">
                          Attachments:
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {query.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.url}
                                alt={`Query attachment ${index + 1}`}
                                className="w-full h-16 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resolution Details */}
                    {query.isresolve && (
                      <div className="bg-green-50 rounded-lg p-3 mb-3">
                        <h4 className="text-xs font-medium text-green-800 mb-1 flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Resolution Details
                        </h4>
                        <div className="space-y-1 text-xs">
                          <p className="text-green-700">
                            <strong>Response:</strong> {query.res_message}
                          </p>
                          <p className="text-green-700">
                            <strong>Responded by:</strong> {query.res_by}
                          </p>
                          <p className="text-green-700">
                            <strong>Resolved on:</strong>{" "}
                            {new Date(query.resAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          Created:{" "}
                          {new Date(query.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        ID: {query._id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyQuery;
