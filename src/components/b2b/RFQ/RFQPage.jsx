"use client";

import React, { useState, useEffect, useMemo } from "react";
import { List } from "lucide-react";
import RFQCard from "./RFQCard";
import { getB2BUserRFQsService, submitPendingRFQsService } from "@/services/rfqServices";

const RFQPage = ({ setNotification }) => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRFQs = async () => {
      setLoading(true);
      try {
        const response = await getB2BUserRFQsService();
        setRfqs(response.rfqs);
      } catch (error) {
        setNotification({
          message: error.message || "Failed to fetch RFQs",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRFQs();
  }, []);

  const submitPendingRFQs = async () => {
    setIsSubmitting(true);
    try {
      const response = await submitPendingRFQsService();
      setRfqs((prev) =>
        prev.map((rfq) =>
          response.submittedRFQIds.includes(rfq._id)
            ? { ...rfq, status: "submit" }
            : rfq
        )
      );
      setNotification({
        message: "Pending RFQs submitted successfully!",
        type: "success",
      });
      return response;
    } catch (error) {
      setNotification({
        message: error.message || "Failed to submit RFQs",
        type: "error",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your RFQs</h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : rfqs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          <List className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No RFQs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rfqs.map((rfq) => (
            <RFQCard
              key={rfq._id}
              rfq={rfq}
              submitPendingRFQs={submitPendingRFQs}
              setNotification={setNotification}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RFQPage;