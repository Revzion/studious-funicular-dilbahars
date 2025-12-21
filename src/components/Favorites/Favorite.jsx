"use client";

import React, {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
  Heart,
  X,
  ShoppingCart,
  Trash2,
  Share2,
  Loader2,
  Minus,
  Plus,
  Send,
  Grid3X3,
  Package,
  PlusCircle,
} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {addItemToCart, updateItemQuantity} from "../../redux/thunks/cartThunks";
import {selectIsAuthenticated} from "../../redux/slice/userSlice";
import {
  fetchWishlist,
  likeProduct,
  unlikeProduct,
  deleteCollection,
} from "../../redux/slice/wishlistSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const {wishlist, loading, error} = useSelector((state) => state.wishlist);
  const cart = useSelector((state) => state.cart.items);
  const [showShareMenu, setShowShareMenu] = useState(null);
  const shareMenuRef = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [cartLoading, setCartLoading] = useState(new Set());
  const [clickedAddToCart, setClickedAddToCart] = useState(new Set());
  const [selectedCollection, setSelectedCollection] = useState("Liked");
  const [isRemoving, setIsRemoving] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  // Prepare wishlist data for display, organized by collections
  const wishlistData =
    wishlist?.collections?.map((collection) => ({
      name: collection.name,
      products: collection.products.map((product) => ({
        id: product.product_id?._id || "",
        name: product.product_id?.sku || "No title",
        price: product.product_id?.saleingPrice || 0,
        originalPrice: product.product_id?.mrp || 0,
        image: product.product_id?.image?.[0]?.url || "",
        rating: 0,
        inStock: product.product_id?.isActive !== false,
        discount: product.product_id?.discount || 0,
        favorite: true,
        isActive: product.product_id?.isActive !== false,
        collectionName: collection.name,
      })),
    })) || [];

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  // Set first collection as selected by default
  useEffect(() => {
    if (wishlistData.length > 0 && !selectedCollection) {
      setSelectedCollection(wishlistData[0].name);
    }
  }, [wishlistData, selectedCollection]);

  const selectAllItems = (collectionName) => {
    const collection = wishlistData.find((col) => col.name === collectionName);
    if (!collection) return;

    const allSelected = collection.products.every((item) =>
      selectedItems.includes(item.id)
    );

    if (allSelected) {
      setSelectedItems((prev) =>
        prev.filter((id) => !collection.products.some((item) => item.id === id))
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        ...collection.products
          .filter((item) => !prev.includes(item.id))
          .map((item) => item.id),
      ]);
    }
  };

  const removeFromWishlist = async (productId, collectionName) => {
    try {
      console.log("productId", productId);
      setRemovingItems((prev) => new Set(prev).add(productId));
      setIsRemoving(true);
      await dispatch(unlikeProduct({productId, collectionName})).unwrap();
      await dispatch(fetchWishlist()).unwrap();
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      setIsRemoving(false);
    }
  };

  const handleDeleteCollection = async (collectionName) => {
    try {
      setIsRemoving(true);
      await dispatch(deleteCollection(collectionName)).unwrap();
      await dispatch(fetchWishlist()).unwrap();
      setSelectedItems((prev) =>
        prev.filter(
          (id) =>
            !wishlistData
              .find((col) => col.name === collectionName)
              ?.products.some((item) => item.id === id)
        )
      );
      if (selectedCollection === collectionName) {
        const remainingCollections = wishlistData.filter(
          (col) => col.name !== collectionName
        );
        setSelectedCollection(
          remainingCollections.length > 0 ? remainingCollections[0].name : null
        );
      }
    } catch (err) {
      console.error("Error deleting collection:", err);
    } finally {
      setIsRemoving(false);
    }
  };

  const createNewCollection = async () => {
    if (!newCollectionName.trim()) {
      alert("Please enter a collection name");
      return;
    }
    try {
      setIsCreatingCollection(true);
      await dispatch(likeProduct({collectionName: newCollectionName})).unwrap();
      await dispatch(fetchWishlist()).unwrap();
      setSelectedCollection(newCollectionName);
      setNewCollectionName("");
    } catch (err) {
      console.error("Error creating collection:", err);
      alert(err.message || "Failed to create collection. Please try again.");
    } finally {
      setIsCreatingCollection(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowShareMenu]);

  const shareProduct = (item) => {
    setShowShareMenu(showShareMenu === item.id ? null : item.id);
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this product: ${product.title}`);
    window.open(
      `https://api.whatsapp.com/send?text=${text}%20${url}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const shareToInstagram = () => {
    window.open("https://www.instagram.com/", "_blank");
    setShowShareMenu(false);
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent(product.title);
    const body = encodeURIComponent(
      `Check out this product: ${window.location.href}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_BASE_URL || "https://your-app.com";
  };

  const getItemQuantity = (productId) => {
    const cartItem = cart.find((item) => item.product_id === productId);
    return cartItem ? cartItem.product_quantity : 0;
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const removeSelectedItems = async (collectionName) => {
    try {
      setIsRemoving(true);
      const collection = wishlistData.find(
        (col) => col.name === collectionName
      );
      if (!collection) return;

      const itemsToRemove = selectedItems.filter((id) =>
        collection.products.some((item) => item.id === id)
      );
      console.log("itemsToRemove", itemsToRemove);

      await Promise.all(
        itemsToRemove.map((id) =>
          dispatch(unlikeProduct({productId: id, collectionName})).unwrap()
        )
      );
      await dispatch(fetchWishlist()).unwrap();
      setSelectedItems((prev) =>
        prev.filter((id) => !itemsToRemove.includes(id))
      );
    } catch (err) {
      console.error("Error removing selected items:", err);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleUpdateQuantity = async (productId, action) => {
    try {
      setCartLoading((prev) => new Set(prev).add(productId));
      const currentQuantity = getItemQuantity(productId);

      if (!isAuthenticated) {
        // Handle guest cart update
        dispatch(
          addGuestItem({
            product_id: productId,
            product_quantity: action === "increment" ? 1 : -1,
            productDetails: {
              image: selectedPackage.image,
              saleingPrice: selectedPackage.saleingPrice,
              sku: selectedPackage.sku || processedProduct.name,
              category: processedProduct.category,
              _id: productId,
            },
          })
        );

        if (action === "decrement" && currentQuantity <= 1) {
          setClickedAddToCart((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        }
        return;
      }

      // Original logic for logged-in users
      await dispatch(
        updateItemQuantity({product_id: productId, action})
      ).unwrap();
      if (action === "decrement" && currentQuantity <= 1) {
        setClickedAddToCart((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setCartLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const addToCart = async (item) => {
    try {
      setCartLoading((prev) => new Set(prev).add(item.id));

      if (!isAuthenticated) {
        // Add to guest cart
        dispatch(
          addGuestItem({
            product_id: item.id,
            product_quantity: 1,
            productDetails: {
              image: item.image,
              saleingPrice: item.saleingPrice,
              sku: item.sku || item.name,
              category: item.category,
              _id: item.id,
            },
          })
        );

        setClickedAddToCart((prev) => new Set(prev).add(item.id));
        return;
      }

      // Original logic for logged-in users
      const cartData = {
        product_id: item.id,
        product_quantity: 1,
      };
      await dispatch(addItemToCart(cartData)).unwrap();
      setClickedAddToCart((prev) => new Set(prev).add(item.id));
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setCartLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const handleRetry = () => {
    dispatch(fetchWishlist());
  };

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {staggerChildren: 0.1},
    },
  };

  const itemVariants = {
    hidden: {x: -50, opacity: 0},
    visible: {
      x: 0,
      opacity: 1,
      transition: {type: "spring", stiffness: 300, damping: 30},
    },
    exit: {x: 300, opacity: 0, transition: {duration: 0.3}},
  };

  if (loading || isRemoving) {
    return (
      <div className="min-h-screen bg-green-50 py-8 px-4 pt-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex my-20">
            <div className="text-center mx-auto">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
              <p className="text-teal-600 font-medium">
                {isRemoving
                  ? "Updating your wishlist..."
                  : "Loading your wishlist..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-green-50 py-8 px-4 pt-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="relative bg-gradient-to-br from-cyan-50 via-white to-cyan-50 border border-cyan-200/50 rounded-2xl p-6 sm:p-10 max-w-md mx-auto shadow-xl backdrop-blur-sm">
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full opacity-30"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full opacity-20"></div>
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full p-4 shadow-lg">
                    <svg
                      className="w-8 h-8 text-cyan-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                </div>
              </div>
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                    Welcome Back
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Sign in to access your personalized wishlist and save your
                    favorite items.
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="w-full relative group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-200"
                  style={{
                    background:
                      "linear-gradient(to right, #cffafe 0%, #ffffff 50%, #cffafe 100%)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-white to-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-3 text-cyan-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-semibold text-cyan-800 group-hover:text-cyan-900 transition-colors text-sm sm:text-base">
                      Sign In to Continue
                    </span>
                  </div>
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cyan-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-r from-cyan-50 to-white text-gray-500">
                      or
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-50 to-white rounded-lg p-4 border border-cyan-100">
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    Don't have an account yet?
                  </p>
                  <button
                    onClick={() => {
                      window.location.href = "/signup";
                    }}
                    className="text-cyan-600 hover:text-cyan-700 font-semibold text-xs sm:text-sm hover:underline transition-all duration-200 flex items-center justify-center mx-auto"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create New Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // if (error && isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-green-50 py-8 px-4 pt-48">
  //       <div className="max-w-6xl mx-auto">
  //         <div className="text-center py-16">
  //           <p className="text-red-600 font-medium">
  //             Error: {error.message || "Failed to load wishlist"}
  //           </p>
  //           <button
  //             onClick={handleRetry}
  //             className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
  //           >
  //             Try Again
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  const totalItems = wishlistData.reduce(
    (sum, col) => sum + col.products.length,
    0
  );

  const currentCollection = wishlistData.find(
    (col) => col.name === selectedCollection
  );

  return (
    <div className="min-h-screen bg-green-50 py-4 sm:py-8 px-4 pt-10 sm:pt-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{y: -20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-900 flex items-center gap-2 md:gap-3">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 fill-current" />
                My Wishlist
              </h1>
              <p className="text-teal-600 mt-2 font-medium text-xs sm:text-sm md:text-base">
                {totalItems} {totalItems === 1 ? "item" : "items"} in{" "}
                {wishlistData.length} collection
                {wishlistData.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </motion.div>

        {wishlistData.length === 0 ? (
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="text-center py-12 md:py-16"
          >
            <Heart className="w-12 h-12 md:w-16 md:h-16 text-teal-300 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-indigo-900 mb-2">
              Your wishlist is empty
            </h3>
            <p
              className="text-teal-600 text-sm md:text-base"
              onClick={() => (window.location.href = "/products")}
            >
              Start adding items you love to see them here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <Grid3X3 className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-indigo-900">
                  Collections
                </h2>
                <span className="text-xs sm:text-sm text-teal-600 bg-teal-50 px-2 py-1 rounded-full font-medium">
                  {wishlistData.length}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="New collection name"
                    className="p-2 rounded-lg border-2 border-gray-200 bg-white text-gray-800 text-sm w-full max-w-xs"
                    disabled={isCreatingCollection}
                  />
                  <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={createNewCollection}
                    disabled={isCreatingCollection}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 font-medium text-sm"
                  >
                    {isCreatingCollection ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PlusCircle className="w-4 h-4" />
                    )}
                    Create
                  </motion.button>
                </div>
              </div>

              <>
                <div className="block sm:hidden mb-4">
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 bg-white text-gray-800"
                  >
                    {wishlistData.map((collection) => (
                      <option key={collection.name} value={collection.name}>
                        {collection.name} ({collection.products.length}{" "}
                        {collection.products.length === 1 ? "item" : "items"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {[...wishlistData]
                    .sort((a, b) =>
                      a.name === "Liked" ? -1 : b.name === "Liked" ? 1 : 0
                    )
                    .map((collection) => (
                      <motion.button
                        key={collection.name}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        onClick={() => setSelectedCollection(collection.name)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          selectedCollection === collection.name
                            ? "border-teal-500 bg-teal-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25"
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              selectedCollection === collection.name
                                ? "bg-teal-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold text-sm sm:text-base truncate ${
                                selectedCollection === collection.name
                                  ? "text-teal-900"
                                  : "text-gray-800"
                              }`}
                            >
                              {collection.name}
                            </h3>
                            <p
                              className={`text-xs sm:text-sm ${
                                selectedCollection === collection.name
                                  ? "text-teal-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {collection.products.length}{" "}
                              {collection.products.length === 1
                                ? "item"
                                : "items"}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                </div>
              </>
            </motion.div>

            {currentCollection && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-indigo-900 mb-2">
                      {currentCollection.name}
                    </h2>
                    <p className="text-sm sm:text-base text-teal-600">
                      {currentCollection.products.length}{" "}
                      {currentCollection.products.length === 1
                        ? "item"
                        : "items"}{" "}
                      in this collection
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentCollection.products.length > 0 && (
                      <button
                        onClick={() => selectAllItems(currentCollection.name)}
                        className="px-3 py-2 border border-teal-300 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium text-xs sm:text-sm"
                      >
                        {currentCollection.products.every((item) =>
                          selectedItems.includes(item.id)
                        )
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    )}
                    {currentCollection.products.length === 0 && (
                      <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => (window.location.href = "/products")}
                        className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-xs sm:text-sm"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Products
                      </motion.button>
                    )}
                    <button
                      onClick={() =>
                        handleDeleteCollection(currentCollection.name)
                      }
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-medium text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">
                        Delete Collection
                      </span>
                      <span className="sm:hidden">Delete</span>
                    </button>
                    {currentCollection.products.length > 0 &&
                      selectedItems.some((id) =>
                        currentCollection.products.some(
                          (item) => item.id === id
                        )
                      ) && (
                        <motion.button
                          initial={{scale: 0}}
                          animate={{scale: 1}}
                          onClick={() =>
                            removeSelectedItems(currentCollection.name)
                          }
                          className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 font-medium text-xs sm:text-sm"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">
                            Remove Selected
                          </span>
                          {/* <span className="sm:hidden">Remove</span> */}
                        </motion.button>
                      )}
                  </div>
                </div>

                <AnimatePresence>
                  {currentCollection.products.map((item) => {
                    const discountPercent =
                      item.discount > 0
                        ? item.discount
                        : calculateDiscount(item.originalPrice, item.price);
                    const isRemoving = removingItems.has(item.id);

                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        exit="exit"
                        layout
                        className="bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 group mb-4"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="flex sm:items-center justify-start sm:justify-center w-full sm:w-12 p-2 sm:p-0 bg-teal-50 order-1 sm:order-none">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleSelectItem(item.id)}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 rounded focus:ring-teal-500"
                              disabled={isRemoving}
                            />
                            <span className="ml-2 sm:hidden text-xs sm:text-sm text-teal-600 font-medium">
                              Select item
                            </span>
                          </div>

                          <div className="relative w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-20 md:h-24 lg:h-28 flex-shrink-0 order-2 sm:order-none my-4 px-4 sm:px-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = "";
                              }}
                            />
                            {!item.isActive && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-indigo-900 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                                  Inactive
                                </span>
                              </div>
                            )}
                            {isRemoving && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 p-3 sm:p-4 order-3 sm:order-none">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2 lg:mb-0">
                                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-indigo-900 pr-2 lg:pr-0 lg:mb-2 line-clamp-2">
                                    {item.name}
                                  </h3>
                                  <motion.button
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                    onClick={() =>
                                      removeFromWishlist(
                                        item.id,
                                        currentCollection.name
                                      )
                                    }
                                    disabled={isRemoving}
                                    className="p-1 sm:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex-shrink-0 lg:hidden"
                                  >
                                    {isRemoving ? (
                                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    ) : (
                                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                  </motion.button>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <span className="text-base sm:text-lg md:text-xl font-bold text-indigo-900">
                                        ₹{item.price?.toLocaleString() || 0}
                                      </span>
                                      {item.originalPrice > item.price && (
                                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                                          ₹
                                          {item.originalPrice?.toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                    {discountPercent > 0 && (
                                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                                        {discountPercent}% OFF
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                                    <motion.button
                                      whileHover={{scale: 1.05}}
                                      whileTap={{scale: 0.95}}
                                      onClick={() => shareProduct(item)}
                                      className="p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-full transition-colors relative"
                                    >
                                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                      <AnimatePresence>
                                        {showShareMenu === item.id && (
                                          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl z-20 p-2 flex gap-2">
                                            <button
                                              onClick={shareToWhatsApp}
                                              className="flex flex-col items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                            >
                                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="white"
                                                >
                                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.297" />
                                                </svg>
                                              </div>
                                              <span className="mt-1 text-xs">
                                                WhatsApp
                                              </span>
                                            </button>

                                            <button
                                              onClick={shareToInstagram}
                                              className="flex flex-col items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                            >
                                              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center">
                                                <svg
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="white"
                                                >
                                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                </svg>
                                              </div>
                                              <span className="mt-1 text-xs">
                                                Instagram
                                              </span>
                                            </button>

                                            <button
                                              onClick={shareToFacebook}
                                              className="flex flex-col items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                            >
                                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                <svg
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="white"
                                                >
                                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                              </div>
                                              <span className="mt-1 text-xs">
                                                Facebook
                                              </span>
                                            </button>

                                            <button
                                              onClick={shareToEmail}
                                              className="flex flex-col items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                                            >
                                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                                <svg
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="white"
                                                >
                                                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z" />
                                                </svg>
                                              </div>
                                              <span className="mt-1 text-xs">
                                                Email
                                              </span>
                                            </button>
                                          </div>
                                        )}
                                      </AnimatePresence>
                                    </motion.button>

                                    <motion.button
                                      whileHover={{scale: 1.1}}
                                      whileTap={{scale: 0.9}}
                                      onClick={() =>
                                        removeFromWishlist(
                                          item.id,
                                          currentCollection.name
                                        )
                                      }
                                      disabled={isRemoving}
                                      className="hidden lg:flex p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                      {isRemoving ? (
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                      ) : (
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                      )}
                                    </motion.button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-3 lg:mt-0 lg:ml-4">
                                {item.isActive ? (
                                  <>
                                    {getItemQuantity(item.id) > 0 &&
                                    clickedAddToCart.has(item.id) ? (
                                      <div className="flex items-center gap-2 bg-teal-50 rounded-lg p-1">
                                        <motion.button
                                          whileHover={{scale: 1.1}}
                                          whileTap={{scale: 0.9}}
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item.id,
                                              "decrement"
                                            )
                                          }
                                          disabled={cartLoading.has(item.id)}
                                          className="p-1 sm:p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50"
                                        >
                                          {cartLoading.has(item.id) ? (
                                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                          ) : (
                                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                          )}
                                        </motion.button>
                                        <span className="px-2 sm:px-3 py-1 bg-white rounded-md text-sm sm:text-base font-semibold text-teal-900 min-w-[2rem] text-center">
                                          {getItemQuantity(item.id)}
                                        </span>
                                        <motion.button
                                          whileHover={{scale: 1.1}}
                                          whileTap={{scale: 0.9}}
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item.id,
                                              "increment"
                                            )
                                          }
                                          disabled={cartLoading.has(item.id)}
                                          className="p-1 sm:p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50"
                                        >
                                          {cartLoading.has(item.id) ? (
                                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                          ) : (
                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                          )}
                                        </motion.button>
                                      </div>
                                    ) : (
                                      <motion.button
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                        onClick={() => addToCart(item)}
                                        disabled={cartLoading.has(item.id)}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 font-medium text-sm sm:text-base w-full sm:w-auto justify-center"
                                      >
                                        {cartLoading.has(item.id) ? (
                                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        ) : (
                                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                        <span className="whitespace-nowrap">
                                          {cartLoading.has(item.id)
                                            ? "Adding..."
                                            : "Add to Cart"}
                                        </span>
                                      </motion.button>
                                    )}
                                  </>
                                ) : (
                                  <div className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm sm:text-base font-medium text-center">
                                    Out of Stock
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
