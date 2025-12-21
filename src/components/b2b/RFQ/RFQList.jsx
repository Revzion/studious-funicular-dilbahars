"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, User, Package, Search, Calendar, X, Loader2 } from "lucide-react";
import { getB2BUserRFQsService } from "@/services/rfqServices";

const RFQList = ({ setNotification }) => {
  const [rfqs, setRfqs] = useState([]);
  const [rfqLoading, setRfqLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rfqId, setRfqId] = useState("");

  // Fetch RFQs
  const fetchRFQs = async () => {
    try {
      // console.log("Fetching RFQs with filters:", { startDate, endDate, rfqId });
      setRfqLoading(true);
      const response = await getB2BUserRFQsService({ startDate, endDate, rfqId });
      // console.log("Fetched RFQs:", response.rfqs);
      setRfqs(response.rfqs);
    } catch (error) {
      console.error("Error fetching RFQs:", error);
      setNotification({
        message: error.message || "Failed to fetch RFQs",
        type: "error",
      });
    } finally {
      setRfqLoading(false);
    }
  };

  // Fetch RFQs on initial mount and when date filters change
  useEffect(() => {
    fetchRFQs();
  }, [setNotification, startDate, endDate]);

  // Toggle expanded card for details
  const toggleCard = (rfqId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [rfqId]: !prev[rfqId],
    }));
  };

  // Clear filters
  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setRfqId("");
    fetchRFQs(); // Explicitly fetch after clearing filters
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchRFQs();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Get status styles
  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          dot: "bg-yellow-500",
        };
      case "submit":
        return { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" };
      case "accepted":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          dot: "bg-green-500",
        };
      default:
        return { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Your RFQs</h2>

      <div className="mb-8 bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={rfqId}
              onChange={(e) => setRfqId(e.target.value)}
              placeholder="Search by ID"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Search
            </button>
          </div>
          <div className="flex-1 flex items-center gap-2">
            {/* <Calendar className="h-5 w-5 text-gray-400" /> */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            {/* <Calendar className="h-5 w-5 text-gray-400" /> */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {/* <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Apply Dates
            </button> */}
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all font-medium flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {rfqLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Loading RFQs...</p>
        </div>
      ) : rfqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Package className="h-14 w-14 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No RFQs found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {rfqs.map((rfq) => {
            const statusStyles = getStatusStyles(rfq.status);
            return (
              <div
                key={rfq._id}
                className="bg-white rounded-2xl border border-gray-200 shadow transition hover:shadow-lg overflow-hidden"
              >
                {/* Header */}
                <div
                  className="p-5 sm:p-6 flex justify-between items-center cursor-pointer bg-gray-50"
                  onClick={() => toggleCard(rfq._id)}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        RFQ #{rfq.req_id}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${statusStyles.dot}`}
                        />
                        <span
                          className={`text-sm font-medium ${statusStyles.text}`}
                        >
                          {rfq.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <p>Created: {formatDate(rfq.createdAt)}</p>
                      <p>Updated: {formatDate(rfq.updatedAt)}</p>
                      <p className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        {rfq.customer.name} ({rfq.customer.companyname})
                      </p>
                    </div>
                  </div>

                  <div className="ml-4">
                    {expandedCards[rfq._id] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Body */}
                {expandedCards[rfq._id] && (
                  <div className="px-6 pb-6 pt-4 bg-white animate-fadeIn border-t border-gray-200 text-sm text-gray-700">
                    {/* Products */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Products
                      </h4>
                      {rfq.products?.length ? (
                        <ul className="grid gap-2">
                          {rfq.products.map((product, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 border"
                            >
                              <span className="truncate max-w-[60%] text-gray-700">
                                {product.sku || `Product ${index + 1} (No SKU)`}
                              </span>
                              <span className="font-medium text-gray-800">
                                Qty: {product.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">
                          No products in this RFQ.
                        </p>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Customer Details
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        {[
                          ["Name", rfq.customer.name],
                          ["Email", rfq.customer.email],
                          ["Phone", rfq.customer.phoneNo],
                          ["Company", rfq.customer.companyname],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-xs text-gray-500 uppercase">
                              {label}
                            </p>
                            <p className="text-gray-800 font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RFQList;