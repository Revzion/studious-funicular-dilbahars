"use client";

import {useState, useEffect, useCallback, useMemo} from "react";
import {
  ShoppingCart,
  Leaf,
  X,
  Candy,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {useSearchParams, useRouter, usePathname} from "next/navigation";
import debounce from "lodash/debounce";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import {getAllActiveProducts} from "@/services/productServices";
import {getCategoriesService} from "@/services/categoryServices";
import {Icon} from "@iconify/react";
// import { toast } from "../Toast/Toast";

export default function ProductList({onProductSelect}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const priceRanges = [
    {label: "Under ₹150", min: 0, max: 150},
    {label: "₹150 - ₹300", min: 150, max: 300},
    {label: "₹300 - ₹500", min: 300, max: 500},
    {label: "Above ₹500", min: 500, max: Infinity},
  ];

  const ratingOptions = [
    {label: "4.5 & above", value: 4.5},
    {label: "4.0 & above", value: 4.0},
    {label: "3.5 & above", value: 3.5},
    {label: "3.0 & above", value: 3.0},
  ];

  const sortOptions = [
    {label: "Featured", value: "featured"},
    {label: "Best Selling", value: "bestselling"},
    {label: "Price: Low to High", value: "price_asc"},
    {label: "Price: High to Low", value: "price_desc"},
    {label: "Rating: High to Low", value: "rating_desc"},
  ];

  const getInitialFilters = () => {
    const search = searchParams.get("q") || searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const categories = category ? [category] : [];
    return {
      search,
      categories,
      page: parseInt(searchParams.get("page")) || 1,
      limit: 12,
    };
  };

  const getInitialPriceRange = () => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice !== null || maxPrice !== null) {
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Infinity;
      return (
        priceRanges.find(
          (range) =>
            range.min === min &&
            (range.max === max || (max === Infinity && range.max === Infinity))
        ) || {
          label: `₹${min} - ${max === Infinity ? "Above" : "₹" + max}`,
          min,
          max,
        }
      );
    }
    return null;
  };

  const getInitialSort = () => {
    return searchParams.get("sort") || "featured";
  };

  const getInitialRating = () => {
    const rating = searchParams.get("rating");
    return rating ? parseFloat(rating) : null;
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [fullCategoryData, setFullCategoryData] = useState([]); // Add this new state
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryTitleToId, setCategoryTitleToId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(getInitialFilters());
  const [selectedPriceRange, setSelectedPriceRange] = useState(
    getInitialPriceRange()
  );
  const [selectedRating, setSelectedRating] = useState(getInitialRating());
  const [selectedSort, setSelectedSort] = useState(getInitialSort());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [fallbackProducts, setFallbackProducts] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [candyPositions, setCandyPositions] = useState([]);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return totalRating / reviews.length;
  };

  const updateURL = useCallback(
    (newFilters, newPriceRange, newRating, newSort, newPage) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set("q", newFilters.search);
      if (newFilters.categories && newFilters.categories.length > 0) {
        params.set("category", newFilters.categories[0]);
      }
      if (newPriceRange) {
        if (newPriceRange.min > 0)
          params.set("minPrice", newPriceRange.min.toString());
        if (newPriceRange.max !== Infinity)
          params.set("maxPrice", newPriceRange.max.toString());
      }
      if (newRating) params.set("rating", newRating.toString());
      if (newSort && newSort !== "featured") params.set("sort", newSort);
      const pageNum = newPage || newFilters.page;
      if (pageNum && pageNum > 1) params.set("page", pageNum.toString());
      params.set("limit", newFilters.limit.toString());

      const existingParams = new URLSearchParams(searchParams.toString());
      const preserveParams = ["age", "health", "flavor"];
      preserveParams.forEach((param) => {
        const value = existingParams.get(param);
        if (value) params.set(param, value);
      });

      const newURL = `${pathname}?${params.toString()}`;
      router.replace(newURL);
    },
    [pathname, router, searchParams]
  );

  const debouncedUpdateURL = useMemo(
    () => debounce(updateURL, 300),
    [updateURL]
  );

  useEffect(() => {
    const isCandySelected = filters.categories.includes("Candy");
    if (isCandySelected) {
      setCandyPositions(generateCandyPositions());
    }
  }, [filters.categories]);

  useEffect(() => {
    const isCandySelected = filters.categories.includes("Candy");
    if (isCandySelected) {
      setCandyPositions(generateCandyPositions());

      const handleScroll = () => {
        const candyElements = document.querySelectorAll(".candy-emoji");
        const scrollY = window.scrollY;

        candyElements.forEach((candy, index) => {
          const speed = 0.5 + index * 0.2;
          const yPos = scrollY * speed;
          const rotation = scrollY * (0.1 + index * 0.05);

          candy.style.transform = `translateY(${yPos}px) rotate(${rotation}deg) scale(${
            1 + Math.sin(scrollY * 0.01 + index) * 0.2
          })`;
          candy.classList.add("scroll-animated");
        });
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [filters.categories]);

  const handleFiltersChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      debouncedUpdateURL(
        newFilters,
        selectedPriceRange,
        selectedRating,
        selectedSort
      );
    },
    [selectedPriceRange, selectedRating, selectedSort, debouncedUpdateURL]
  );

  const handlePriceRangeChange = useCallback(
    (newPriceRange) => {
      setSelectedPriceRange(newPriceRange);
      const resetFilters = {...filters, page: 1};
      setFilters(resetFilters);
      debouncedUpdateURL(
        resetFilters,
        newPriceRange,
        selectedRating,
        selectedSort
      );
    },
    [filters, selectedRating, selectedSort, debouncedUpdateURL]
  );

  const handleRatingChange = useCallback(
    (newRating) => {
      setSelectedRating(newRating);
      const resetFilters = {...filters, page: 1};
      setFilters(resetFilters);
      debouncedUpdateURL(
        resetFilters,
        selectedPriceRange,
        newRating,
        selectedSort
      );
    },
    [filters, selectedPriceRange, selectedSort, debouncedUpdateURL]
  );

  const generateCandyPositions = () => {
    const candies = ["🍭", "🍬", "🍫"];
    const positions = [
      {id: 0, emoji: candies[0], top: 20, left: 10},
      {id: 1, emoji: candies[1], top: 20, left: 80},
      {id: 2, emoji: candies[2], top: 80, left: 50},
    ];
    return positions;
  };

  const handleSortChange = useCallback(
    (newSort) => {
      setSelectedSort(newSort);
      const resetFilters = {...filters, page: 1};
      setFilters(resetFilters);
      debouncedUpdateURL(
        resetFilters,
        selectedPriceRange,
        selectedRating,
        newSort
      );
    },
    [filters, selectedPriceRange, selectedRating, debouncedUpdateURL]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setPaginationLoading(true);
      const newFilters = {...filters, page: newPage};
      setFilters(newFilters);
      updateURL(
        newFilters,
        selectedPriceRange,
        selectedRating,
        selectedSort,
        newPage
      );
    },
    [filters, selectedPriceRange, selectedRating, selectedSort, updateURL]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply rating filter
    if (selectedRating) {
      result = result.filter((product) => {
        const avgRating = calculateAverageRating(product.reviews);
        return avgRating >= selectedRating;
      });
    }


    // Apply sorting
    switch (selectedSort) {
      case "price_asc":
        result.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
        break;
      case "price_desc":
        result.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
        break;
      case "rating_desc":
        result.sort((a, b) => {
          const ratingA = calculateAverageRating(a.reviews);
          const ratingB = calculateAverageRating(b.reviews);
          return ratingB - ratingA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedSort, selectedRating]);

  const fetchProducts = useCallback(
    async (filters) => {
      try {
        const categoryId =
          filters.categories.length > 0
            ? categoryTitleToId[filters.categories[0]]
            : undefined;
        const params = {
          search: filters.search || undefined,
          category: categoryId || undefined,
          page: filters.page,
          limit: filters.limit,
          minRating: selectedRating || undefined,
          minPrice: selectedPriceRange?.min,
          maxPrice:
            selectedPriceRange?.max === Infinity
              ? undefined
              : selectedPriceRange?.max,
          bestSaling: selectedSort === "bestselling" ? true : undefined,
          sortPrice:
            selectedSort === "price_asc"
              ? "asc"
              : selectedSort === "price_desc"
              ? "desc"
              : undefined,
          sortRating: selectedSort === "rating_desc" ? "desc" : undefined,
          // Help Me Choose params → backend

          age: searchParams.get("age") || undefined,
          health: searchParams.get("health") || undefined,
          flavor: searchParams.get("flavor") || undefined,
        };

        const response = await getAllActiveProducts(params);
        // console.log("active products", response);
        return {
          products: response.results || [],
          total: response.total || 0,
        };
      } catch (err) {
        throw new Error(err.error || "Failed to fetch products");
      }
    },
    [categoryTitleToId, selectedPriceRange, selectedSort, selectedRating, searchParams]
  );

  useEffect(() => {
    const loadFallbackProducts = async () => {
      try {
        const res = await getAllActiveProducts({limit: 6});
        setFallbackProducts(res.results || []);
      } catch (err) {
        console.error("Failed to load fallback products", err);
      }
    };

    if (filteredProducts.length === 0) {
      loadFallbackProducts();
    }
  }, [filteredProducts]);

  const debouncedFetchProducts = useMemo(
    () =>
      debounce(async (filters, callback) => {
        try {
          const {products, total} = await fetchProducts(filters);
          callback(null, {products, total});
        } catch (err) {
          callback(err, null);
        }
      }, 500),
    [fetchProducts]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesResponse = await getCategoriesService();
        console.log("categoriesResponse", categoriesResponse);

        if (!isMounted) return;

        let categoryList;
        if (categoriesResponse?.data?.data?.categories) {
          categoryList = categoriesResponse.data.data.categories;
        } else if (categoriesResponse?.data?.categories) {
          categoryList = categoriesResponse.data.categories;
        } else if (categoriesResponse?.categories) {
          categoryList = categoriesResponse.categories;
        } else if (Array.isArray(categoriesResponse?.data)) {
          categoryList = categoriesResponse.data;
        } else if (Array.isArray(categoriesResponse)) {
          categoryList = categoriesResponse;
        }

        // Store full category data
        setFullCategoryData(categoryList);

        const categoryIdToTitle = {};
        const categoryTitleToIdMap = {};
        const activeCategoryTitles = [];

        categoryList.forEach((cat) => {
          if (cat && cat._id && cat.isActive !== false) {
            const title =
              cat.title || cat.categoryName || cat.name || "Unknown Category";
            categoryIdToTitle[cat._id] = title;
            categoryTitleToIdMap[title] = cat._id;
            activeCategoryTitles.push(title);
          }
        });

        setCategories(activeCategoryTitles);
        setCategoryMap(categoryIdToTitle);
        setCategoryTitleToId(categoryTitleToIdMap);
        // Store full category data
        setFullCategoryData(categoryList);

        // toast.success(categoriesResponse?.message || "Categories fetched successfully");

        // Build initial filters
        const initialFilters = {
          search: searchParams.get("search") || "",
          categories: [],
          page: parseInt(searchParams.get("page")) || 1,
          limit: 12,
        };

        const categoryTitle = searchParams.get("category");
        const categoryId = searchParams.get("categoryId");
        if (categoryTitle && categoryTitleToIdMap[categoryTitle]) {
          initialFilters.categories = [categoryTitle];
        } else if (categoryId && categoryIdToTitle[categoryId]) {
          initialFilters.categories = [categoryIdToTitle[categoryId]];
        }

        // setFilters(initialFilters);

        // Fetch products
        const productsResponse = await fetchProducts({
          ...initialFilters,
          categoryId: searchParams.get("categoryId"),
        });

        if (!isMounted) return;

        setProducts(productsResponse.products);
        setTotal(productsResponse.total);
        setIsInitialLoad(false);
        // setIsDataLoaded(true);

        // toast.success(productsResponse?.message || "Products fetched successfully");
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch data");
          // toast.error(err.message || "Failed to fetch data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
      debouncedFetchProducts.cancel();
    };
  }, []);

  useEffect(() => {
    if (isInitialLoad) return;

    const newSearch = searchParams.get("search") || "";
    const categoryTitle = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");

    setFilters((prev) => {
      const newFilters = {
  ...prev,
  search: newSearch,
  page: parseInt(searchParams.get("page")) || prev.page,
};

      if (categoryTitle && categoryTitleToId[categoryTitle]) {
        newFilters.categories = [categoryTitle];
      } else if (categoryId && categoryMap[categoryId]) {
        newFilters.categories = [categoryMap[categoryId]];
      } else {
        newFilters.categories = [];
      }
      return newFilters;
    });
  }, [
    searchParams.get("search"),
    searchParams.get("category"),
    searchParams.get("categoryId"),
    isInitialLoad,
    categoryMap,
    categoryTitleToId,
  ]);

  useEffect(() => {
    if (isInitialLoad) return;

    setPaginationLoading(true);

    const timeoutId = setTimeout(() => {
      // setLoading(true);
      debouncedFetchProducts(filters, (err, result) => {
        if (err) {
          setError(err.message);
          setLoading(false);
          setPaginationLoading(false);
          // toast.error(err.message || "Failed to fetch products");
          return;
        }
        setProducts(result.products);
        setTotal(result.total);
        setLoading(false);
        setPaginationLoading(false);
        // toast.success(result?.message || "Products fetched successfully");
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
    filters.search,
    filters.categories.join(","),
    filters.page,
    selectedPriceRange?.min,
    selectedPriceRange?.max,
    selectedRating,
    selectedSort,
    debouncedFetchProducts,
    isInitialLoad,
  ]);

  const getMinimumPrice = (product) => {
    return product.minPrice || 0;
  };

  const getMaxDiscount = (product) => {
    if (
      product.minPrice &&
      product.maxPrice &&
      product.maxPrice > product.minPrice
    ) {
      return ((product.maxPrice - product.minPrice) / product.maxPrice) * 100;
    }
    return 0;
  };

  const showNotification = (product) => {
    // setNotification({
    //   product,
    //   message: `${product.title || "Product"} added to cart!`,
    // });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    if (onProductSelect) onProductSelect(product);
  };

  const toggleCategory = useCallback(
    (categoryTitle) => {
      const newCategories = filters.categories.includes(categoryTitle)
        ? []
        : [categoryTitle];
      const newFilters = {...filters, categories: newCategories, page: 1};
      handleFiltersChange(newFilters);
    },
    [filters, handleFiltersChange]
  );

  const handleSearchChange = useCallback(
    (value) => {
      const newFilters = {...filters, search: value, page: 1};
      handleFiltersChange(newFilters);
    },
    [filters, handleFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {search: "", categories: [], page: 1, limit: 12};
    setFilters(clearedFilters);
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setSelectedSort("featured");

    const params = new URLSearchParams();
    const preserveParams = ["who", "goal", "taste"];
    preserveParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) params.set(param, value);
    });

    const newURL = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newURL);
  }, [pathname, router, searchParams]);

  // useEffect(() => {
  //   if (isInitialLoad) return;

  //   const newFilters = getInitialFilters();
  //   const newPriceRange = getInitialPriceRange();
  //   const newRating = getInitialRating();
  //   const newSort = getInitialSort();

  //   if (JSON.stringify(newFilters) !== JSON.stringify(filters))
  //     setFilters(newFilters);
  //   if (JSON.stringify(newPriceRange) !== JSON.stringify(selectedPriceRange)) {
  //     setSelectedPriceRange(newPriceRange);
  //   }
  //   if (newRating !== selectedRating) setSelectedRating(newRating);
  //   if (newSort !== selectedSort) setSelectedSort(newSort);
  // }, [searchParams]);

  const totalPages = Math.ceil(total / filters.limit);

  if (loading && !isDataLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-lime-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 min-h-screen flex items-center justify-center">
        <motion.div
          className="bg-white rounded-xl p-8 text-center shadow-md max-w-md"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
        >
          <X size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-green-600 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen relative">
      {filters.categories.includes("Candy") && (
        <div className="candy-background">
          {candyPositions.map((candy) => (
            <div
              key={candy.id}
              className="candy-emoji"
              style={{
                top: `${candy.top}%`,
                left: `${candy.left}%`,
              }}
            >
              {candy.emoji}
            </div>
          ))}
        </div>
      )}
      <div className="w-full bg-blue-50 pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{y: -50, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay: 0.2}}
          >
            <motion.div
              className="inline-flex items-center mb-3"
              initial={{rotate: -5}}
              animate={{rotate: 0}}
              transition={{delay: 0.3}}
            >
              {(() => {
                // Get the currently selected category
                const selectedCategoryTitle =
                  filters.categories.length > 0 ? filters.categories[0] : null;
                const selectedCategoryData = selectedCategoryTitle
                  ? fullCategoryData.find(
                      (c) => c.title === selectedCategoryTitle
                    )
                  : null;

                // Show icon if category has one, otherwise show Leaf
                return selectedCategoryData?.icon ? (
                  <Icon
                    icon={selectedCategoryData.icon}
                    className="w-8 h-8 text-green-600 mr-2"
                  />
                ) : (
                  <Leaf size={32} className="text-green-600 mr-2" />
                );
              })()}

              <h1 className="py-1 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 text-transparent bg-clip-text">
                {searchParams.get("who") ||
                searchParams.get("goal") ||
                searchParams.get("taste")
                  ? "Your Flavor"
                  : filters.categories.length > 0
                  ? filters.categories[0]
                  : "Fresh Delights"}
              </h1>
            </motion.div>

            <motion.div
              className="w-24 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mx-auto mb-2"
              initial={{width: 0}}
              animate={{width: 96}}
              transition={{delay: 0.4, duration: 0.8}}
            />
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.categories.includes(cat)
                      ? "bg-teal-500 text-white"
                      : "bg-white text-teal-700 border border-teal-200 hover:border-teal-300"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="lg:hidden sticky top-24 z-30">
        <FilterSidebar
          selectedCategories={filters.categories}
          setSelectedCategories={(categories) =>
            setFilters((prev) => ({...prev, categories, page: 1}))
          }
          selectedPriceRange={selectedPriceRange}
          setSelectedPriceRange={setSelectedPriceRange}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          allCategories={categories}
          priceRanges={priceRanges}
          ratingOptions={ratingOptions}
          sortOptions={sortOptions}
          clearAllFilters={clearAllFilters}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-36">
              <FilterSidebar
                selectedCategories={filters.categories}
                setSelectedCategories={(categories) => {
                  const newFilters = {...filters, categories, page: 1};
                  handleFiltersChange(newFilters);
                }}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={handlePriceRangeChange}
                selectedRating={selectedRating}
                setSelectedRating={handleRatingChange}
                selectedSort={selectedSort}
                setSelectedSort={handleSortChange}
                allCategories={categories}
                priceRanges={priceRanges}
                ratingOptions={ratingOptions}
                sortOptions={sortOptions}
                clearAllFilters={clearAllFilters}
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <motion.div
              className="mb-6 flex flex-wrap items-center gap-2"
              initial={{y: 20, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{delay: 0.5}}
            >
              <div className="text-blue-800 font-medium">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
                {selectedSort === "bestselling" && (
                  <span className="ml-2 inline-flex items-center text-xs bg-gradient-to-r from-green-500 to-teal-500 text-white px-2 py-1 rounded-full">
                    <TrendingUp size={12} className="mr-1" />
                    Best Sellers First
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center"
                  >
                    {cat}
                    <X size={14} className="ml-1" />
                  </button>
                ))}
                {selectedPriceRange && (
                  <button
                    onClick={() => setSelectedPriceRange(null)}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center"
                  >
                    {selectedPriceRange.label}
                    <X size={14} className="ml-1" />
                  </button>
                )}
                {selectedRating && (
                  <button
                    onClick={() => setSelectedRating(null)}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center"
                  >
                    {
                      ratingOptions.find((opt) => opt.value === selectedRating)
                        ?.label
                    }
                    <X size={14} className="ml-1" />
                  </button>
                )}
              </div>
            </motion.div>

            <div className="pb-10">
              {paginationLoading ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-[50vh]"
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{duration: 0.3}}
                >
                  <motion.div
                    className="relative"
                    animate={{rotate: 360}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={48} className="text-teal-500" />
                    {/* <Candy
                      size={24}
                      className="absolute top-0 left-0 text-blue-500 animate-pulse"
                    /> */}
                  </motion.div>
                  <p className="text-blue-800 font-medium mt-4">
                    Fetching products... 
                  </p>
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                // <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 justify-items-center">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id || product.id || index}
                      initial={{opacity: 0, y: 50}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: 0.1 * (index % 6), duration: 0.5}}
                      className="h-full relative mx-auto"
                    >
                      <ProductCard
                        product={product}
                        onClick={() => handleProductSelect(product)}
                        onAddToCart={() => showNotification(product)}
                        isBestSelling={product.bestSaling}
                      />
                      {product.bestSaling && (
                        <motion.div
                          className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg z-20"
                          initial={{scale: 0, rotate: -45}}
                          animate={{scale: 1, rotate: 0}}
                          transition={{
                            delay: 0.2 * index,
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                          }}
                          whileHover={{scale: 1.1, rotate: 5}}
                        >
                          <Award size={12} className="mr-1" />
                          Best Seller
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <>
                  <motion.div
                    className="bg-white rounded-lg p-4 text-center shadow-sm mb-3"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.3}}
                  >
                    <Candy size={24} className="text-blue-300 mx-auto mb-1" />
                    <h3 className="text-base font-medium text-blue-800 mb-1">
                      No products found
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      Adjust filters to find products.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1 rounded-md font-medium hover:from-blue-600 hover:to-green-600 transition-all text-sm"
                    >
                      Clear Filters
                    </button>
                  </motion.div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      You may like these instead:
                    </h3>
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:justify-items-center"> */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 justify-items-center">
                      {fallbackProducts.map((product, index) => (
                        <motion.div
                          key={product._id || product.id || index}
                          initial={{opacity: 0, y: 50}}
                          animate={{opacity: 1, y: 0}}
                          transition={{
                            delay: 0.1 * (index % 6),
                            duration: 0.5,
                          }}
                          className="h-full relative mx-auto"
                        >
                          <ProductCard
                            product={product}
                            onClick={() => handleProductSelect(product)}
                            onAddToCart={() => showNotification(product)}
                            isBestSelling={product.bestSaling}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1 || paginationLoading}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-blue-800 font-medium">
                  Page {filters.page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages || paginationLoading}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {notification && <NotificationToast notification={notification} />}
      </AnimatePresence>
    </div>
  );
}

function NotificationToast({notification}) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{opacity: 0, y: 50, scale: 0.3}}
      animate={{opacity: 1, y: 0, scale: 1}}
      exit={{opacity: 0, scale: 0.5, transition: {duration: 0.2}}}
      transition={{type: "spring", stiffness: 400, damping: 15}}
    >
      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center max-w-md">
        <ShoppingCart className="mr-3 flex-shrink-0" size={20} />
        <div>
          <p className="font-medium">{notification.message}</p>
          <p className="text-xs text-white text-opacity-80 mt-1">
            Product added successfully!
          </p>
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0"
          animate={{opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5]}}
          transition={{duration: 1.5, repeat: Infinity, ease: "easeInOut"}}
        >
          <Candy size={14} className="text-green-500" />
        </motion.div>
      </div>
    </motion.div>
  );
}
