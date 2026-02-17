"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  MinusCircle,
  PlusCircle,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  fetchCartItems,
  removeItemFromCart,
  updateItemQuantity,
} from "@/redux/thunks/cartThunks";
import { fetchWishlist } from "../../redux/slice/wishlistSlice";
import { selectUser } from "@/redux/slice/userSlice";
import WishlistModal from "./WishlistModel";
import { addGuestItem } from "@/redux/slice/cartSlice";

export default function ProductCard({ product, onClick, onAddToCart }) {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  const [showCount, setShowCount] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isQuantityLoading, setIsQuantityLoading] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cart = useSelector((state) => state.cart.items);
  const { guestItems } = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const wishlistLoading = useSelector((state) => state.wishlist.loading);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // console.log('product', product)
  const processedProduct = useMemo(() => {
    if (!product) return null;

    const validSubproducts =
      product?.subproduct?.filter(
        (sub) => sub && typeof sub === "object" && sub._id
      ) || [];

    const activeSubproducts = validSubproducts.filter(
      (sub) => sub.isActive !== false
    );

    const sortedByPrice = [...activeSubproducts].sort(
      (a, b) => a.saleingPrice - b.saleingPrice
    );

    const defaultSubproduct = sortedByPrice[0] ||
      validSubproducts[0] || {
        _id: "fallback",
        subtitle: "Standard Package",
        saleingPrice: 0,
        mrp: 0,
        discount: 0,
        image: [null],
      };

    return {
      ...product,
      subproduct: validSubproducts,
      activeSubproducts,
      defaultSubproduct,
      hasValidSubproducts: validSubproducts.length > 0,
      hasActiveSubproducts: activeSubproducts.length > 0,
    };
  }, [product]);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const hasFetchedWishlist = useRef(false);

  useEffect(() => {
    dispatch(fetchWishlist());
    dispatch(fetchCartItems());
  }, [dispatch]);

  // Set selected package when processed product is available
  useEffect(() => {
    if (processedProduct?.defaultSubproduct && !selectedPackage) {
      setSelectedPackage(processedProduct.defaultSubproduct);
    }
  }, [processedProduct, selectedPackage]);

  // Check if current product/package is in wishlist
  const isProductFavorite = useMemo(() => {
    if (!wishlist || !selectedPackage?._id) return false;

    // Handle both array and object structures for wishlist
    const collections = Array.isArray(wishlist)
      ? wishlist
      : wishlist.collections || [];

    if (!Array.isArray(collections)) return false;

    return collections.some((collection) => {
      if (!collection || !Array.isArray(collection.products)) return false;

      return collection.products.some((item) => {
        const productId = item.product_id?._id || item.product_id;
        return productId === selectedPackage._id;
      });
    });
  }, [selectedPackage?._id, wishlist]);

  useEffect(() => {
    setIsFavorite(isProductFavorite);
  }, [isProductFavorite]);

  useEffect(() => {
    // Force re-check when wishlist data changes
    if (wishlist && selectedPackage?._id) {
      const collections = Array.isArray(wishlist)
        ? wishlist
        : wishlist.collections || [];

      const found = collections.some((collection) => {
        if (!collection || !Array.isArray(collection.products)) return false;

        return collection.products.some((item) => {
          const productId = item.product_id?._id || item.product_id;
          return productId === selectedPackage._id;
        });
      });

      setIsFavorite(found);
    }
  }, [wishlist, selectedPackage?._id]);

  const isLoggedIn = !!user && user._id;

  // Update quantity based on cart state
  useEffect(() => {
    if (selectedPackage?._id) {
      if (isLoggedIn && cart && Array.isArray(cart)) {
        const cartItem = cart.find(
          (item) =>
            item.product_id === selectedPackage._id ||
            item.product_id?._id === selectedPackage._id ||
            item._id === selectedPackage._id
        );

        if (cartItem) {
          const newQuantity =
            cartItem.product_quantity || cartItem.quantity || 0;
          setQuantity(newQuantity);
          setShowCount(true);
          setCartItemId(cartItem.product_id || cartItem._id);
        } else {
          setQuantity(1);
          setShowCount(false);
          setCartItemId(null);
        }
      } else if (!isLoggedIn && guestItems && Array.isArray(guestItems)) {
        const guestCartItem = guestItems.find(
          (item) =>
            item.product_id === selectedPackage._id ||
            item.product_id?._id === selectedPackage._id ||
            item._id === selectedPackage._id
        );

        if (guestCartItem) {
          const newQuantity =
            guestCartItem.product_quantity || guestCartItem.quantity || 0;
          setQuantity(newQuantity);
          setShowCount(true);
          setCartItemId(guestCartItem.product_id || guestCartItem._id);
        } else {
          setQuantity(1);
          setShowCount(false);
          setCartItemId(null);
        }
      }
    }
  }, [cart, guestItems, selectedPackage?._id, isLoggedIn]);

  const handleAuthRedirect = () => {
    window.location.href = "/login?role=consumer";
  };

  // Memoize review stats calculation to avoid infinite loops
  const reviewStats = useMemo(() => {
    const reviews = product?.reviews || [];
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
    const validReviews = reviews.filter(
      (review) =>
        review && typeof review.rating === "number" && review.rating >= 0
    );

    if (validReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = validReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / validReviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: validReviews.length,
    };
  }, [product?.reviews]);

  const currentProductCollection = useMemo(() => {
    if (!wishlist || !selectedPackage?._id) return null;

    const collections = Array.isArray(wishlist)
      ? wishlist
      : wishlist.collections || [];

    if (!Array.isArray(collections)) return null;

    for (const collection of collections) {
      if (!collection || !Array.isArray(collection.products)) continue;

      const foundProduct = collection.products.find((item) => {
        const productId = item.product_id?._id || item.product_id;
        return productId === selectedPackage._id;
      });

      if (foundProduct) {
        return collection.name;
      }
    }
    return null;
  }, [selectedPackage?._id, wishlist]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!isLoggedIn) {
      handleAuthRedirect();
      return;
    }

    if (!selectedPackage?._id || isWishlistLoading) {
      // console.log("Cannot toggle wishlist:", {
      //   selectedPackageId: selectedPackage?._id,
      //   isWishlistLoading,
      // });
      return;
    }

    setShowWishlistModal(true);
  };

  const handleWishlistSuccess = (result) => {
    // console.log("Wishlist action completed:", result);
    // toast.success(`Product ${result.action} ${result.action === 'added' ? 'to' : 'from'} "${result.collectionName}" collection`);
  };

  const handlePackageChange = (e) => {
    const selected = processedProduct.activeSubproducts.find(
      (sub) => sub?._id === e.target.value
    );

    if (selected) {
      setSelectedPackage(selected);

      const cartItem = cart.find(
        (item) =>
          item.product_id === selected._id ||
          item.product_id?._id === selected._id ||
          item._id === selected._id
      );

      if (cartItem) {
        const currentQuantity =
          cartItem.product_quantity || cartItem.quantity || 0;
        setQuantity(currentQuantity);
        setShowCount(true);
        setCartItemId(cartItem.product_id || cartItem._id);
      } else {
        setQuantity(1);
        setShowCount(false);
        setCartItemId(null);
      }
    }
  };

  const handleAddToCart = async (e, newQuantity = 1) => {
    e.stopPropagation();
    e.preventDefault();

    if (!selectedPackage || selectedPackage.saleingPrice <= 0) {
      return;
    }

    try {
      setIsQuantityLoading(true);

      // Check if user is authenticated
      if (!isLoggedIn) {
        // console.log("selectedPackage", selectedPackage);
        // Add to guest cart with full product details including mrp and discount
        dispatch(
          addGuestItem({
            product_id: selectedPackage._id,
            product_quantity: newQuantity,
            productDetails: {
              image: selectedPackage.image,
              saleingPrice: selectedPackage.saleingPrice,
              sku: selectedPackage.sku || processedProduct.name,
              category: processedProduct.category,
              mrp: selectedPackage.mrp || 0, // Fallback to saleingPrice
              discount: selectedPackage.discount || 0, // Default to 0
              _id: selectedPackage._id,
            },
          })
        );

        onAddToCart?.({
          ...processedProduct,
          selectedPackage,
          quantity: newQuantity,
        });

        // console.log("Item added to guest cart with details");
        return;
      }

      // Logic for logged-in users (unchanged)
      await dispatch(
        addItemToCart({
          product_id: selectedPackage._id,
          product_quantity: newQuantity,
        })
      ).unwrap();

      await dispatch(fetchCartItems());

      onAddToCart?.({
        ...processedProduct,
        selectedPackage,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Add to Cart Error:", error);
    } finally {
      setIsQuantityLoading(false);
    }
  };

  const handleQuantityChange = async (newQuantity) => {
  setIsQuantityLoading(true);

  try {
    if (!isLoggedIn) {
      // 🔹 Guest User Logic
      if (newQuantity <= 0) {
        dispatch({
          type: "cart/removeGuestItem",
          payload: { product_id: selectedPackage._id },
        });
        setShowCount(false);
        setQuantity(1);
        return;
      }

      dispatch({
        type: "cart/updateGuestItemQuantity",
        payload: { product_id: selectedPackage._id, quantity: newQuantity },
      });

      setQuantity(newQuantity);
      return;
    }

    // 🔹 Authorized User Logic
    if (newQuantity <= 0) {
      await dispatch(removeItemFromCart(selectedPackage._id)).unwrap();
      setShowCount(false);
      setQuantity(1);
      return;
    }

    const action = newQuantity > (quantity || 0) ? "increment" : "decrement";
    await dispatch(
      updateItemQuantity({
        product_id: selectedPackage._id,
        action,
      })
    ).unwrap();

    await dispatch(fetchCartItems());
    setQuantity(newQuantity);

    onAddToCart?.({
      ...processedProduct,
      selectedPackage,
      quantity: newQuantity,
    });
  } catch (error) {
    console.error("Update Cart Quantity Error:", error);
  } finally {
    setIsQuantityLoading(false);
  }
};


  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={12}
        className={`${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const calculateDiscount = (mrp, salePrice) => {
    if (!mrp || !salePrice || mrp <= salePrice) return 0;
    return Math.round(((mrp - salePrice) / mrp) * 100);
  };

  if (!product || !processedProduct) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md animate-pulse">
        <div className="h-24 sm:h-32 md:h-40 bg-gray-200 rounded mb-2 sm:mb-3 md:mb-4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  const discountPercentage = selectedPackage
    ? selectedPackage.discount ||
      calculateDiscount(selectedPackage.mrp, selectedPackage.saleingPrice)
    : 0;

  const isProductAvailable =
    selectedPackage && selectedPackage.saleingPrice > 0;
  const hasIncompleteData =
    !processedProduct.hasActiveSubproducts || !product.title;

  const detailUrl = `/products/${product?.customUrl || "#"}?subproduct=${
    selectedPackage?._id || ""
  }`;

  return (
    <>
      <motion.div
        className="bg-white max-w-[250px] rounded-lg sm:rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col cursor-pointer"
        whileHover={{
          y: -4,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Product Image Section */}
        <Link href={detailUrl} className="block">
          <div className="relative overflow-hidden h-56 w-full">
            <motion.div
              className="w-full h-full flex justify-center items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={selectedPackage?.image?.[0]?.url || "null"}
                alt={product.title || "Product"}
                className="w-full h-full object-cover z-10"
                onError={(e) => {
                  e.target.src = "";
                }}
              />
            </motion.div>

            {/* ✅ Wishlist Button - permanently visible */}
            <motion.button
              className={`absolute top-3 right-3 p-1.5 rounded-full shadow-sm transition-all duration-200 z-20 ${
                isFavorite
                  ? "text-white shadow-md"
                  : "bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200"
              } ${isWishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              whileHover={{
                scale: isWishlistLoading ? 1 : 1.1,
                rotate: isWishlistLoading ? 0 : 10,
              }}
              whileTap={{ scale: isWishlistLoading ? 1 : 0.9 }}
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
            >
              <Heart
                size={20}
                className={`transition-all duration-200 ${
                  isFavorite
                    ? "fill-red-500 text-white"
                    : "fill-none text-gray-400 hover:text-red-500"
                } ${isWishlistLoading ? "animate-pulse" : ""}`}
              />
            </motion.button>
          </div>
        </Link>

        <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
          {/* Rating Section */}
          <div className="flex items-center mb-1 sm:mb-2">
            {reviewStats.totalReviews > 0 ? (
              <>
                <div className="flex items-center mr-1 sm:mr-2">
                  {renderStars(reviewStats.averageRating)}
                </div>
                <span className="text-gray-500 text-xs">
                  ({reviewStats.averageRating}) • {reviewStats.totalReviews}{" "}
                  review{reviewStats.totalReviews !== 1 ? "s" : ""}
                </span>
              </>
            ) : (
              <span className="text-gray-400 text-xs">No reviews yet</span>
            )}
          </div>

          {/* Product Title */}
          <Link href={detailUrl} className="block">
            <motion.h3
              className="text-sm sm:text-base font-bold text-blue-900 mb-1 sm:mb-2 line-clamp-1"
              whileHover={{ color: "#10B981" }}
            >
              {product.title || "Product Title Unavailable"}
            </motion.h3>
          </Link>

          {/* Product Description */}
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
            {product.metaDescription || "Product description not available"}
          </p>

          {/* Package Selector */}
          {processedProduct.hasActiveSubproducts ? (
            <div className="mb-2 sm:mb-3">
              <label className="block text-xs sm:text-sm font-semibold text-blue-900">
                Select Package:
              </label>
              {processedProduct.activeSubproducts.length > 1 ? (
                <select
                  id="packageSelect"
                  value={selectedPackage?._id || ""}
                  onChange={handlePackageChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full p-1.5 text-blue-800 text-xs sm:text-sm font-semibold rounded-md border border-blue-200 hover:border-blue-400 focus:outline-none bg-blue-50"
                >
                  {[...processedProduct.activeSubproducts]
                    .sort((a, b) => a.saleingPrice - b.saleingPrice)
                    .map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.subtitle || "Package"} - ₹
                        {sub.saleingPrice ?? "Price not available"}
                      </option>
                    ))}
                </select>
              ) : (
                <div className="w-full p-1.5 text-blue-800 text-xs sm:text-sm font-semibold rounded-md border-1 border-blue-200 bg-blue-50">
                  {processedProduct.activeSubproducts[0]?.subtitle ||
                    "Standard Package"}{" "}
                  - ₹
                  {processedProduct.activeSubproducts[0]?.saleingPrice ||
                    "Price not available"}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-2 sm:mb-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3 flex items-center">
                <AlertCircle
                  size={14}
                  className="text-gray-500 mr-1 sm:mr-2 flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4"
                />
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-700">
                    Package Information:
                  </div>
                  <div className="text-xs text-gray-600">
                    Package details not available
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center mb-0 mt-auto">
            {isProductAvailable ? (
              <>
                <span className="text-blue-900 text-base sm:text-lg font-bold">
                  ₹{selectedPackage.saleingPrice}
                </span>
                {selectedPackage.mrp &&
                selectedPackage.mrp > selectedPackage.saleingPrice ? (
                  <span className="text-gray-400 line-through text-xs ml-1 sm:ml-2">
                    ₹{selectedPackage.mrp}
                  </span>
                ) : selectedPackage.mrp === undefined ||
                  selectedPackage.mrp === null ? (
                  <span className="text-gray-400 text-xs ml-1 sm:ml-2 italic">
                    (Original price not available)
                  </span>
                ) : null}
                {discountPercentage > 0 && (
                  <motion.span
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full ml-1 sm:ml-2"
                    animate={{
                      rotate: [0, 3, 0, -3, 0],
                      scale: [1, 1.05, 1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  >
                    {discountPercentage}% OFF
                  </motion.span>
                )}
              </>
            ) : selectedPackage && selectedPackage.saleingPrice === 0 ? (
              <div className="flex items-center">
                <span className="text-orange-600 text-xs sm:text-sm font-semibold">
                  Price: Not available
                </span>
                <span className="text-gray-500 text-xs ml-2 italic"></span>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-gray-500 text-xs sm:text-sm">
                  Price not available
                </span>
                <AlertCircle
                  size={14}
                  className="text-gray-400 ml-1 w-3.5 h-3.5 sm:w-4 sm:h-4"
                />
              </div>
            )}
          </div>

          {/* Add to Cart / Quantity Selector or Unavailable Message */}
          {!isProductAvailable ? (
            <div className="w-full bg-gray-100 text-gray-500 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center border-2 border-dashed border-gray-300">
              <AlertCircle
                size={16}
                className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5"
              />
              <span>Currently Unavailable</span>
            </div>
          ) : showCount ? (
            <div
              className="w-full text-white py-1 pl-2 pr-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center"
              style={{ backgroundColor: "#349048" }}
            >
              <h3 className="text-white">Quantity :</h3>
              <div className="pl-1 sm:pl-2 flex items-center">
                <motion.button
                  whileHover={{ scale: isQuantityLoading ? 1 : 1.2 }}
                  whileTap={{ scale: isQuantityLoading ? 1 : 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!isQuantityLoading) {
                      handleQuantityChange(quantity - 1);
                    }
                  }}
                  disabled={isQuantityLoading}
                  className={`text-white ${
                    isQuantityLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <MinusCircle size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>

                <motion.div
                  className="mx-2 sm:mx-4 bg-white rounded-full w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold text-blue-900"
                  whileHover={{
                    rotate: isQuantityLoading ? [0] : [0, -5, 5, -5, 0],
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {quantity}
                </motion.div>

                <motion.button
                  whileHover={{ scale: isQuantityLoading ? 1 : 1.2 }}
                  whileTap={{ scale: isQuantityLoading ? 1 : 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!isQuantityLoading) {
                      handleQuantityChange(quantity + 1);
                    }
                  }}
                  disabled={isQuantityLoading}
                  className={`text-white ${
                    isQuantityLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <PlusCircle size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.button
              className={`w-full text-white py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center ${
                isQuantityLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              style={{ backgroundColor: "#349048" }}
              onClick={(e) => !isQuantityLoading && handleAddToCart(e, 1)}
              disabled={isQuantityLoading}
              whileHover={{
                scale: isQuantityLoading ? 1 : 1.03,
                boxShadow: isQuantityLoading
                  ? "none"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: isQuantityLoading ? 1 : 0.97 }}
            >
              {isQuantityLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={16}
                    className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Collection Selection Modal */}
      <WishlistModal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        product={product}
        selectedPackage={selectedPackage}
        isFavorite={isFavorite}
        currentCollection={currentProductCollection}
        onSuccess={handleWishlistSuccess}
      />
    </>
  );
}
