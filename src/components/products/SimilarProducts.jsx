import { getAllActiveProducts } from "@/services/productServices";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { toast } from "../Toast/Toast";


const SimilarProducts = ({ category }) => {
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const res = await getAllActiveProducts();

        const filteredProducts = res.results.filter((product) => {
          if (!product.category || !category) return false;

          if (typeof category === "object" && category._id) {
            return product.category._id === category._id;
          }

          if (typeof category === "string") {
            return product.category.title === category;
          }

          return false;
        });

        setSimilarProducts(filteredProducts);
        
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    if (category) fetchSimilarProducts();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-14 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
            You May Also Like
          </h2>
          <p className="text-teal-600 mt-2">
            Handpicked recommendations based on your interests
          </p>
        </div>
      </div>
      <div className="flex overflow-x-auto pb-6 gap-4 snap-x custom-scrollbar scroll-smooth">
        {similarProducts.length > 0 ? (
          similarProducts.map((product, index) => (
            <motion.div
              key={product._id || product.id || index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index % 6), duration: 0.5 }}
              className="h-full min-w-[290px]"
            >
              <ProductCard
                product={product}
                onClick={() => handleProductSelect(product)}
                onAddToCart={() => showNotification(product)}
              />
            </motion.div>
          ))
        ) : (
          <p>No similar products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;

// import { getAllActiveProducts } from "@/services/productServices";
// import React, { useEffect, useState } from "react";
// import ProductCard from "./ProductCard";
// import { motion } from "framer-motion";

// const SimilarProducts = ({ category }) => {
//   const [similarProducts, setSimilarProducts] = useState([]);

//   useEffect(() => {
//     const fetchSimilarProducts = async () => {
//       try {
//         const res = await getAllActiveProducts();

//         const filteredProducts = res.results.filter((product) => {
//           if (!product.category || !category) return false;

//           if (typeof category === "object" && category._id) {
//             return product.category._id === category._id;
//           }

//           if (typeof category === "string") {
//             return product.category.title === category;
//           }

//           return false;
//         });

//         setSimilarProducts(filteredProducts);
//       } catch (error) {
//         console.error("Error fetching similar products:", error);
//       }
//     };

//     if (category) fetchSimilarProducts();
//   }, [category]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 mt-14 sm:px-6 lg:px-8 py-8">
//       <div className="flex justify-between items-center mb-10">
//         <div>
//           <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
//             You May Also Like
//           </h2>
//           <p className="text-teal-600 mt-2">
//             Handpicked recommendations based on your interests
//           </p>
//         </div>
//       </div>
//       <div className="flex overflow-x-auto pb-6 gap-4 snap-x custom-scrollbar scroll-smooth">
//         {similarProducts.length > 0 ? (
//           similarProducts.map((product, index) => (
//             <motion.div
//               key={product._id || product.id || index}
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 * (index % 6), duration: 0.5 }}
//               className="h-full w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] flex-shrink-0"
//             >
//               <ProductCard
//                 product={product}
//                 onClick={() => handleProductSelect(product)}
//                 onAddToCart={() => showNotification(product)}
//               />
//             </motion.div>
//           ))
//         ) : (
//           <p>No similar products found for this category.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SimilarProducts;
