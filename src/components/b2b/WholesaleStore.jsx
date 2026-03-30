"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import {
  addRFQService,
  getB2BUserRFQsService,
  submitPendingRFQsService,
} from "../../services/rfqServices";

import RFQPage from "./RFQ/RFQPage";
import QuotationPage from "./Quotation/QuotationPage";
import FilterSection from "./Product/FilterSection";
import ProductList from "./Product/ProductList";
import RFQCart from "./RFQ/RFQCart";
import ProfilePage from "./Auth/ProfilePage";
import Notification from "./Notification/Notification";
import { getCategoriesService } from "@/services/categoryServices";
import { getActiveProductsByCustomerType } from "@/services/productServices";

const WholesaleStore = ({ page = "home" }) => {
  const [cart, setCart] = useState([]);
  const [pendingRFQs, setPendingRFQs] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    rating: "",
    bestSaling: false,
  });
  const [sortBy, setSortBy] = useState("name");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const user = useSelector((state) => state.b2bUser.b2bUser);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesService();
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setNotification({
          message: error.message || "Failed to fetch categories",
          type: "error",
        });
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user?.id) {
      const fetchRFQs = async () => {
        try {
          // console.log("Fetching RFQs for user:", user.id);
          const response = await getB2BUserRFQsService();
          const pending = response.rfqs.filter(
            (rfq) => rfq.status === "pending"
          );
          setPendingRFQs(pending);
        } catch (error) {
          console.error("Error fetching RFQs:", error);
          setNotification({
            message: error.message || "Failed to fetch RFQs",
            type: "error",
          });
        }
      };
      fetchRFQs();
    } else {
      console.warn("No user ID found, skipping RFQ fetch");
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getActiveProductsByCustomerType("b2b");
      
        setProducts(response.products || []);
        setTotalProducts(response.products?.length || 0);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        setNotification({ message: "Failed to load products", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products client-side
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.subproduct?.some((sub) =>
            sub.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category?._id === filters.category
      );
    }

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter((product) => {
        const avgRating =
          product.reviews?.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              product.reviews.length
            : 0;
        return avgRating >= parseFloat(filters.rating);
      });
    }

    // Apply bestSaling filter
    if (filters.bestSaling) {
      filtered = filtered.filter((product) => product.bestSaling);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category?.title?.localeCompare(b.category?.title) || 0;
        case "rating":
          const ratingA =
            a.reviews?.length > 0
              ? a.reviews.reduce((sum, r) => sum + r.rating, 0) /
                a.reviews.length
              : 0;
          const ratingB =
            b.reviews?.length > 0
              ? b.reviews.reduce((sum, r) => sum + r.rating, 0) /
                b.reviews.length
              : 0;
          return ratingB - ratingA;
        default:
          return 0;
      }
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * limit;
    return filtered.slice(startIndex, startIndex + limit);
  }, [products, searchTerm, filters, sortBy, currentPage, limit]);

  // Update quantity for a product
const updateQuantity = (productId, changeOrValue, isAbsolute = false) => {
    setQuantities((prev) => {
      if (isAbsolute) {
        return {
          ...prev,
          [productId]: changeOrValue === "" ? "" : Math.max(1, Number(changeOrValue) || 1),
        };
      }
      return {
        ...prev,
        [productId]: Math.max(1, (prev[productId] || 1) + changeOrValue),
      };
    });
  };

  // Add subproduct to RFQ cart
  const addToRFQ = (subproduct, mainProductTitle) => {
    const quantity = quantities[subproduct._id] || 1;
    const existingItem = cart.find((item) => item._id === subproduct._id);

    if (existingItem) {
      setCart((prev) =>
        prev.map((item) =>
          item._id === subproduct._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          _id: subproduct._id,
          subtitle: subproduct.subtitle,
          quantity,
          mainProductTitle,
        },
      ]);
    }
    setNotification({
      message: `${subproduct.subtitle} added to RFQ cart!`,
      type: "success",
    });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
    setQuantities((prev) => ({ ...prev, [subproduct._id]: 1 }));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const item = cart.find((item) => item._id === productId);
    setCart((prev) => prev.filter((item) => item._id !== productId));
    setNotification({
      message: `${item?.subtitle || "Item"} removed from RFQ cart!`,
      type: "success",
    });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const getTotalCartValue = () => {
    return cart.length;
  };

  const submitRFQ = async (event) => {
    event?.preventDefault();
    if (!user?.id) {
      setNotification({
        message: "Please log in to submit RFQ",
        type: "error",
      });
      window.location.href = "/login?role=dealer";
      return;
    }

    if (cart.length === 0) {
      setNotification({ message: "RFQ cart is empty", type: "error" });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      return;
    }

    const invalidItems = cart.filter(
      (item) => !item._id || !item.quantity || item.quantity < 1
    );
    if (invalidItems.length > 0) {
      setNotification({
        message: "Invalid items in cart",
        type: "error",
      });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      return;
    }

    try {
      const rfqData = {
        req_id: `RFQ-${Date.now()}`,
        customer_id: user.id,
        product: cart.map((item) => ({
          id: item._id,
          quantity: item.quantity,
        })),
      };
      const response = await addRFQService(rfqData);
      setNotification({
        message: "RFQ submitted successfully!",
        type: "success",
      });
      setCart([]);
      setShowCart(false);

      const rfqResponse = await getB2BUserRFQsService();
      const pending = rfqResponse.rfqs.filter(
        (rfq) => rfq.status === "pending"
      );
      setPendingRFQs(pending);
    } catch (error) {
      setNotification({
        message: error.message || "Failed to submit RFQ",
        type: "error",
      });
    }
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  // Submit pending RFQs
  const submitPendingRFQs = async () => {
    try {
      const response = await submitPendingRFQsService();
      setPendingRFQs((prev) =>
        prev.filter((rfq) => !response.submittedRFQIds.includes(rfq._id))
      );
      setNotification({
        message: `${response.submittedRFQIds.length} RFQ(s) submitted successfully!`,
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: error.message || "Failed to submit RFQs",
        type: "error",
      });
    }
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "",
      rating: "",
      bestSaling: false,
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Pagination controls
  const totalPages = Math.ceil(totalProducts / limit);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

const updateCartItemQty = (id, newQty) => {
    setCart((prev) =>
      prev.map((it) =>
        it._id === id
          ? {
              ...it,
              quantity: newQty === "" ? "" : Math.max(1, Number.isFinite(+newQty) ? +newQty : 1),
            }
          : it
      )
    );
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-cyan-50 to-teal-50">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      {page === "profile" ? (
        <ProfilePage setNotification={setNotification} />
      // ) 
      // : page === "rfqs" ? (
      //   <RFQPage setNotification={setNotification} />
      ) : page === "quotations" ? (
        <QuotationPage setNotification={setNotification} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <button
                className="lg:hidden bg-indigo-600 text-white py-2 px-4 rounded-lg mb-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <div className={showFilters ? "block" : "hidden lg:block"}>
                <FilterSection
                  filters={filters}
                  setFilters={setFilters}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  clearFilters={clearFilters}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  categories={categories}
                  productCount={filteredAndSortedProducts.length}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
              {loading ? (
                <div className="text-center py-8">Loading products...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                <>
                  <ProductList
                    products={filteredAndSortedProducts}
                    quantities={quantities}
                    updateQuantity={updateQuantity}
                    addToRFQ={addToRFQ}
                  />
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border rounded ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : ""
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <button
                className="lg:hidden bg-indigo-600 text-white py-2 px-4 rounded-lg mb-4"
                onClick={() => setShowCart(!showCart)}
              >
                {showCart ? "Hide Cart" : "Show Cart"}
              </button>
              <RFQCart
                cart={cart}
                pendingRFQs={pendingRFQs}
                removeFromCart={removeFromCart}
                getTotalCartValue={getTotalCartValue}
                submitRFQ={submitRFQ}
                submitPendingRFQs={submitPendingRFQs}
                showCart={showCart}
                updateCartItemQty={updateCartItemQty}
              />
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default WholesaleStore;
