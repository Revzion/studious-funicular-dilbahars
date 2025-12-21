"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, X, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  likeProduct,
  unlikeProduct,
  fetchWishlist,
} from "@/redux/slice/wishlistSlice";

export default function WishlistModal({
  isOpen,
  onClose,
  product,
  selectedPackage,
  isFavorite = false,
  onSuccess,
  currentCollection = null,
}) {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchWishlist());

      if (isFavorite && currentCollection) {
        setSelectedCollection(currentCollection);
      } else {
        setSelectedCollection("");
      }
    }
  }, [isOpen, isFavorite, currentCollection, dispatch]);

  const handleCollectionSelect = async () => {
    if (!selectedPackage?._id || isLoading) return;

    setIsLoading(true);

    try {
      let collectionName = selectedCollection;

      if (!collectionName || collectionName === "") {
        collectionName = "Liked";
      }

      if (selectedCollection === "new" && newCollectionName.trim()) {
        collectionName = newCollectionName.trim();
      }

      if (isFavorite) {
        await dispatch(
          unlikeProduct({
            productId: selectedPackage._id,
            collectionName,
          })
        ).unwrap();
      } else {
        await dispatch(
          likeProduct({
            productId: selectedPackage._id,
            collectionName,
          })
        ).unwrap();
      }

      await dispatch(fetchWishlist());

      onSuccess?.({
        action: isFavorite ? "removed" : "added",
        collectionName,
        product,
        selectedPackage,
      });

      handleClose();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCollection("");
    setNewCollectionName("");
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {}, [selectedCollection]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 bg-opacity-60 flex items-center justify-center z-[1001] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">
                {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {isFavorite
                  ? `Currently in "${currentCollection || "Liked"}" collection`
                  : "Organize your favorites by collection"}
              </p>
            </div>
            <motion.button
              onClick={handleClose}
              className="text-blue-100 hover:text-white p-1 rounded-full hover:bg-blue-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          {/* Product Preview */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={selectedPackage?.image?.[0]?.url || ""}
                alt={product?.title}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {product?.title || "Product"}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {selectedPackage?.subtitle || "Standard Package"}
              </p>
              <p className="text-sm font-bold text-blue-600">
                ₹{selectedPackage?.saleingPrice}
              </p>
            </div>
          </div>

          {/* Collection Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Collection
              </label>

              {/* Default "Liked" Collection Option */}
              <motion.div
                className={`relative mb-3 cursor-pointer`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCollection("");
                }}
              >
                <div
                  className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                    selectedCollection === "" || selectedCollection === "Liked"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedCollection === "" ||
                      selectedCollection === "Liked"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {(selectedCollection === "" ||
                      selectedCollection === "Liked") && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Heart
                        size={16}
                        className="text-red-500 fill-red-500 mr-2"
                      />
                      <span className="font-medium text-gray-900">Liked</span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        Default
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your main favorites collection
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Existing Collections */}
              {wishlist?.collections
                ?.filter((col) => col.name !== "Liked")
                .map((collection, index) => (
                  <motion.div
                    key={`${collection.name}-${index}`}
                    className="relative mb-2 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedCollection(collection.name);
                    }}
                  >
                    <div
                      className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                        selectedCollection === collection.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedCollection === collection.name
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedCollection === collection.name && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {collection.name}
                        </span>
                        <p className="text-xs text-gray-500">
                          {collection.products?.length || 0} item
                          {collection.products?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

              {/* Create New Collection Option */}
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCollection("new");
                }}
              >
                <div
                  className={`flex items-center p-3 rounded-xl border-2 border-dashed transition-all ${
                    selectedCollection === "new"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedCollection === "new"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedCollection === "new" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <PlusCircle size={16} className="text-blue-500 mr-2" />
                      <span className="font-medium text-gray-700">
                        Create New Collection
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Start a new collection
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* New Collection Name Input */}
            {selectedCollection === "new" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Enter collection name (e.g., 'Health & Wellness')"
                    className="w-full p-3 text-gray-800 text-sm rounded-lg border border-blue-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-end gap-3">
            <motion.button
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleCollectionSelect}
              disabled={
                isLoading ||
                (selectedCollection === "new" && !newCollectionName.trim())
              }
              className={`px-6 py-2.5 text-white rounded-lg font-medium transition-all flex items-center ${
                isLoading ||
                (selectedCollection === "new" && !newCollectionName.trim())
                  ? "bg-gray-400 cursor-not-allowed"
                  : isFavorite
                  ? "bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-200"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-200"
              }`}
              whileHover={{
                scale:
                  isLoading ||
                  (selectedCollection === "new" && !newCollectionName.trim())
                    ? 1
                    : 1.05,
              }}
              whileTap={{
                scale:
                  isLoading ||
                  (selectedCollection === "new" && !newCollectionName.trim())
                    ? 1
                    : 0.95,
              }}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              )}
              {isFavorite ? (
                <>
                  <X size={16} className="mr-2" />
                  Remove from Wishlist
                </>
              ) : (
                <>
                  <Heart size={16} className="mr-2" />
                  Add to Wishlist
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
