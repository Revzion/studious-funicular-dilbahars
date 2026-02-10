"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  User,
  Menu,
  X,
  Home,
  Star,
  Phone,
  BookOpen,
  ShoppingBag,
} from "lucide-react";
import Cart from "../Cart/Cart";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { clearUser } from "@/redux/slice/userSlice";
import { getCategoriesService } from "@/services/categoryServices";
import {
  getProfileService,
  logoutB2cUserService,
} from "@/services/b2cServices";
import { fetchCartItems } from "@/redux/thunks/cartThunks";
import { clearCart, setCart } from "@/redux/slice/cartSlice";
import { getAllActiveProducts } from "@/services/productServices";
import { fetchCompanyProfile } from "@/redux/slice/companySlice";

export default function Navbar() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const cartItems = useSelector((state) => state.cart);
  const cartCount = useSelector((state) => state.cart.itemCount);
  const companyProfile = useSelector((state) => state.company.companyProfile);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedSort, setSelectedSort] = useState("featured");
  const categoryDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileMenuRef = useRef(null); // New ref for mobile menu

  const closeCart = () => {
    setShowCart(false);
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  useEffect(() => {}, [showCart]);

  useEffect(() => {
    if (!companyProfile) {
      dispatch(fetchCompanyProfile())
        .unwrap()
        .then((data) => {
          // console.log("company fetched", data);
        })
        .catch((error) => {
          console.error("Failed to fetch company profile:", error);
        });
    }
  }, [isAuthenticated, companyProfile, dispatch]);

  const priceRanges = [
    { label: "Under ₹50", min: 0, max: 50 },
    { label: "₹50 - ₹100", min: 50, max: 100 },
    { label: "₹100 - ₹200", min: 100, max: 200 },
    { label: "₹200 - ₹500", min: 200, max: 500 },
    { label: "Above ₹500", min: 500, max: Infinity },
  ];

  const sortToParams = {
    bestselling: { bestSaling: true },
    discount: { discount: true },
  };

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdown(false);
      }
      if (showMobileSearch && !event.target.closest(".mobile-search-popup")) {
        setShowMobileSearch(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-search-popup")
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategoriesService();
        const allCategories = response.data?.categories || [];
        const activeCategories = allCategories.filter((cat) => cat.isActive);
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await getProfileService();
        if (response.success && response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchCategories();
    if (isAuthenticated) {
      fetchUserProfile();
    }

    const priceRangeLabel = searchParams.get("priceRange");
    const rating = searchParams.get("rating");
    const sort = searchParams.get("sort");
    if (priceRangeLabel) {
      const priceRange = priceRanges.find(
        (range) => range.label === priceRangeLabel
      );
      setSelectedPriceRange(priceRange || null);
    }
    if (rating) {
      setSelectedRating(Number(rating) || null);
    }
    if (sort) {
      setSelectedSort(sort);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [isAuthenticated, dispatch, searchParams, isOpen]);

  const handleSearch = async (query) => {
    if (!query.trim() || query.trim().length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);

    try {
      const params = {
        search: query.trim(),
        category: selectedCategory
          ? categories.find((cat) => cat.title === selectedCategory)?._id
          : "",
        minPrice: selectedPriceRange?.min,
        maxPrice:
          selectedPriceRange?.max === Infinity
            ? undefined
            : selectedPriceRange?.max,
        rating: selectedRating,
        ...sortToParams[selectedSort],
        limit: 8,
      };
      const response = await getAllActiveProducts(params);
      console.log("getAllActiveProducts", response);
      setSearchResults(response.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (value, isMobile = false) => {
    if (isMobile) {
      setMobileSearchQuery(value);
    } else {
      setSearchQuery(value);
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleSearchResultClick = (product) => {
    setShowSearchResults(false);
    setSearchQuery("");
    setMobileSearchQuery("");
    window.location.href = `/products/${product?.customUrl}`;
  };

  const handleSearchSubmit = (e, isMobile = false) => {
    e.preventDefault();
    const query = isMobile ? mobileSearchQuery : searchQuery;
    if (!query.trim() || query.trim().length < 3) {
      return;
    }

    setShowSearchResults(false);
    setShowMobileSearch(false);

    const params = new URLSearchParams();

    params.set("search", query.trim());

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (selectedPriceRange) {
      params.set("priceRange", selectedPriceRange.label);
    }

    if (selectedRating) {
      params.set("rating", selectedRating);
    }

    if (selectedSort) {
      params.set("sort", selectedSort);
    }

    window.location.href = `/products?${params
      .toString()
      .replace(/\+/g, "%20")}`;
  };

  const handleLogout = async () => {
    try {
      setProfileDropdown(false);
      setLoading(true);

      await logoutB2cUserService();

      dispatch(clearCart());

      dispatch(clearUser());
    } catch (error) {
      console.error("Logout failed:", error.message);
      setLoading(false);
    }
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="h-[97px] md:h-[96px] lg:h-[140px]" />
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        } bg-gradient-to-r from-cyan-100 via-green-100 to-white`}
        style={{
          background:
            "linear-gradient(to right, #cffafe 0%,  #ffffff 50%, #cffafe 100%)",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <motion.div
          className="text-white text-center py-[4px] text-sm rounded-b-lg"
          style={{ backgroundColor: "#349048" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <span className="inline-block animate-bounce"></span>{" "}
          {loading
            ? "Free Shipping on Orders Above ₹..."
            : companyProfile?.shipping?.shippingCharge === 0
            ? "Free Shipping on All Orders!"
            : `Free Shipping on Orders Above ₹${companyProfile?.shipping?.minAmount}!`}{" "}
          <span className="inline-block animate-bounce"></span>
        </motion.div>
        <motion.div
          className={`transition-all duration-300 ${
            scrolled ? "py-1" : "py-2"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/" passHref>
                  <div className="logo-container text-2xl font-bold flex items-center justify-center cursor-pointer">
                    <img
                      src="/Dilbahars-logo.png"
                      width={100}
                      alt="Dilbahar's"
                    />
                    <img
                      src="/logo2.png"
                      width={100}
                      alt="Dilbahar's"
                      className="pb-2"
                    />
                  </div>
                </Link>
              </motion.div>

              <motion.div
                className="lg:hidden flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <motion.button
                  onClick={() => setShowMobileSearch(true)}
                  className="p-2 bg-green-400 text-blue-700 rounded-full outline-none shadow-lg"
                  whileTap={{ scale: 0.9 }}
                >
                  <Search size={24} />
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 bg-green-400 text-blue-700 rounded-full outline-none shadow-lg"
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.div>
                </motion.button>
              </motion.div>

              <motion.div
                className="hidden lg:flex flex-1 mx-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <motion.div
                  ref={searchRef}
                  className="relative w-full max-w-xl z-10"
                  animate={{ scale: searchFocused ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Search for treats and more..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className={`w-full py-2 pl-5 pr-12 text-blue-700 bg-white rounded-full focus:outline-none focus:ring-2 ${
                        searchFocused
                          ? "focus:ring-blue-400"
                          : "focus:ring-blue-300"
                      } border border-blue-300 shadow-md text-base transition-all duration-200`}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    />
                    <motion.button
                      type="submit"
                      className="absolute right-0 top-0 h-full px-4 text-blue-600 rounded-r-full"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Search size={22} />
                    </motion.button>
                  </form>
                  <AnimatePresence>
                    {showSearchResults && searchResults.length > 0 && (
                      <motion.div
                        className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl z-50 border-2 border-blue-300 overflow-hidden mt-1 max-h-96 overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {searchLoading ? (
                          <div className="p-4 text-center text-blue-700">
                            Loading...
                          </div>
                        ) : (
                          <ul className="divide-y divide-blue-100">
                            {searchResults.map((product) => (
                              <li key={product._id}>
                                <button
                                  onClick={() =>
                                    handleSearchResultClick(product)
                                  }
                                  className="w-full flex items-center space-x-4 p-4 text-left hover:bg-blue-50 transition-colors"
                                >
                                  {product.subproduct?.[0]?.image && (
                                    <img
                                      src={product.subproduct[0]?.image[0]?.url}
                                      alt={product.title}
                                      className="w-12 h-12 object-cover rounded-md shadow-sm"
                                    />
                                  )}
                                  <div>
                                    <h3 className="font-medium text-blue-800">
                                      {product.title}
                                    </h3>
                                    <p className="text-sm text-green-600 font-semibold">
                                      ₹{product.minPrice}
                                      {product.maxPrice > product.minPrice
                                        ? ` - ₹${product.maxPrice}`
                                        : ""}
                                    </p>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              <motion.div
                className="hidden lg:flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {isAuthenticated ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <motion.button
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="flex items-center space-x-2 text-blue-800 py-2 px-4 rounded-full border border-blue-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User size={20} />
                      {profileLoading
                        ? "Loading..."
                        : user?.fullname?.firstname || "User"}
                      <motion.div
                        animate={{ rotate: profileDropdown ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {profileDropdown && (
                        <motion.div
                          className="absolute top-full left-0 w-30 bg-white shadow-xl rounded-b-xl z-10 border-2 border-blue-300 overflow-hidden mt-1"
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <ul className="py-2">
                            <motion.li
                              className="relative group/item"
                              whileHover={{ backgroundColor: "#EFF6FF" }}
                            >
                              <a
                                href="/profile"
                                className="w-full flex items-center px-4 py-3 text-blue-700 transition-colors font-medium"
                              >
                                <User size={18} className="mr-3" />
                                <span>Profile</span>
                              </a>
                            </motion.li>
                            <motion.li
                              className="relative group/item"
                              whileHover={{ backgroundColor: "#EFF6FF" }}
                            >
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-3 text-blue-700 transition-colors font-medium"
                              >
                                <LogOut size={18} className="mr-3" />
                                <span>Logout</span>
                              </button>
                            </motion.li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.a
                    href="/login"
                    className="flex items-center space-x-2 text-blue-800 py-2 px-4 rounded-full border border-blue-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User size={20} />
                    <span>Login/Sign Up</span>
                  </motion.a>
                )}
                <motion.a
                  href="/favorites"
                  className="flex items-center space-x-2 text-blue-800 py-2 px-4 rounded-full border border-blue-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Heart size={20} />
                  </motion.div>
                  <span>Favorites</span>
                </motion.a>

                <motion.button
                  className="flex items-center space-x-2 text-blue-800 border-blue-300 py-2 px-4 rounded-full border  relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCartClick}
                >
                  <ShoppingCart size={20} />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-green-400 text-blue-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md border-2 border-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        delay: 0.8,
                      }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              className="lg:hidden fixed top-5 w-full z-50 flex mobile-search-popup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="p-4 w-full"
                initial={{ scale: 0.8, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={(e) => handleSearchSubmit(e, true)}>
                  <div
                    ref={mobileSearchRef}
                    className="relative bg-white rounded-full shadow-md"
                  >
                    <input
                      type="text"
                      placeholder="Search for treats and more..."
                      value={mobileSearchQuery}
                      onChange={(e) => handleSearchChange(e.target.value, true)}
                      className="w-full py-3 pl-5 pr-20 text-blue-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-300 shadow-md text-base"
                    />
                    <button
                      type="submit"
                      className="absolute right-12 top-0 h-full px-4 text-blue-600 rounded-r-full"
                    >
                      <Search size={22} />
                    </button>
                    <button
                      onClick={() => setShowMobileSearch(false)}
                      className="absolute right-0 top-0 h-full px-4 text-blue-700 rounded-r-full"
                    >
                      <X size={22} />
                    </button>
                    <AnimatePresence>
                      {showSearchResults && searchResults.length > 0 && (
                        <motion.div
                          className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-xl z-10 border-2 border-blue-300 overflow-hidden mt-1 max-h-96 overflow-y-auto"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {searchLoading ? (
                            <div className="p-4 text-center text-blue-700">
                              Loading...
                            </div>
                          ) : (
                            <ul className="divide-y divide-blue-100">
                              {searchResults.map((product) => (
                                <li key={product._id}>
                                  <button
                                    onClick={() =>
                                      handleSearchResultClick(product)
                                    }
                                    className="w-full flex items-center space-x-4 p-4 text-left hover:bg-blue-50 transition-colors"
                                  >
                                    {product.subproduct?.[0]?.image && (
                                      <img
                                        src={
                                          product.subproduct[0]?.image[0]?.url
                                        }
                                        alt={product.title}
                                        className="w-12 h-12 object-cover rounded-md shadow-sm"
                                      />
                                    )}
                                    <div>
                                      <h3 className="font-medium text-blue-800">
                                        {product.title}
                                      </h3>
                                      <p className="text-sm text-green-600 font-semibold">
                                        ₹{product.minPrice}
                                        {product.maxPrice > product.minPrice
                                          ? ` - ₹${product.maxPrice}`
                                          : ""}
                                      </p>
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden lg:flex items-center justify-between">
              <div className="relative group" ref={categoryDropdownRef}>
                <motion.button
                  className="flex items-center py-3 transition-colors cursor-pointer"
                  onClick={() => toggleDropdown(0)}
                >
                  <span className="text-blue-800 font-bold">Category</span>
                  <motion.div
                    animate={{ rotate: activeDropdown === 0 ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} className="ml-1 text-blue-800" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {activeDropdown === 0 && (
                    <motion.div
                      className="absolute top-full left-0 w-72 bg-white shadow-xl rounded-b-xl z-10 border-2 border-blue-300 overflow-hidden"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {loading ? (
                        <div className="py-4 px-4 text-center text-blue-700">
                          Loading categories...
                        </div>
                      ) : categories.length > 0 ? (
                        <ul className="py-2">
                          {categories.map((category, index) => (
                            <motion.li
                              key={category._id}
                              className="relative group/item"
                              whileHover={{ backgroundColor: "#EFF6FF" }}
                            >
                              <a
                                href={`/products?category=${category.title}`}
                                className="w-full flex items-center justify-between px-4 py-3 text-blue-700 transition-colors font-medium"
                              >
                                <div className="flex items-center">
                                  <span className="text-xl"></span>
                                  <span>{category.title}</span>
                                </div>
                                {category.subcategories &&
                                  category.subcategories.length > 0 && (
                                    <ChevronDown
                                      size={16}
                                      className="text-blue-400"
                                    />
                                  )}
                              </a>

                              {category.subcategories &&
                                category.subcategories.length > 0 && (
                                  <div className="absolute left-full top-0 w-64 bg-white shadow-xl hidden group-hover/item:block border-2 border-blue-300 rounded-r-xl">
                                    <ul className="py-2">
                                      {category.subcategories.map(
                                        (subcategory, typeIndex) => (
                                          <motion.a
                                            key={subcategory._id || typeIndex}
                                            href={`/products/${category.name.toLowerCase()}/${subcategory.name
                                              .toLowerCase()
                                              .replace(" ", "-")}`}
                                            className="block px-4 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                                            whileHover={{ x: 5 }}
                                          >
                                            {subcategory.name}
                                          </motion.a>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <div className="py-4 px-4 text-center text-blue-700">
                          No categories available
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ul className="flex">
                <motion.li className="py-3 px-5 cursor-pointer relative group">
                  <a
                    href="/"
                    className="flex items-center text-blue-800 font-semibold"
                  >
                    <Home size={18} className="mr-2" />
                    <span>Home</span>
                  </a>
                  <motion.div className="absolute bottom-1 left-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300" />
                </motion.li>

                <motion.li className="py-3 px-5 cursor-pointer relative group">
                  <a
                    href="/about"
                    className="flex items-center text-blue-800 font-semibold"
                  >
                    <Star size={18} className="mr-2" />
                    <span>About Us</span>
                  </a>
                  <motion.div className="absolute bottom-1 left-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300" />
                </motion.li>

                <motion.li className="py-3 px-5 cursor-pointer relative group">
                  <a
                    href="/blog"
                    className="flex items-center text-blue-800 font-semibold"
                  >
                    <BookOpen size={18} className="mr-2" />
                    <span>Blog</span>
                  </a>
                  <motion.div className="absolute bottom-1 left-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300" />
                </motion.li>

                <motion.li className="py-3 px-5 cursor-pointer relative group">
                  <a
                    href="/products"
                    className="flex items-center text-blue-800 font-semibold"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    <span>Products</span>
                  </a>
                  <motion.div className="absolute bottom-1 left-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300" />
                </motion.li>

                <motion.li className="py-3 px-5 cursor-pointer relative group">
                  <a
                    href="/contact"
                    className="flex items-center text-blue-800 font-semibold"
                  >
                    <Phone size={18} className="mr-2" />
                    <span>Contact</span>
                  </a>
                  <motion.div className="absolute bottom-1 left-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300" />
                </motion.li>
              </ul>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  ref={mobileMenuRef}
                  className="lg:hidden py-2 bg-white rounded-b-xl overflow-scroll shadow-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.ul
                    className="py-2 space-y-1 px-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {isAuthenticated ? (
                      <motion.li
                        className="border-b border-gray-200"
                        variants={itemVariants}
                      >
                        <button
                          onClick={() => setProfileDropdown(!profileDropdown)}
                          className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-semibold w-full text-left"
                        >
                          <User size={20} />
                          <span>
                            {profileLoading
                              ? "Loading..."
                              : user?.fullname?.firstname || "User"}
                          </span>
                          <motion.div
                            animate={{ rotate: profileDropdown ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={20} />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {profileDropdown && (
                            <motion.ul
                              className="bg-gray-50 rounded-lg mx-4 mb-4 overflow-hidden"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.li
                                className="border-b border-gray-100"
                                whileHover={{ backgroundColor: "#EFF6FF" }}
                              >
                                <a
                                  href="/profile"
                                  className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-medium"
                                  onClick={() => setProfileDropdown(false)}
                                >
                                  <User size={18} className="mr-3" />
                                  <span>Profile</span>
                                </a>
                              </motion.li>
                              <motion.li
                                className="border-b border-gray-100"
                                whileHover={{ backgroundColor: "#EFF6FF" }}
                              >
                                <button
                                  onClick={handleLogout}
                                  className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-medium w-full text-left"
                                >
                                  <LogOut size={18} className="mr-3" />
                                  <span>Logout</span>
                                </button>
                              </motion.li>
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    ) : (
                      <motion.li
                        className="border-b border-gray-200"
                        variants={itemVariants}
                      >
                        <a
                          href="/login"
                          className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-semibold"
                        >
                          <User size={20} />
                          <span>Login/Sign Up</span>
                        </a>
                      </motion.li>
                    )}
                    <motion.li
                      className="border-b border-gray-200"
                      variants={itemVariants}
                    >
                      <a
                        href="/"
                        className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-semibold"
                      >
                        <Home size={20} />
                        <span>Home</span>
                      </a>
                    </motion.li>
                    <div className="relative group" ref={categoryDropdownRef}>
                      <motion.li
                        className="border-b border-gray-200"
                        variants={itemVariants}
                      >
                        <button
                          onClick={() => toggleDropdown(0)}
                          className="flex items-center justify-between w-full px-4 py-3 text-blue-800 font-semibold"
                        >
                          <div className="flex items-center space-x-3">
                            <ShoppingBag size={20} />
                            <span>Products</span>
                          </div>
                          <motion.div
                            animate={{ rotate: activeDropdown === 0 ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={20} />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {activeDropdown === 0 && (
                            <motion.ul
                              className="bg-gray-50 rounded-lg mx-4 mb-4 overflow-hidden"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {loading ? (
                                <div className="py-4 px-4 text-center text-blue-700">
                                  Loading categories...
                                </div>
                              ) : categories.length > 0 ? (
                                categories.map((category, index) => (
                                  <motion.li
                                    key={category._id}
                                    className="border-b border-gray-100 last:border-0"
                                  >
                                    <a
                                      href={`/products?category=${category.title}`}
                                      className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-medium"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <span className="text-xl"></span>
                                      <span>{category.title}</span>
                                    </a>
                                  </motion.li>
                                ))
                              ) : (
                                <div className="py-4 px-4 text-center text-blue-700">
                                  No categories available
                                </div>
                              )}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    </div>

                    <motion.li
                      className="border-b border-gray-200"
                      variants={itemVariants}
                    >
                      <a
                        href="/about"
                        className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-semibold"
                      >
                        <Star size={20} />
                        <span>About Us</span>
                      </a>
                    </motion.li>

                    <motion.li
                      className="border-b border-gray-200"
                      variants={itemVariants}
                    >
                      <a
                        href="/blog"
                        className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-semibold"
                      >
                        <BookOpen size={20} />
                        <span>Blog</span>
                      </a>
                    </motion.li>

                    <motion.li
                      className="border-b border-gray-200"
                      variants={itemVariants}
                    >
                      <a
                        href="/contact"
                        className="flex items-center space-x-3 px-4 py-3 text-blue-800 font-semibold"
                      >
                        <Phone size={20} />
                        <span>Contact</span>
                      </a>
                    </motion.li>

                    <motion.li
                      className="border-b border-gray-200"
                      variants={itemVariants}
                    >
                      <a
                        href="/favorites"
                        className="flex items-center space-x-3 px-4 py-3 text-blue-800"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        >
                          <Heart size={20} />
                        </motion.div>
                        <span>Favorites</span>
                      </a>
                    </motion.li>

                    <motion.li variants={itemVariants}>
                      <button
                        onClick={handleCartClick}
                        className="flex items-center space-x-3 px-4 py-3 text-blue-800 w-full text-left"
                      >
                        <div className="relative">
                          <ShoppingCart size={20} />
                          {cartCount > 0 && (
                            <motion.span
                              className="absolute -top-2 -right-2 bg-green-400 text-blue-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border border-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              {cartCount}
                            </motion.span>
                          )}
                        </div>
                        <span>Cart</span>
                      </button>
                    </motion.li>
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.nav>
      <Cart
        isOpen={showCart}
        onClose={closeCart}
        onSidebarClose={() => setIsOpen(false)}
      />
    </>
  );
}
