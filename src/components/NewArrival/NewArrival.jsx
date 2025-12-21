import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../products/ProductCard";
import { motion } from "framer-motion";
import { getNewArrivalProducts } from "@/services/productServices";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { toast } from "../Toast/Toast";

function NewArrival() {
  const scrollRef = useRef(null);
  const [allActiveProducts, setAllActiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getNewArrivalProducts();
        // console.log("new", res); 
        const products = res.results || [];

        setAllActiveProducts(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        // toast.error(error.message || "Failed to fetch new arrivals");
        setError(error.message || "Failed to fetch new arrivals");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const showNotification = (product) => {};

  const handleProductSelect = (product) => {};

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -310, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 310, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="py-16 bg-[#EFFFFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">Loading new arrivals...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-[#EFFFFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#EFFFFA]">
      <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-9 mb-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
              New Arrivals
            </h2>
            <p className="text-teal-600 mt-2">
              Fresh picks from every category – discover what’s new and
              trending!
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Arrows */}
          {allActiveProducts.length > 0 && (
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
                <ChevronRight />
              </button>
            </div>
          )}

          {/* Product List */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 gap-4 snap-x custom-scrollbar scroll-smooth"
          >
            {allActiveProducts.length > 0 ? (
              allActiveProducts.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 6), duration: 0.5 }}
                  className="h-full min-w-[293px] mx-auto flex justify-center items-center flex-shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <motion.div
                    className="absolute top-[-20px] left-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg z-20"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.2 * index,
                      type: "spring",
                      stiffness: 500,
                      damping: 20,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    New
                  </motion.div>
                  <ProductCard
                    product={product}
                    onClick={() => handleProductSelect(product)}
                    onAddToCart={() => showNotification(product)}
                    reviews={product.reviews}
                  />
                </motion.div>
              ))
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

export default NewArrival;