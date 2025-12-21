"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FileText, Loader2, Search, Calendar, X } from "lucide-react";

import { getB2bUserQuotations } from "../../../services/quotationServices";
import QuotationCard from "./QuotationCard";

const QuotationPage = ({ setNotification }) => {
  const [quotations, setQuotations] = useState([]);
  const [quotationLoading, setQuotationLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quotationId, setQuotationId] = useState("");
  
  const userId = useSelector((state) => state.b2bUser.id);

  const fetchQuotations = async () => {
    try {
      // console.log("Fetching quotations with filters:", { startDate, endDate, quotationId });
      setQuotationLoading(true);
      const response = await getB2bUserQuotations({ startDate, endDate, quotationId });
      // console.log('response', response);
      if (response?.success && response?.quotations) {
        const userQuotations = response.quotations.filter((q) => {
          return q.rfqId?.customer_id?._id === userId || !userId;
        });
        
        setQuotations(userQuotations);
      } else {
        setQuotations([]);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setNotification({
        message: error.message || "Failed to fetch quotations",
        type: "error",
      });
    } finally {
      setQuotationLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [userId, setNotification, startDate, endDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQuotations();
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setQuotationId("");
    fetchQuotations(); // Explicitly fetch after clearing filters
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
            Your Quotations
          </h2>
        </div>

        <div className="mb-8 bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex items-center gap-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={quotationId}
                onChange={(e) => setQuotationId(e.target.value)}
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

        {quotationLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading Quotations...</p>
          </div>
        ) : quotations.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-200">
            <FileText className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <p className="text-xl text-gray-600 font-medium">No quotations available</p>
            <p className="mt-2 text-gray-500">Create a new quotation to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotations.map((quotation) => (
              <QuotationCard
                key={quotation._id || quotation.id}
                quotation={quotation}
                setNotification={setNotification}
                fetchQuotations={fetchQuotations}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationPage;