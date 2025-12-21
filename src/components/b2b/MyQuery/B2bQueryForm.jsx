"use client";
import React, { useState } from "react";
import { addB2bQueryService } from "../../../services/queryServices";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    Object.keys(formData).forEach((key) => {
      if (
        (key === "rfqId" &&
          !formData.rfqId &&
          formData.query_type !== "Order" &&
          formData.query_type !== "Other") ||
        (key === "productId" &&
          !formData.productId &&
          formData.query_type !== "Product" &&
          formData.query_type !== "Other") ||
        (key === "other_query_type" &&
          !formData.other_query_type &&
          formData.query_type !== "Other")
      ) {
        return;
      }
      data.append(key, formData[key]);
    });

    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await addB2bQueryService(data);
      // console.log("added query", response);
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
      setImages([]);
    } catch (err) {
      setError(err.message || "An error occurred while submitting the query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit B2B Query</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Query Type
          </label>
          <select
            name="query_type"
            value={formData.query_type}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Order">Order</option>
            <option value="Product">Product</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {formData.query_type === "Order" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              RFQ ID
            </label>
            <input
              type="text"
              name="rfqId"
              value={formData.rfqId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        {formData.query_type === "Product" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        {formData.query_type === "Other" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                RFQ ID (Optional)
              </label>
              <input
                type="text"
                name="rfqId"
                value={formData.rfqId}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product ID (Optional)
              </label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Other Query Description
              </label>
              <input
                type="text"
                name="other_query_type"
                value={formData.other_query_type}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Images (Max 5)
          </label>
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
