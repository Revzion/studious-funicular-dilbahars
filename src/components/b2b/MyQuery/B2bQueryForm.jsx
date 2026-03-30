"use client";
import React, { useState, useEffect } from "react";
import { addB2bQueryService } from "../../../services/queryServices";
import { getB2BUserRFQsService } from "../../../services/rfqServices";
import { getActiveProductsByCustomerType } from "@/services/productServices";

const B2bQueryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    message: "",
    query_type: "Order",
    rfqId: "",
    productId: "",
    other_query_type: "",
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [rfqs, setRfqs] = useState([]);
  const [products, setProducts] = useState([]);
  const [rfqsLoading, setRfqsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  // Two-level product selection
  const [selectedMainProduct, setSelectedMainProduct] = useState("");

  // Fetch RFQs when query type is Order or Other
  useEffect(() => {
    if (formData.query_type === "Order" || formData.query_type === "Other") {
      const fetchRFQs = async () => {
        setRfqsLoading(true);
        try {
          const response = await getB2BUserRFQsService();
          setRfqs(response.rfqs || []);
        } catch (err) {
          setError("Failed to fetch RFQs.");
        } finally {
          setRfqsLoading(false);
        }
      };
      fetchRFQs();
    }
  }, [formData.query_type]);

  // Fetch Products when query type is Product or Other
  useEffect(() => {
    if (formData.query_type === "Product" || formData.query_type === "Other") {
      const fetchProducts = async () => {
        setProductsLoading(true);
        try {
          const response = await getActiveProductsByCustomerType("b2b");
          setProducts(response.products || []);
        } catch (err) {
          setError("Failed to fetch products.");
        } finally {
          setProductsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [formData.query_type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Reset subproduct + main product selection when query type changes
    if (name === "query_type") {
      setSelectedMainProduct("");
      setFormData((prev) => ({ ...prev, productId: "", rfqId: "", [name]: value }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // When user picks a main product, reset subproduct selection
  const handleMainProductChange = (e) => {
    setSelectedMainProduct(e.target.value);
    setFormData((prev) => ({ ...prev, productId: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const data = new FormData();

    // Always append base fields
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone_no", formData.phone_no);
    data.append("message", formData.message);
    data.append("query_type", formData.query_type);

    // Conditionally append based on query type
    if (formData.query_type === "Order") {
      data.append("rfqId", formData.rfqId);
    } else if (formData.query_type === "Product") {
      data.append("productId", formData.productId);
    } else if (formData.query_type === "Other") {
      if (formData.rfqId) data.append("rfqId", formData.rfqId);
      if (formData.productId) data.append("productId", formData.productId);
      data.append("other_query_type", formData.other_query_type);
    }

    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await addB2bQueryService(data);
      setSuccess(response.message);
      setFormData({
        name: "",
        email: "",
        phone_no: "",
        message: "",
        query_type: "Order",
        rfqId: "",
        productId: "",
        other_query_type: "",
      });
      setSelectedMainProduct("");
      setImages([]);
    } catch (err) {
      setError(err.message || "An error occurred while submitting the query.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700";

  // Helper: get subproducts of currently selected main product
  const getSubproducts = () => {
    const main = products.find((p) => p._id === selectedMainProduct);
    return main?.subproduct || [];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit B2B Query</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            type="tel"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </div>

        {/* Query Type */}
        <div>
          <label className={labelClass}>Query Type</label>
          <select
            name="query_type"
            value={formData.query_type}
            onChange={handleInputChange}
            required
            className={inputClass}
          >
            <option value="Order">Order</option>
            <option value="Product">Product</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* ── ORDER: RFQ dropdown (required) ── */}
        {formData.query_type === "Order" && (
          <div>
            <label className={labelClass}>RFQ</label>
            {rfqsLoading ? (
              <p className="text-sm text-gray-500 mt-1">Loading RFQs...</p>
            ) : (
              <select
                name="rfqId"
                value={formData.rfqId}
                onChange={handleInputChange}
                required
                className={inputClass}
              >
                <option value="">-- Select an RFQ --</option>
                {rfqs.map((rfq) => (
                  <option key={rfq._id} value={rfq._id}>
                    {rfq.req_id || rfq._id} — {rfq.status}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* ── PRODUCT: Main product → Subproduct (both required) ── */}
        {formData.query_type === "Product" && (
          <>
            <div>
              <label className={labelClass}>Product</label>
              {productsLoading ? (
                <p className="text-sm text-gray-500 mt-1">Loading products...</p>
              ) : (
                <select
                  value={selectedMainProduct}
                  onChange={handleMainProductChange}
                  required
                  className={inputClass}
                >
                  <option value="">-- Select a Product --</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedMainProduct && (
              <div>
                <label className={labelClass}>Variant / Sub-product</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                >
                  <option value="">-- Select a Variant --</option>
                  {getSubproducts().map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subtitle}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        {/* ── OTHER: RFQ (optional) + Main product → Subproduct (optional) + Description (required) ── */}
        {formData.query_type === "Other" && (
          <>
            {/* RFQ optional */}
            <div>
              <label className={labelClass}>RFQ (Optional)</label>
              {rfqsLoading ? (
                <p className="text-sm text-gray-500 mt-1">Loading RFQs...</p>
              ) : (
                <select
                  name="rfqId"
                  value={formData.rfqId}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">-- Select an RFQ (optional) --</option>
                  {rfqs.map((rfq) => (
                    <option key={rfq._id} value={rfq._id}>
                      {rfq.req_id || rfq._id} — {rfq.status}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Main product optional */}
            <div>
              <label className={labelClass}>Product (Optional)</label>
              {productsLoading ? (
                <p className="text-sm text-gray-500 mt-1">Loading products...</p>
              ) : (
                <select
                  value={selectedMainProduct}
                  onChange={handleMainProductChange}
                  className={inputClass}
                >
                  <option value="">-- Select a Product (optional) --</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Subproduct optional — only shown once a main product is picked */}
            {selectedMainProduct && (
              <div>
                <label className={labelClass}>Variant / Sub-product (Optional)</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">-- Select a Variant (optional) --</option>
                  {getSubproducts().map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subtitle}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Other description required */}
            <div>
              <label className={labelClass}>Other Query Description</label>
              <input
                type="text"
                name="other_query_type"
                value={formData.other_query_type}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* Message */}
        <div>
          <label className={labelClass}>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className={inputClass}
            rows="4"
          />
        </div>

        {/* Images */}
        <div>
          <label className={labelClass}>Upload Images (Max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="h-20 w-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Query"}
        </button>
      </form>
    </div>
  );
};

export default B2bQueryForm;