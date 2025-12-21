"use client";

import React, { useState } from "react";
import { Download, Calendar, Package, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { updateQuotationStatusByCustomerService } from "../../../services/quotationServices";

const QuotationCard = ({ quotation, setNotification, fetchQuotations }) => {
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false); // New state for dropdown

  const handleDownload = async (url) => {
    setDownloadLoading(true);
    try {
      // Trigger download
      window.open(url, '_blank');
    } catch (error) {
      setNotification({
        message: "Failed to initiate download",
        type: "error",
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    setLoading(true);
    try {
      const quotationId = quotation._id || quotation.id;
      await updateQuotationStatusByCustomerService(quotationId, status);
      setNotification({
        message: `Quotation ${status} successfully!`,
        type: "success",
      });
      // Refetch quotations after successful status update
      await fetchQuotations();
    } catch (error) {
      setNotification({
        message: error.message || `Failed to ${status} quotation`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'sentQuotation':
        return 'Sent Quotation';
      case 'delivered':
        return 'Delivered';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusStyling = (status) => {
    switch (status) {
      case "sentQuotation":
        return "bg-yellow-100 text-yellow-800 ring-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 ring-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 ring-red-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 ring-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 ring-green-200";
      default:
        return "bg-purple-100 text-purple-800 ring-purple-200";
    }
  };

  const getDocumentName = (documentPath) => {
    if (!documentPath) return null;
    return documentPath.split('/').pop().replace(/document-\d+-\d+\./, 'quotation.');
  };

  const getTotalAmount = () => {
    if (!quotation.products || quotation.products.length === 0) return 0;
    return quotation.products.reduce((total, product) => {
      return total + ((product.quantity * product.ppu * (1 - (product.discount || 0) / 100)) || product.totalAmount || 0);
    }, 0);
  };

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Quotation #{quotation.rfqId?.req_id || 'N/A'}
        </h3>
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyling(quotation.status)} ring-1 ring-inset`}
        >
          {getStatusDisplay(quotation.status)}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="h-5 w-5" />
          <p className="text-sm">
            Sent by: {quotation.sendquotationby?.email || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5" />
          <p className="text-sm">
            Expected Shipping:{' '}
            {quotation.expected_shipping_date
              ? new Date(quotation.expected_shipping_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'N/A'}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={toggleProducts}
        >
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Package className="h-5 w-5" /> Products
            </h4>
            <span className="text-xs text-gray-500">
              ({quotation.products?.length || 0} items)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-green-600">
              Total: ₹{getTotalAmount().toFixed(2)}
            </span>
            {isProductsOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>

        {/* Dropdown Content */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isProductsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-3 mt-3">
            {quotation.products && quotation.products.length > 0 ? (
              quotation.products.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {product.id?.sku || product.id || 'N/A'}
                    </span>
                    <span className="text-sm text-gray-600">
                      Price per unit: ₹{product.ppu || 0}
                    </span>
                    <span className="text-sm text-gray-600">
                      Discount: {product.discount || 0}%
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Qty: {product.quantity || 0}
                    </div>
                    <div className="font-semibold text-green-600">
                      Total: ₹
                      {(product.quantity * product.ppu * (1 - (product.discount || 0) / 100)) || product.totalAmount || 0}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-xl border border-gray-100">
                No products found
              </div>
            )}
          </div>
        </div>
      </div>

      {quotation.document && (
        <div className="mb-6 flex items-center">
          <Download className="h-5 w-5 text-blue-600 mr-2" />
          <p className="text-sm text-gray-600">
            Document:{' '}
            <a
              href={quotation.document} 
              onClick={(e) => {
                e.preventDefault();
                handleDownload(quotation.document);
              }}
              download={getDocumentName(quotation.document)}
              className={`text-blue-600 hover:text-blue-800 font-medium transition-colors ${downloadLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {downloadLoading ? "Downloading..." : getDocumentName(quotation.document)}
            </a>
          </p>
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-500 mb-6">
        <span>
          Created:{' '}
          {quotation.createdAt
            ? new Date(quotation.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A'}
        </span>
        <span>
          Updated:{' '}
          {quotation.updatedAt
            ? new Date(quotation.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A'}
        </span>
      </div>

      {quotation.status === "sentQuotation" && (
        <div className="flex gap-3">
          <button
            onClick={() => handleStatusUpdate("accepted")}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Accept"}
          </button>
          <button
            onClick={() => handleStatusUpdate("cancelled")}
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Cancel"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuotationCard;