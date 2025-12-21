"use client";

import React from "react";
import { Filter, ChevronDown, X, FileText } from "lucide-react";

const FilterSection = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  clearFilters,
  showFilters,
  setShowFilters,
  categories,
  productCount,
  searchTerm,
  setSearchTerm,
}) => {
  // console.log("categories", categories);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {productCount} products</span>
            {(Object.values(filters).some((f) => f) || searchTerm) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1 text-indigo-600 hover:text-indigo-800"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories?.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category?.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, rating: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Ratings</option>
                <option value="4.0">4.0 & above</option>
                <option value="3.5">3.5 & above</option>
                <option value="3.0">3.0 & above</option>
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Selling
              </label>
              <input
                type="checkbox"
                checked={filters.bestSaling}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    bestSaling: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
