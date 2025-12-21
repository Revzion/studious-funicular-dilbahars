"use client";

import React, { useState } from "react";
import { Star, Plus, Minus } from "lucide-react";

const ProductCard = ({ product, quantities, updateQuantity, addToRFQ }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllSubproducts, setShowAllSubproducts] = useState(false);

  // Calculate average rating from reviews
  const avgRating =
    product.reviews?.length > 0
      ? (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : 0;

  // Description truncation logic
  const description = product.description || "";
  const isDescriptionLong = description.length > 100;
  const truncatedDescription = isDescriptionLong
    ? `${description.slice(0, 100)}...`
    : description;

  // Subproducts display logic
  const displayedSubproducts = product.subproduct?.length
    ? showAllSubproducts
      ? product.subproduct
      : product.subproduct.slice(0, 3)
    : [];
  const hasMoreSubproducts = product.subproduct?.length > 3;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex">
        <div className="w-1/3 p-4 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="flex-1">
            <div className="relative">
              <img
                src={
                  product.subproduct?.length > 0
                    ? product.subproduct[0].image[0]?.url || "/api/placeholder/200/200"
                    : "/api/placeholder/200/200"
                }
                alt={product.title || "Product"}
                className="w-full h-24 object-contain rounded-lg border border-gray-200 mb-3"
              />
              {product.bestSaling && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                  Bestselling
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {product.title || "Untitled Product"}
            </h2>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {product.category?.title || "Uncategorized"}
              </span>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="ml-1 text-xs font-semibold text-gray-700">
                  {avgRating}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {showFullDescription ? description : truncatedDescription}
              {isDescriptionLong && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-medium ml-1"
                >
                  {showFullDescription ? "View Less" : "View More"}
                </button>
              )}
            </p>
          </div>
        </div>
        <div className="w-2/3">
          <div className="bg-gray-100 px-4 py-1 border-b border-gray-200">
            <h3 className="font-semibold text-sm text-gray-800">Available Variants</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {displayedSubproducts.map((subproduct) => (
              <div
                key={subproduct._id}
                className="px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={
                        subproduct.image[0]?.url || "/api/placeholder/60/60"
                      }
                      alt={subproduct.subtitle || "Variant"}
                      className="w-12 h-12 object-contain rounded-lg border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        {subproduct.subtitle || "Unnamed Variant"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        SKU: {subproduct.sku || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(subproduct._id, -1)}
                        className="p-1 hover:bg-gray-100 rounded-l"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300 min-w-[40px] text-center text-sm font-medium">
                        {quantities[subproduct._id] || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(subproduct._id, 1)}
                        className="p-1 hover:bg-gray-100 rounded-r"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => addToRFQ(subproduct, product.title || "Untitled Product")}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add to RFQ
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {hasMoreSubproducts && (
              <div className="px-4 py-2 text-center">
                <button
                  onClick={() => setShowAllSubproducts(!showAllSubproducts)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  {showAllSubproducts
                    ? "View Less Variants"
                    : `View More Variants (${product.subproduct?.length - 3} more)`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;