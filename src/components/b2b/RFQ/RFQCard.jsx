"use client";

import React, { useState } from "react";

const RFQCard = ({ rfq, submitPendingRFQs, setNotification, isSubmitting }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitPendingRFQs();
      setNotification({
        message: "Pending RFQs submitted successfully!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: error.message || "Failed to submit RFQs",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">RFQ #{rfq.req_id}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            rfq.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : rfq.status === "submit"
              ? "bg-blue-100 text-blue-800"
              : rfq.status === "accepted"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Customer: {rfq.customer.name}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Company: {rfq.customer.companyname}
      </p>
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Products</h4>
        <ul className="space-y-2">
          {rfq.products.map((product, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span>{product.sku}</span>
              <span>Qty: {product.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-gray-500">
        Created: {new Date(rfq.createdAt).toLocaleDateString()}
      </p>
      {rfq.status === "pending" && (
        <button
          onClick={handleSubmit}
          disabled={loading || isSubmitting}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading || isSubmitting ? "Submitting..." : "Submit RFQ"}
        </button>
      )}
    </div>
  );
};

export default RFQCard;