"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

const RFQCart = ({
  cart,
  pendingRFQs,
  removeFromCart,
  getTotalCartValue,
  submitRFQ,
  submitPendingRFQs,
  showCart,
  updateCartItemQty, // <-- new prop for updating quantity
}) => {
  const [isSubmittingRFQ, setIsSubmittingRFQ] = useState(false);
  const [isSubmittingPending, setIsSubmittingPending] = useState(false);

  const handleSubmitRFQ = async (e) => {
    setIsSubmittingRFQ(true);
    try {
      await submitRFQ(e);
    } catch (error) {
      console.error("Error submitting RFQ:", error);
    } finally {
      setIsSubmittingRFQ(false);
    }
  };

  const handleSubmitPendingRFQs = async () => {
    setIsSubmittingPending(true);
    try {
      await submitPendingRFQs();
    } catch (error) {
      console.error("Error submitting pending RFQs:", error);
    } finally {
      setIsSubmittingPending(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24 ${
        showCart ? "block" : "hidden lg:block"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-indigo-600" />
          RFQ Cart ({cart.length + pendingRFQs.length})
        </h3>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        {cart.length === 0 && pendingRFQs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Your RFQ cart is empty</p>
        ) : (
          <div className="space-y-3">
            {/* Current Cart Items */}
            {cart.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-gray-800">
                  Cart Items
                </h4>
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white shadow-sm border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-sm font-medium text-gray-900">
                        {item.subtitle}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        disabled={isSubmittingRFQ || isSubmittingPending}
                        className="text-red-500 hover:text-red-700 text-2xl font-bold disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      From:{" "}
                      <span className="font-medium">
                        {item.mainProductTitle}
                      </span>
                    </p>

                    {/* Qty + - Buttons */}
                    <div className="flex justify-between items-center text-sm text-gray-700">
                      <span className="flex items-center gap-2">
                        Qty:
                        <button
                          type="button"
                          onClick={() =>
                            updateCartItemQty(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartItemQty(item._id, item.quantity + 1)
                          }
                          className="px-2 py-1 border rounded"
                        >
                          +
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pending RFQs */}
            {pendingRFQs.length > 0 && (
              <>
                <h4 className="text-sm font-medium text-gray-700 mb-2 mt-4">
                  Pending RFQs
                </h4>
                {pendingRFQs.map((rfq) => (
                  <div
                    key={rfq._id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <h4 className="font-medium text-sm mb-1">
                      RFQ #{rfq.req_id}
                    </h4>
                    {rfq.products && rfq.products.length > 0 ? (
                      rfq.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm mt-1"
                        >
                          <span className="text-gray-600">
                            {product.sku ||
                              `Product ${index + 1} (SKU Missing)`}
                          </span>
                          <span className="text-gray-600">
                            Qty: {product.quantity}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No products in this RFQ
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      {(cart.length > 0 || pendingRFQs.length > 0) && (
        <div className="p-4 border-t border-gray-200">
          {cart.length > 0 && (
            <button
              type="button"
              onClick={handleSubmitRFQ}
              disabled={isSubmittingRFQ || isSubmittingPending}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed mb-2"
            >
              {isSubmittingRFQ ? "Requesting..." : "Request Quote for Cart"}
            </button>
          )}
          {pendingRFQs.length > 0 && (
            <button
              type="button"
              onClick={handleSubmitPendingRFQs}
              disabled={isSubmittingRFQ || isSubmittingPending}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmittingPending ? "Submitting..." : "Submit Pending RFQs"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RFQCart;
