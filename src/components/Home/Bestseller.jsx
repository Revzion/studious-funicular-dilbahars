import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  ShoppingCart,
  ChevronRight,
  Heart,
  Star,
  Candy,
  ChevronLeft,
  ChevronRight as RightArrow,
} from "lucide-react";
import ProductCard from "../products/ProductCard";
import { getBestSellingProducts } from "@/services/bestsellingService";
import { motion } from "framer-motion";
// import { toast } from "../Toast/Toast";
import { useSelector } from "react-redux";

function Bestseller({
  cart = [],
  onAddToCart,
  onUpdateQuantity,
  onProductSelect,
}) {
  const scrollRef = useRef(null);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(new Set());

  const reduxCart = useSelector((state) => state.cart.items);
  // console.log('reduxCart', reduxCart)

  useEffect(() => {
    const BestsellerProduct = async () => {
      try {
        const res = await getBestSellingProducts();
        // console.log("best", res);
        setBestSellingProducts(res.data);
      } catch (error) {
        console.error("Error fetching best selling products:", error);
        // toast.error(error.message || "Failed to fetch best selling products");
      }
    };
    BestsellerProduct();
  }, []);

  const currentCart = useMemo(() => {
    return reduxCart && reduxCart.length > 0 ? reduxCart : cart;
  }, [reduxCart, cart]);

  const handleAddToCart = async (product) => {
    const productId = product._id || product.id;
    setLoadingProducts((prev) => new Set(prev).add(productId));

    try {
      if (onAddToCart) {
        await onAddToCart(product);
        showNotification(product);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleUpdateQuantity = async (product, newQuantity) => {
    const productId = product._id || product.id;
    setLoadingProducts((prev) => new Set(prev).add(productId));

    try {
      if (onUpdateQuantity) {
        await onUpdateQuantity(product, newQuantity);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoadingProducts((prev) => {
        const newSet = new Set(prev); 
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleProductSelect = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const showNotification = (product) => {
    // toast.success(`${product.name || product.title} added to cart!`);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -310, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 310, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-[#DBFCE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
              Bestsellers
            </h2>
            <p className="text-teal-600 mt-2">
              Our most popular products across all categories
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Arrows */}
          {bestSellingProducts.length > 0 && (
            <div className="hidden md:block">
              <button
                onClick={scrollLeft}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 rounded-full bg-blue-100 shadow-lg p-2 hover:bg-blue-200 transition-all text-teal-600"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={scrollRight}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 rounded-full bg-blue-100 shadow-lg p-2 hover:bg-blue-200 transition-all text-teal-600"
              >
                <RightArrow />
              </button>
            </div>
          )}

          {/* Product List */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 gap-4 snap-x custom-scrollbar scroll-smooth"
          >
            {bestSellingProducts.length > 0 ? (
              bestSellingProducts.map((product, index) => {
                const productId = product._id || product.id;
                const isLoading = loadingProducts.has(productId);

                return (
                  <motion.div
                    key={`${productId}-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 6), duration: 0.5 }}
                    className="h-full min-w-[293px] mx-auto flex justify-center items-center"
                  >
                    <ProductCard
                      product={product}
                      onClick={() => handleProductSelect(product)}
                      onAddToCart={(productData) =>
                        handleAddToCart(productData)
                      }
                      isLoading={isLoading}
                    />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                className="bg-white rounded-2xl p-12 text-center shadow-md w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching your filters.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Bestseller;
