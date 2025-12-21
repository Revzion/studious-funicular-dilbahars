"use client";

import React from "react";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, quantities, updateQuantity, addToRFQ }) => (
  <div className="space-y-6">
    {products.length === 0 ? (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No products found matching your criteria</p>
      </div>
    ) : (
      products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          quantities={quantities}
          updateQuantity={updateQuantity}
          addToRFQ={addToRFQ}
        />
      ))
    )}
  </div>
);

export default ProductList;