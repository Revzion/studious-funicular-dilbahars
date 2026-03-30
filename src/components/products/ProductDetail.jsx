"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Star,
  ChevronLeft,
  ShoppingCart,
  Sparkles,
  MessageCircle,
  Leaf,
  Gift,
  Medal,
  Loader2,
  MinusCircle,
  PlusCircle,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  Facebook,
  Instagram,
  Mail,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import WhyChooseUs from "./WhyChooseUs";
import ProductFAQ from "./ProductFAQ";
import { getProductByCustomUrl } from "../../services/productServices";
import { evaluateCoupons } from "../../services/couponServices";
import { getCategoriesService } from "../../services/categoryServices";
import { addReviewService } from "../../services/reviewServices";
import BoughtTogether from "./BoughtTogehter";
import {
  addItemToCart,
  fetchCartItems,
  updateItemQuantity,
} from "@/redux/thunks/cartThunks";
import SimilarProducts from "./SimilarProducts";
import WishlistModal from "./WishlistModel";
import { fetchWishlist, unlikeProduct } from "../../redux/slice/wishlistSlice";
import { toast } from "../Toast/Toast";
import { getMyOrdersService } from "@/services/orderServices";
import Cart from "../Cart/Cart";
import { addGuestItem } from "@/redux/slice/cartSlice";
import { selectIsAuthenticated } from "@/redux/slice/userSlice";

export default function ProductDetail() {
  const router = useRouter();
  const { id: productId } = useParams();
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cart = useSelector((state) => state.cart);
  const { items, guestItems } = useSelector((state) => state.cart);
  const [product, setProduct] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review_message: "",
    images: [],
  });
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartLoading, setCartLoading] = useState(new Set());
  const [packageQuantities, setPackageQuantities] = useState({});
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [showSKU, setShowSKU] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);
  const detailsRef = useRef(null);
  const shareMenuRef = useRef(null);
  const hasFetchedFavorites = useRef(false);
  const dispatch = useDispatch();
  const wishlist = useSelector(
    (state) => state.wishlist.wishlist?.collections || []
  );
  const wishlistLoading = useSelector((state) => state.wishlist.loading);
  const searchParams = useSearchParams();
  const subproductId = searchParams.get("subproduct");

  const descriptionRef = useRef(null);

  const parseName = (nameString) => {
    try {
      const nameObj = JSON.parse(nameString);
      return `${nameObj} ${nameObj}`;
    } catch (e) {
      return nameString;
    }
  };
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  useEffect(() => {
    if (productId) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, productId]);

  const getCartItemCount = () => {
    const source = isAuthenticated ? items : guestItems;

    if (!Array.isArray(source)) return 0;

    return source.reduce(
      (total, item) => total + (item.product_quantity || 0),
      0
    );
  };

  useEffect(() => {
    if (selectedPackage?._id && Array.isArray(wishlist)) {
      const isProductInWishlist = wishlist.some(
        (collection) =>
          Array.isArray(collection.products) &&
          collection.products.some(
            (item) => item.product_id?._id === selectedPackage._id
          )
      );
      setIsFavorite(isProductInWishlist);
    } else {
      setIsFavorite(false);
    }
  }, [selectedPackage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productResponse, categoriesResponse] = await Promise.all([
          getProductByCustomUrl(productId),
          getCategoriesService(),
        ]);

        console.log("Product response:", productResponse);

        const productData = productResponse.data || productResponse;

        const product = productResponse.product || {};

        let processedProduct;
        if (productData.sku && productData.saleingPrice) {
          processedProduct = {
            _id: productData?._id,
            title: productData?.product?.title,
            sku: productData.sku,
            keywords: productData.keywords || [],
            category: productData?.product?.category?.title || null,
            description: productData.description || "",
            isActive: productData.isActive,
            isDeleted: productData.isDeleted || false,
            createdAt: productData.createdAt,
            updatedAt: productData.updatedAt,
            ingridiant: productData.ingridiant || "",
            bestSaling: productData.bestSaling || false,
            highlights: productData.highlights || false,
            orderCount: productData.orderCount || 0,
            subproduct: [
              {
                _id: productData._id,
                subtitle: productData.subtitle,
                sku: productData.sku,
                mrp: productData.mrp,
                saleingPrice: productData.saleingPrice,
                discount: productData.discount,
                image: productData.image || [],
                keywords: productData.keywords || [],
                isActive: productData.isActive,
                orderCount: productData.orderCount || 0,
                bestSaling: productData.bestSaling || false,
                highlights: productData.highlights || false,
              },
            ],
            averageRating:
              product.reviews?.length > 0
                ? product.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / product.reviews.length
                : 0,
            totalReviews: product.reviews?.length || 0,
            faq: productData?.product?.faq || [],
            reviews: product.reviews || [],
          };
        } else {
          if (
            productData.isActive === false ||
            productData.isDeleted === true
          ) {
            throw new Error("Product is inactive or deleted");
          }

          const activeSubproducts =
            productData?.product?.subproduct?.filter(
              (sub) => sub.isActive !== false
            ) || [];
          if (activeSubproducts.length === 0) {
            throw new Error("No active subproducts available");
          }

          processedProduct = {
            ...productData,
            subproduct: activeSubproducts,
            keywords:
              activeSubproducts[0]?.keywords || productData.keywords || [],
            description: productData?.product?.description || "null",
            averageRating:
              product.reviews?.length > 0
                ? product.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / product.reviews.length
                : 0,
            totalReviews: product.reviews?.length || 0,
            title: productData?.product?.title || "Untitled Product",
            category: productData?.product?.category?.title || null,
            ingridiant: productData?.product?.ingridiant || "",
            bestSaling: productData?.product?.bestSaling || false,
            reviews: product.reviews || [],
            faq: productData?.product?.faq || [],
          };
        }

        setProduct(processedProduct);
        setReviews(processedProduct.reviews || []);

        const firstSubproduct = processedProduct.subproduct[0];
        const initialPackage =
          processedProduct.subproduct.find((sub) => sub._id === subproductId) ||
          firstSubproduct;
        setSelectedPackage(initialPackage);
        const firstImage = initialPackage?.image?.[0]?.url;
        if (firstImage) {
          setMainImage(firstImage);
        }
        const categoriesData =
          categoriesResponse.data?.categories ||
          categoriesResponse?.categories ||
          categoriesResponse ||
          [];
        const activeCategories = categoriesData.filter(
          (cat) => cat.isActive !== false
        );
        const categoryIdToTitle = activeCategories.reduce((map, cat) => {
          map[cat._id] = cat.title;
          return map;
        }, {});
        setCategories(activeCategories);
        setCategoryMap(categoryIdToTitle);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch product details");
        // toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!user || !selectedPackage?._id) {
        setCanReview(false);
        return;
      }

      try {
        const ordersResponse = await getMyOrdersService(0);
        const orders = (ordersResponse.orders || []).filter((order) =>
          [
            "Delivered",
            "Return Requested",
            "Exchange Requested",
            "Returned",
            "Exchange",
            "reject",
          ].includes(order.orderStatus)
        );
        // console.log("first", orders);

        // const orders = ordersResponse.orders || [];
        const hasOrdered = orders.some((order) =>
          order.items.some(
            (item) => item.productId?._id === selectedPackage._id
          )
        );
        setCanReview(hasOrdered);
      } catch (err) {
        console.error("Error checking review eligibility:", err);
        setCanReview(false);
      }
    };

    checkReviewEligibility();
  }, [user, selectedPackage]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (selectedPackage?._id) {
          const items = [{ subProductId: selectedPackage._id, quantity: 1 }];
          const response = await evaluateCoupons(items);
          // console.log("evaluateCoupons", response);
          const activeCoupons = response.coupons.filter(
            (result) => result?.coupon?.isActive
          );
          setCoupons(activeCoupons);
        } else {
          setCoupons([]);
        }
      } catch (err) {
        console.error("Error evaluating coupons:", err);
        setCoupons([]);
      }
    };

    fetchCoupons();
  }, [selectedPackage]);

  useEffect(() => {
    const handleWheel = (event) => {
      const detailsElement = detailsRef.current;
      if (!detailsElement) return;

      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;

      const isAtBottom =
        detailsElement.scrollHeight - detailsElement.scrollTop <=
        detailsElement.clientHeight + 1;
      const isAtTop = detailsElement.scrollTop === 0;

      if (isScrollingDown && !isAtBottom) {
        event.preventDefault();
        detailsElement.scrollTop += event.deltaY;
      } else if (isScrollingUp && !isAtTop) {
        event.preventDefault();
        detailsElement.scrollTop += event.deltaY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (
      cart?.items?.length > 0 ||
      (guestItems?.length > 0 && product?.subproduct)
    ) {
      const quantities = {};
      let hasAnyInCart = false;

      product?.subproduct.forEach((pkg) => {
        let cartItem;
        if (user) {
          // For authenticated users, check cart.items
          cartItem = cart.items.find(
            (item) =>
              (typeof item.product_id === "string"
                ? item.product_id
                : item.product_id?._id) === pkg._id
          );
        } else {
          // For unauthenticated users, check guestItems
          cartItem = guestItems.find(
            (item) =>
              (typeof item.product_id === "string"
                ? item.product_id
                : item.product_id) === pkg._id
          );
        }

        if (cartItem) {
          quantities[pkg._id] = cartItem.product_quantity;
          hasAnyInCart = true;
        } else {
          quantities[pkg._id] = 0;
        }
      });

      setPackageQuantities(quantities);

      if (selectedPackage) {
        const currentQuantity = quantities[selectedPackage._id] || 0;
        setQuantity(currentQuantity > 0 ? currentQuantity : 1);
        setIsInCart(currentQuantity > 0);
      }
    } else if (selectedPackage) {
      setPackageQuantities((prev) => ({
        ...prev,
        [selectedPackage._id]: 0,
      }));
      setQuantity(1);
      setIsInCart(false);
    }
  }, [cart?.items, guestItems, product?.subproduct, selectedPackage, user]);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxHeight = lineHeight * 4;
      setIsDescriptionLong(descriptionRef.current.scrollHeight > maxHeight);
    }
  }, [product?.description]);


  const handleAddToCart = useCallback(async () => {
    if (!selectedPackage?._id) {
      setError("No valid product selected");
      console.error("No selected package ID");
      return;
    }

    try {
      if (!user) {
        // console.log("first", selectedPackage);
        // Add to guest cart
        dispatch(
          addGuestItem({
            product_id: selectedPackage._id,
            product_quantity: quantity,
            productDetails: {
              image: selectedPackage.image,
              saleingPrice: selectedPackage.saleingPrice,
              sku: selectedPackage.sku,
              mrp: selectedPackage.mrp || 0, // Fallback to saleingPrice
              discount: selectedPackage.discount || 0, // Default to 0
              // category: processedProduct.category,
              _id: selectedPackage._id,
            },
          })
        );

        const newQuantities = { ...packageQuantities };
        newQuantities[selectedPackage._id] = quantity;
        setPackageQuantities(newQuantities);
        setQuantity(quantity);
        setIsInCart(true);
        setShowAddedNotification(true);
        setTimeout(() => setShowAddedNotification(false), 3000);
        toast.success("Product added to guest cart!");
        return;
      }

      // Original logic for logged-in users
      // console.log("Adding to cart:", {
      //   product_id: selectedPackage._id,
      //   product_quantity: quantity,
      // });

      const cartData = {
        product_id: selectedPackage._id,
        product_quantity: quantity,
      };

      const addResponse = await dispatch(addItemToCart(cartData)).unwrap();
      // console.log("addItemToCart response:", addResponse);

      const response = await dispatch(fetchCartItems()).unwrap();
      // console.log("fetchCartItems response:", response);

      const newQuantities = { ...packageQuantities };
      const cartItem = response.find(
        (item) =>
          (typeof item.product_id === "string"
            ? item.product_id
            : item.product_id?._id) === selectedPackage._id
      );

      if (cartItem) {
        newQuantities[selectedPackage._id] = cartItem.product_quantity;
        setQuantity(cartItem.product_quantity);
        setIsInCart(true);
        setShowAddedNotification(true);
        setTimeout(() => setShowAddedNotification(false), 3000);
        toast.success("Product added to cart!");
      } else {
        newQuantities[selectedPackage._id] = 0;
        setQuantity(1);
        setIsInCart(false);
        console.error(
          "Product not found in cart after adding:",
          selectedPackage._id
        );
        setError("Product was not added to cart");
      }

      setPackageQuantities(newQuantities);
    } catch (err) {
      console.error("Error in handleAddToCart:", err);
      setError(err.message || "Failed to add item to cart");
    }
  }, [dispatch, selectedPackage, quantity, packageQuantities, user]);

  const handleUpdateQuantity = async (action) => {
  if (!selectedPackage?._id) {
    setError("No subproduct selected");
    return;
  }

  try {
    setCartLoading((prev) => new Set(prev).add(selectedPackage?._id));

    if (!user) {
      // 🔹 Guest cart logic
      const currentQuantity = packageQuantities[selectedPackage._id] || 0;
      const quantityChange = action === "increment" ? 1 : -1;
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity <= 0) {
        // Remove item from guest cart
        dispatch({
          type: "cart/removeGuestItem",
          payload: { product_id: selectedPackage._id },
        });

        const newQuantities = { ...packageQuantities };
        newQuantities[selectedPackage._id] = 0;
        setPackageQuantities(newQuantities);
        setQuantity(1);
        setIsInCart(false);
        return;
      }

      // Update guest cart quantity
      dispatch({
        type: "cart/updateGuestItemQuantity",
        payload: { product_id: selectedPackage._id, quantity: newQuantity },
      });

      const newQuantities = { ...packageQuantities };
      newQuantities[selectedPackage._id] = newQuantity;
      setPackageQuantities(newQuantities);
      setQuantity(newQuantity);
      setIsInCart(true);
      return;
    }

    // 🔹 Logged-in user logic
    await dispatch(
      updateItemQuantity({
        product_id: selectedPackage._id,
        action,
      })
    ).unwrap();

    const response = await dispatch(fetchCartItems()).unwrap();

    const newQuantities = { ...packageQuantities };
    const cartItem = response.find(
      (item) =>
        (typeof item.product_id === "string"
          ? item.product_id
          : item.product_id?._id) === selectedPackage._id
    );

    if (cartItem) {
      newQuantities[selectedPackage._id] = cartItem.product_quantity;
      setQuantity(cartItem.product_quantity);
      setIsInCart(true);
    } else {
      newQuantities[selectedPackage._id] = 0;
      setQuantity(1);
      setIsInCart(false);
    }

    setPackageQuantities(newQuantities);
  } catch (error) {
    console.error("Failed to update quantity:", error);
  } finally {
    setCartLoading((prev) => {
      const newSet = new Set(prev);
      newSet.delete(selectedPackage?._id);
      return newSet;
    });
  }
};


  const handleShare = useCallback(() => {
    setShowShareMenu(!showShareMenu);
  }, [showShareMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const getCategoryName = useCallback(
    (categoryId) => {
      return categoryMap[categoryId] || "Unknown Category";
    },
    [categoryMap]
  );

  const getCategoryIcon = useCallback((categoryName) => {
    const lowerCategory = categoryName?.toLowerCase() || "";
    if (
      lowerCategory.includes("supari") ||
      lowerCategory.includes("sweet supari")
    ) {
      return <Sparkles size={18} />;
    } else if (lowerCategory.includes("mukhwas")) {
      return <Leaf size={18} />;
    } else if (lowerCategory.includes("churan")) {
      return <Medal size={18} />;
    } else if (lowerCategory.includes("combo")) {
      return <Gift size={18} />;
    } else {
      return <Sparkles size={18} />;
    }
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewForm((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      setReviewError("Please select a rating");
      // toast.error("Please select a rating", { duration: 3000 });
      return;
    }
    if (!reviewForm.review_message.trim()) {
      setReviewError("Please enter a review message");
      // toast.error("Please enter a review message", { duration: 3000 });
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);

    try {
      const reviewData = {
        product_id: product?.product._id,
        rating: reviewForm.rating,
        review_message: reviewForm.review_message,
        customer_id: user?._id || null,
        customer: !!user,
        verifiedPurchase: true,
        images: reviewForm.images,
      };
      await addReviewService(reviewData);

      // Update to use getProductByCustomUrl instead of getProductById
      const productResponse = await getProductByCustomUrl(productId);
      const productData = productResponse.product || {};
      const updatedReviews = productData.reviews || [];
      setReviews(updatedReviews);

      const totalReviews = updatedReviews.length;
      const averageRating =
        updatedReviews.length > 0
          ? updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
            updatedReviews.length
          : 0;

      setProduct((prev) => ({
        ...prev,
        averageRating: averageRating.toFixed(1),
        totalReviews,
        reviews: updatedReviews,
      }));

      setReviewForm({
        rating: 0,
        review_message: "",
        images: [],
      });
      setShowReviewModal(false);
      // toast.success(
      //   <>
      //     <MessageCircle className="mr-2 inline" size={20} />
      //     Review submitted successfully!
      //   </>,
      //   { duration: 3000 }
      // );
    } catch (err) {
      setReviewError(
        err?.message || "Failed to submit review. Please try again."
      );
      // toast.error(
      //   err?.message || "Failed to submit review. Please try again.",
      //   { duration: 3000 }
      // );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist");
      window.location.href = "/login?role=consumer";

      return;
    }

    if (!selectedPackage?._id || wishlistLoading) {
      return;
    }

    try {
      setIsFavoriteLoading(true);
      if (isFavorite) {
        // Open WishlistModal with the current collection pre-selected
        setShowWishlistModal(true);
      } else {
        setShowWishlistModal(true);
      }
    } catch (err) {
      // toast.error("Failed to update wishlist", { duration: 3000 });
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleWishlistSuccess = ({ action, collectionName }) => {
    if (action === "removed") {
      setIsFavorite(false);
    } else if (action === "added") {
      setIsFavorite(true);
    }
    // toast.success(
    //   `Product ${action} ${collectionName} collection`,
    //   { duration: 3000 }
    // );
  };

  const handleWishlistSelection = async (collectionId) => {
    try {
      setIsFavoriteLoading(true);
      await dispatch(
        addToWishlist({
          product_id: selectedPackage._id,
          collection_id: collectionId,
        })
      ).unwrap();
      setIsFavorite(true);
      setShowWishlistModal(false);
    } catch (err) {
      // toast.error("Failed to add to wishlist", { duration: 3000 });
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const closeCart = () => {
    setShowCart(false);
  };

  const handleCartClick = () => {
    if (!user) {
      window.location.href = "/login?role=consumer";

      return;
    }
    setShowCart(!showCart);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-100 to-blue-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-10 bg-white rounded-2xl shadow-xl"
        >
          <Loader2
            className="mx-auto mb-4 animate-spin text-teal-600"
            size={48}
          />
          <h1 className="text-2xl font-bold text-teal-600 mb-2">
            Loading Product...
          </h1>
          <p className="text-blue-700">
            Please wait while we fetch the details!
          </p>
        </motion.div>
      </div>
    );
  }

  if (!product || !selectedPackage) {
    router.push("/products");
    return null;
    // Alternatively, you can show a user-friendly message here
    // return (
    //   <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-100 to-blue-100">
    //     <motion.div
    //       initial={{ scale: 0.8, opacity: 0 }}
    //       animate={{ scale: 1, opacity: 1 }}
    //       className="text-center p-10 bg-white rounded-2xl shadow-xl"
    //     >
    //       <h1 className="text-3xl font-bold text-teal-600 mb-4">
    //         {error ? "Error Loading Product" : "Product Not Found"}
    //       </h1>
    //       <p className="text-blue-700 mb-6">
    //         {error || "We couldn't find the product you're looking for!"}
    //       </p>
    //       <motion.button
    //         whileHover={{ scale: 1.05 }}
    //         whileTap={{ scale: 0.95 }}
    //         className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full font-bold"
    //         onClick={() => router.push("/products")}
    //       >
    //         Back to Shop
    //       </motion.button>
    //     </motion.div>
    //   </div>
    // );
  }

  const productImages = selectedPackage?.image?.filter((img) => img?.url) || [];
  const currentMainImage = mainImage || productImages[0]?.url || "";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-16">
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: 0;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-4 sm:pt-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          <div className="md:sticky top-36 md:h-[80vh] ">
            {currentMainImage ? (
              <motion.div
                className="mb-4 bg-gradient-to-r from-teal-100 via-blue-50 to-green-100 rounded-2xl h-80 md:h-96 flex justify-center items-center p-4 overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowImageOverlay(true)}
              >
                <img
                  src={currentMainImage}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain z-10"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.back();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    router.back();
                  }}
                  className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-md z-30 text-teal-600 hover:bg-teal-100 transition-all duration-200"
                  title="Go Back"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.div
                  className="absolute inset-0 bg-teal-200 rounded-full opacity-20"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut",
                  }}
                />
                {(selectedPackage?.bestSaling || product?.bestSaling) && (
                  <motion.span
                    className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center z-20"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Medal size={12} className="mr-1" />
                    Best Selling
                  </motion.span>
                )}
              </motion.div>
            ) : (
              <div className="mb-4 bg-gradient-to-r from-teal-100 via-blue-50 to-green-100 rounded-2xl h-80 md:h-96 flex justify-center items-center p-4">
                <p className="text-gray-500">No image available</p>
              </div>
            )}

            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2 px-1">
                {productImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    className={`rounded-lg overflow-hidden border-2 ${
                      currentMainImage === img.url
                        ? "border-teal-500"
                        : "border-transparent"
                    }`}
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMainImage(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Sticky Buttons Section for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-1 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
              <div className="flex gap-4 max-w-6xl mx-auto items-center">
                {isInCart ? (
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-600 shadow-md py-2 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-white opacity-10"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => {
                        const currentInCart =
                          packageQuantities[selectedPackage?._id] || 0;
                        if (currentInCart > 0) {
                          handleUpdateQuantity("decrement");
                        } else {
                          setQuantity(Math.max(1, quantity - 1));
                        }
                      }}
                      className="text-white"
                    >
                      <MinusCircle size={18} />
                    </motion.button>
                    <motion.div
                      className="mx-4 bg-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-teal-700"
                      whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                    >
                      {cartLoading.has(selectedPackage?._id) ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        quantity
                      )}
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => {
                        const currentInCart =
                          packageQuantities[selectedPackage?._id] || 0;
                        if (currentInCart > 0) {
                          handleUpdateQuantity("increment");
                        } else {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="text-white"
                    >
                      <PlusCircle size={18} />
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    className="flex-1 text-white py-3 font-bold text-base shadow-md flex items-center justify-center bg-gradient-to-r from-teal-500 to-blue-500"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </motion.button>
                )}

                <motion.button
                  className={`p-3 flex items-center justify-center border-r-2 border-gray-400 ${
                    isFavorite ? "text-red-600" : "text-blue-600"
                  } ${
                    wishlistLoading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  whileHover={{
                    scale: wishlistLoading ? 1 : 1.1,
                    rotate: wishlistLoading ? 0 : 10,
                  }}
                  whileTap={{ scale: wishlistLoading ? 1 : 0.9 }}
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Heart
                      size={24}
                      className={isFavorite ? "fill-red-600" : ""}
                    />
                  )}
                </motion.button>

                <motion.button
                  className="p-3 rounded-xl flex items-center justify-center text-blue-600 relative"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCartClick}
                >
                  <ShoppingCart size={24} />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -left-1 bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Desktop Sticky Buttons */}
            <div className="hidden md:block md:bottom-0 md:bg-opacity-95 z-20">
              <div className="flex gap-4 max-w-6xl mx-auto px-4 items-center">
                {isInCart ? (
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg py-2 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-white opacity-10"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => {
                        const currentInCart =
                          packageQuantities[selectedPackage?._id] || 0;
                        if (currentInCart > 0) {
                          handleUpdateQuantity("decrement");
                        } else {
                          setQuantity(Math.max(1, quantity - 1));
                        }
                      }}
                      className="text-white"
                    >
                      <MinusCircle size={22} />
                    </motion.button>
                    <motion.div
                      className="mx-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold text-teal-700"
                      whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                    >
                      {cartLoading.has(selectedPackage?._id) ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        quantity
                      )}
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => {
                        const currentInCart =
                          packageQuantities[selectedPackage?._id] || 0;
                        if (currentInCart > 0) {
                          handleUpdateQuantity("increment");
                        } else {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="text-white"
                    >
                      <PlusCircle size={22} />
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    className="flex-1 text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: "#349048" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </motion.button>
                )}

                <motion.button
                  className={`p-4 rounded-xl flex items-center justify-center ${
                    isFavorite ? "text-red-600" : "bg-blue-100 text-blue-600"
                  } ${
                    wishlistLoading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  whileHover={{
                    scale: wishlistLoading ? 1 : 1.1,
                    rotate: wishlistLoading ? 0 : 10,
                  }}
                  whileTap={{ scale: wishlistLoading ? 1 : 0.9 }}
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Heart
                      size={24}
                      className={isFavorite ? "fill-red-600" : ""}
                    />
                  )}
                </motion.button>

                <motion.button
                  className="p-4 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCartClick}
                >
                  <ShoppingCart size={24} />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="flex flex-col min-h-screen " ref={detailsRef}>
            <div className="flex items-center justify-between mb-2">
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-teal-800"
                animate={{
                  color: ["#0d9488", "#0ea5e9", "#10b981", "#0d9488"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {product.title}
              </motion.h1>

              <div className="relative" ref={shareMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="ml-4 p-2 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 shadow-md transition-all duration-200 flex items-center justify-center group"
                  title="Share this product"
                >
                  <Send
                    size={20}
                    className="group-hover:text-teal-700 transition-colors duration-200 mr-1"
                  />
                  <span className="text-sm font-medium group-hover:text-teal-700 transition-colors duration-200">
                    Share
                  </span>
                </motion.button>

                {showShareMenu && (
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
                      <span className="mt-1 text-xs">WhatsApp</span>
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
                      <span className="mt-1 text-xs">Instagram</span>
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
                      <span className="mt-1 text-xs">Facebook</span>
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
                      <span className="mt-1 text-xs">Email</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className={`${
                      idx < Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
            {selectedPackage && (
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-teal-600 mr-3">
                  ₹{selectedPackage.saleingPrice}
                </span>
                {selectedPackage.mrp > selectedPackage.saleingPrice && (
                  <span className="text-gray-400 line-through text-lg">
                    ₹{selectedPackage.mrp}
                  </span>
                )}
                {selectedPackage.discount > 0 && (
                  <motion.span
                    className="ml-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 3, 0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  >
                    {selectedPackage.discount}% OFF
                  </motion.span>
                )}
              </div>
            )}
            {
              // !user ? (
              //   <div className="w-full mx-auto bg-green-300/10 rounded-lg shadow-sm p-4 border border-gray-200 mb-4">
              //     <h2 className="text-lg font-medium mb-3">Coupons</h2>
              //     <p className="text-gray-600">
              //       Please login to see available coupon benefits!
              //     </p>
              //     <motion.button
              //       whileHover={{ scale: 1.05 }}
              //       whileTap={{ scale: 0.95 }}
              //       className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full font-bold text-sm"
              //       onClick={() => router.push("/login?role=consumer")}
              //     >
              //       Login Now
              //     </motion.button>
              //   </div>
              // ) :
              coupons.length > 0 ? (
                <div className="w-full mx-auto bg-green-300/10 rounded-lg shadow-sm p-4 border border-gray-200 mb-4">
                  <h2 className="text-lg font-medium mb-3">
                    Available Coupons
                  </h2>
                  <div className="space-y-3">
                    {(showAllCoupons ? coupons : coupons.slice(0, 1)).map(
                      (result, index) => {
                        const isCopied = copiedCoupon === result.coupon.code;
                        return (
                          <div
                            key={index}
                            className="p-3 bg-green-100 rounded-md border border-gray-200"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex">
                                  <p className="text-xs text-blue-500">
                                    T&C apply
                                  </p>
                                </div>
                                <div className="flex items-center mt-1">
                                  <span className="bg-white px-2 py-1 rounded text-sm font-mono border border-dashed border-gray-400">
                                    {result.coupon.code}
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`ml-2 text-sm font-medium ${
                                      isCopied
                                        ? "text-green-600"
                                        : "text-blue-600"
                                    }`}
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        result.coupon.code
                                      );
                                      setCopiedCoupon(result.coupon.code);
                                      // toast.success("Code copied!");
                                      // setTimeout(
                                      //   () => setCopiedCoupon(null),
                                      //   2000
                                      // );
                                    }}
                                  >
                                    {isCopied ? "Copied" : "Copy code"}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {result.coupon.discountType === "percentage"
                                ? `Get ${result.coupon.discountValue}% off`
                                : result.coupon.discountType === "flat"
                                ? `Get ₹${result.coupon.discountValue} off`
                                : `Get ${result.coupon.giftProduct?.title} free`}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Min Purchase Amount: ₹
                              {result.coupon.min_Purchase_Amount} | Expire:{" "}
                              {result.coupon.expiry}
                            </p>
                          </div>
                        );
                      }
                    )}
                    {coupons.length > 1 && (
                      <button
                        onClick={() => setShowAllCoupons(!showAllCoupons)}
                        className="flex items-center text-sm font-medium text-blue-600 mt-2"
                      >
                        {showAllCoupons ? (
                          <>
                            Show Less <ChevronUp size={16} className="ml-1" />
                          </>
                        ) : (
                          <>
                            {coupons.length - 1} More Coupon(s){" "}
                            <ChevronDown size={16} className="ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : null
            }

            {product.subproduct?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-teal-700 font-bold mb-3 flex items-center">
                  {getCategoryIcon(getCategoryName(product.category))}
                  <span className="ml-2">Choose Package Size:</span>
                </h3>

                {/* Mobile Dropdown View */}
                <div className="md:hidden flex justify-start">
                  <div className="relative w-64">
                    <motion.button
                      className="w-full px-3 py-1.5 rounded-full bg-[#349048] text-white shadow-md flex justify-between items-center text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setIsPackageDropdownOpen(!isPackageDropdownOpen)
                      }
                    >
                      <span>
                        {selectedPackage?.subtitle} - ₹
                        {selectedPackage?.saleingPrice}
                      </span>
                      {isPackageDropdownOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </motion.button>
                    <AnimatePresence>
                      {isPackageDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-xl mt-1 z-10"
                        >
                          {product.subproduct.map((subProduct, index) => (
                            <motion.button
                              key={index}
                              className="w-full px-4 py-2 text-left text-teal-700 hover:bg-teal-50 text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSelectedPackage(subProduct);
                                const newImage = subProduct.image?.[0]?.url;
                                if (newImage) {
                                  setMainImage(newImage);
                                }
                                const packageQuantity =
                                  packageQuantities[subProduct._id] || 0;
                                setQuantity(
                                  packageQuantity > 0 ? packageQuantity : 1
                                );
                                setIsInCart(packageQuantity > 0);
                                setIsPackageDropdownOpen(false);
                              }}
                            >
                              {subProduct.subtitle} - ₹{subProduct.saleingPrice}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex md:flex-wrap md:gap-3">
                  {product.subproduct.map((subProduct, index) => (
                    <motion.button
                      key={index}
                      className={`px-4 py-2 rounded-full ${
                        selectedPackage?._id === subProduct._id
                          ? "bg-[#349048] text-white shadow-md"
                          : "bg-white border-2 border-teal-200 text-teal-700"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedPackage(subProduct);
                        const newImage = subProduct.image?.[0]?.url;
                        if (newImage) {
                          setMainImage(newImage);
                        }
                        const packageQuantity =
                          packageQuantities[subProduct._id] || 0;
                        setQuantity(packageQuantity > 0 ? packageQuantity : 1);
                        setIsInCart(packageQuantity > 0);
                      }}
                    >
                      {subProduct.subtitle} - ₹{subProduct.saleingPrice}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 mb-6">
              <h3 className="text-teal-700 font-bold">Quantity:</h3>
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    const currentInCart =
                      packageQuantities[selectedPackage?._id] || 0;
                    if (currentInCart > 0) {
                      handleUpdateQuantity("decrement");
                    } else {
                      setQuantity(Math.max(1, quantity - 1));
                    }
                  }}
                  className="text-teal-600"
                >
                  <MinusCircle size={24} />
                </motion.button>
                <motion.div
                  className="mx-4 bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold text-teal-700"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                >
                  {cartLoading.has(selectedPackage?._id) ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    quantity
                  )}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    const currentInCart =
                      packageQuantities[selectedPackage?._id] || 0;
                    if (currentInCart > 0) {
                      handleUpdateQuantity("increment");
                    } else {
                      setQuantity(quantity + 1);
                    }
                  }}
                  className="text-teal-600"
                >
                  <PlusCircle size={24} />
                </motion.button>
              </div>
            </div>

            {product.description && (
              <div className="bg-green-50 p-4 rounded-xl border border-blue-100 mb-6">
                <h3 className="text-green-700 font-bold mb-3">
                  Product Description
                </h3>
                <p
                  ref={descriptionRef}
                  className={`text-slate-600 ${
                    showFullDescription ? "" : "line-clamp-4 overflow-hidden"
                  }`}
                >
                  {product.description}
                </p>
                {isDescriptionLong && (
                  <motion.button
                    className="text-teal-600 text-sm font-medium mt-2 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? (
                      <>
                        Show Less <ChevronUp size={16} className="ml-1" />
                      </>
                    ) : (
                      <>
                        Show More <ChevronDown size={16} className="ml-1" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-6 rounded-2xl border border-blue-200/50 mb-6 shadow-lg shadow-blue-100/50">
              <h3 className="text-green-700 font-bold mb-3 flex items-center gap-2">
                Product Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="flex flex-col p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:shadow-md transition-all duration-200">
                  <span className="text-xs sm:text-sm text-green-700 font-medium uppercase tracking-wide">
                    SKU
                  </span>
                  <div className="flex flex-col">
                    <span className="text-slate-600 mt-1">
                      {selectedPackage?.sku || product.sku ? (
                        <>
                          <span className="md:hidden">
                            {(selectedPackage?.sku || product.sku).length >
                              40 && !showSKU
                              ? `${(selectedPackage?.sku || product.sku).slice(
                                  0,
                                  20
                                )}...`
                              : selectedPackage?.sku || product.sku}
                          </span>
                          <span className="hidden md:block">
                            {selectedPackage?.sku || product.sku}
                          </span>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                    {(selectedPackage?.sku || product.sku) &&
                      (selectedPackage?.sku || product.sku).length > 20 && (
                        <motion.button
                          className="md:hidden text-teal-600 text-sm font-medium mt-2 flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowSKU(!showSKU)}
                        >
                          {showSKU ? (
                            <>
                              Show Less <ChevronUp size={16} className="ml-1" />
                            </>
                          ) : (
                            <>
                              View More{" "}
                              <ChevronDown size={16} className="ml-1" />
                            </>
                          )}
                        </motion.button>
                      )}
                  </div>
                </div>

                <div className="flex flex-col p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:shadow-md transition-all duration-200">
                  <span className="text-xs sm:text-sm text-green-700 font-medium uppercase tracking-wide">
                    Category
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-600">{product?.category}</span>
                  </div>
                </div>

                <div className="flex flex-col p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:shadow-md transition-all duration-200 sm:col-span-2">
                  <span className="text-xs sm:text-sm text-green-700 font-medium uppercase tracking-wide">
                    Ingredients
                  </span>
                  <div className="flex flex-col">
                    <span className="text-slate-600 mt-1 leading-relaxed">
                      {product?.ingridiant ? (
                        <>
                          <span className="md:hidden">
                            {product.ingridiant.length > 20 && !showIngredients
                              ? `${product.ingridiant.slice(0, 20)}...`
                              : product.ingridiant}
                          </span>
                          <span className="hidden md:block">
                            {product.ingridiant}
                          </span>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                    {product?.ingridiant && product.ingridiant.length > 20 && (
                      <motion.button
                        className="md:hidden text-teal-600 text-sm font-medium mt-2 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowIngredients(!showIngredients)}
                      >
                        {showIngredients ? (
                          <>
                            Show Less <ChevronUp size={16} className="ml-1" />
                          </>
                        ) : (
                          <>
                            View More <ChevronDown size={16} className="ml-1" />
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <section id="review" className="my-8">
              <motion.h2
                className="text-xl font-bold text-teal-700 mb-4 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <MessageCircle size={20} className="mr-2" />
                Customer Reviews ({reviews?.length || 0})
              </motion.h2>

              <motion.div
                className="bg-teal-50 p-4 rounded-xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-teal-700">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-600 text-sm ml-1">out of 5</span>
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={16}
                          className={`${
                            idx < Math.round(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {reviews.length || 0} total reviews
                    </p>
                  </div>
                  {canReview ? (
                    <motion.button
                      className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowReviewModal(true)}
                    >
                      Write a Review
                    </motion.button>
                  ) : (
                    <div className="relative group">
                      <motion.button
                        className="bg-gradient-to-r from-teal-500/50 to-blue-500/50 text-white px-4 py-2 rounded-full text-sm font-bold cursor-not-allowed"
                        disabled
                      >
                        Write a Review
                      </motion.button>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded-lg py-2 px-3 -top-10 left-1/2 -translate-x-1/2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-48 text-center">
                        You haven't purchased this product yet. Purchase to
                        leave a review! 🛒
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {(showAllReviews ? reviews : reviews.slice(0, 4)).map(
                    (review, index) => (
                      <motion.div
                        key={index}
                        className="bg-white p-4 rounded-xl border border-teal-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                size={14}
                                className={`${
                                  idx < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-700">{review.review_message}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          By: {review.name}
                        </p>
                        {review.image && review.image.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {review.image.map((img, idx) => (
                              <img
                                key={idx}
                                src={img.url}
                                alt={`Review image ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )
                  )}

                  {reviews.length > 4 && (
                    <div className="float-left">
                      <motion.button
                        className="text-teal-600 rounded-full font-semibold hover:bg-teal-50 transition-colors duration-200 flex items-center mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAllReviews(!showAllReviews)}
                      >
                        {showAllReviews ? (
                          <>
                            <ChevronUp size={16} className="mr-2" />
                            Show Less Reviews
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} className="mr-2" />
                            View All {reviews.length} Reviews
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  No reviews yet. {canReview ? "Be the first to review!" : ""}
                </div>
              )}
            </section>
            <BoughtTogether data={product} />
          </div>
        </div>

        {product?.category && <SimilarProducts category={product.category} />}

        <div>
          <WhyChooseUs />
        </div>
        <div>
          {Array.isArray(product?.faq) && product.faq.length > 0 && (
            <ProductFAQ faqData={product.faq} name={product.title} />
          )}
        </div>
      </div>
      <AnimatePresence>
        {showImageOverlay && currentMainImage && (
          <motion.div
            className="fixed inset-0 bg-black/60 bg-opacity-80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageOverlay(false)}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-4 max-w-3xl w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10"
                onClick={() => setShowImageOverlay(false)}
              >
                <ChevronLeft size={24} />
              </button>
              <img
                src={currentMainImage}
                alt={product.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <WishlistModal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        product={product}
        selectedPackage={selectedPackage}
        isFavorite={isFavorite}
        onSuccess={handleWishlistSuccess}
        currentCollection={
          isFavorite
            ? wishlist.find(
                (collection) =>
                  Array.isArray(collection.products) &&
                  collection.products.some(
                    (item) => item.product_id?._id === selectedPackage._id
                  )
              )?.name
            : null
        }
        onSelectCollection={handleWishlistSelection}
        collections={
          Array.isArray(wishlist)
            ? wishlist.map((collection) => ({
                _id: collection._id,
                name: collection.name,
              }))
            : []
        }
      />
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 bg-opacity-80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-6 max-w-lg w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10"
                onClick={() => setShowReviewModal(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold text-teal-700 mb-4">
                Write a Review
              </h2>

              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="text-teal-700 font-bold mb-2 block">
                    Rating:
                  </label>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={24}
                        className={`cursor-pointer ${
                          idx < reviewForm.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => handleStarClick(idx + 1)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-teal-700 font-bold mb-2 block">
                    Review Message:
                  </label>
                  <textarea
                    name="review_message"
                    value={reviewForm.review_message}
                    onChange={handleReviewChange}
                    className="w-full p-3 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows="4"
                    placeholder="Write your review here..."
                  />
                </div>

                <div className="mb-4">
                  <label className="text-teal-700 font-bold mb-2 block">
                    Upload Images:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full p-3 border border-teal-200 rounded-xl"
                  />
                  {reviewForm.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {reviewForm.images.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={() =>
                              setReviewForm((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx),
                              }))
                            }
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {reviewError && (
                  <p className="text-red-500 text-sm mb-4">{reviewError}</p>
                )}

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? (
                    <Loader2 className="animate-spin mx-auto" size={24} />
                  ) : (
                    "Submit Review"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Cart isOpen={showCart} onClose={closeCart} />
    </div>
  );
}
