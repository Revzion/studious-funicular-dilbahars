"use client";
import {useState} from "react";
import {Filter, SortDesc, X, ChevronDown, ChevronUp, Star} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

export default function FilterSidebar({
  selectedCategories,
  setSelectedCategories,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedRating,
  setSelectedRating,
  selectedSort,
  setSelectedSort,
  allCategories,
  priceRanges,
  ratingOptions,
  sortOptions,
  clearAllFilters,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}) {
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isSortOpenMobile, setIsSortOpenMobile] = useState(false);
  const [isCategoryOpenMobile, setIsCategoryOpenMobile] = useState(false);
  const [isPriceOpenMobile, setIsPriceOpenMobile] = useState(false);
  const [isRatingOpenMobile, setIsRatingOpenMobile] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  const toggleCategory = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? []
      : [category];
    setSelectedCategories(newCategories);
    scrollToTop();
  };

  const togglePriceRange = (range) => {
    if (selectedPriceRange && selectedPriceRange.label === range.label) {
      setSelectedPriceRange(null);
    } else {
      setSelectedPriceRange(range);
    }
    scrollToTop();
  };

  const toggleRating = (rating) => {
    if (selectedRating === rating.value) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating.value);
    }
    scrollToTop();
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
    scrollToTop();
  };

  const handleClearAllFilters = () => {
    clearAllFilters();
    scrollToTop();
  };

  return (
    <>
      <div className="lg:hidden max-w-[1190px] mx-auto px-4 mb-4">
        <motion.button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center justify-center w-full py-3 bg-white rounded-xl shadow-md border border-teal-200"
          whileTap={{scale: 0.98}}
        >
          <Filter size={18} className="text-teal-600 mr-2" />
          <span className="font-medium text-teal-700">Filters & Sort</span>
          {mobileFiltersOpen ? (
            <ChevronUp size={18} className="ml-2" />
          ) : (
            <ChevronDown size={18} className="ml-2" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3}}
            className="lg:hidden max-w-[1190px] mx-auto px-4 mb-6"
          >
            <div className="bg-white rounded-xl shadow-md p-4 border border-teal-200">
              <div className="mb-4">
                <button
                  onClick={() => setIsSortOpenMobile(!isSortOpenMobile)}
                  className="flex items-center w-full font-semibold text-blue-800 mb-3"
                >
                  <SortDesc size={16} className="mr-2" />
                  Sort By
                  {isSortOpenMobile ? (
                    <ChevronUp size={16} className="ml-auto" />
                  ) : (
                    <ChevronDown size={16} className="ml-auto" />
                  )}
                </button>
                <AnimatePresence>
                  {isSortOpenMobile && (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: "auto", opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.2}}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 mb-2">
                        {sortOptions?.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              id={`mobile-sort-${option.value}`}
                              name="mobile-sort"
                              checked={selectedSort === option.value}
                              onChange={() => {
                                handleSortChange(option.value);
                                setMobileFiltersOpen(false);
                              }}
                              className="mr-3 accent-blue-500 w-4 h-4"
                            />
                            <label
                              htmlFor={`mobile-sort-${option.value}`}
                              className="text-sm text-blue-900 cursor-pointer flex-1"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {/* <div className="flex flex-wrap gap-2 mt-3">
                        {sortOptions?.map((option) => (
                          <button
                            key={`pill-${option.value}`}
                            onClick={() => {
                              handleSortChange(option.value);
                              setMobileFiltersOpen(false);
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              selectedSort === option.value
                                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                                : "bg-blue-50 text-blue-900 hover:bg-blue-100"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div> */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {allCategories && allCategories.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() =>
                      setIsCategoryOpenMobile(!isCategoryOpenMobile)
                    }
                    className="flex items-center w-full font-semibold text-blue-800 mb-3"
                  >
                    Categories
                    {isCategoryOpenMobile ? (
                      <ChevronUp size={16} className="ml-auto" />
                    ) : (
                      <ChevronDown size={16} className="ml-auto" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isCategoryOpenMobile && (
                      <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.2}}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mb-2">
                          {allCategories.map((category) => (
                            <div key={category} className="flex items-center">
                              <input
                                type="radio"
                                id={`mobile-category-${category}`}
                                name="mobile-category"
                                checked={selectedCategories.includes(category)}
                                onChange={() => {
                                  toggleCategory(category);
                                  setMobileFiltersOpen(false);
                                }}
                                className="mr-3 accent-teal-500 w-4 h-4"
                              />
                              <label
                                htmlFor={`mobile-category-${category}`}
                                className="text-sm text-blue-900 cursor-pointer flex-1"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                        {/* <div className="flex flex-wrap gap-2 mt-3">
                          {allCategories.map((category) => (
                            <button
                              key={`pill-${category}`}
                              onClick={() => {
                                toggleCategory(category);
                                setMobileFiltersOpen(false);
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                selectedCategories.includes(category)
                                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                                  : "bg-blue-50 text-blue-900 hover:bg-blue-100"
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div> */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {priceRanges && priceRanges.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setIsPriceOpenMobile(!isPriceOpenMobile)}
                    className="flex items-center w-full font-semibold text-blue-800 mb-3"
                  >
                    Price Range
                    {isPriceOpenMobile ? (
                      <ChevronUp size={16} className="ml-auto" />
                    ) : (
                      <ChevronDown size={16} className="ml-auto" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isPriceOpenMobile && (
                      <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.2}}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mb-2">
                          {priceRanges.map((range) => (
                            <div
                              key={range.label}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                id={`mobile-price-${range.label}`}
                                name="mobile-price"
                                checked={
                                  selectedPriceRange &&
                                  selectedPriceRange.label === range.label
                                }
                                onChange={() => {
                                  togglePriceRange(range);
                                  setMobileFiltersOpen(false);
                                }}
                                className="mr-3 accent-teal-500 w-4 h-4"
                              />
                              <label
                                htmlFor={`mobile-price-${range.label}`}
                                className="text-sm text-blue-900 cursor-pointer flex-1"
                              >
                                {range.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        {/* <div className="flex flex-wrap gap-2 mt-3">
                          {priceRanges.map((range) => (
                            <button
                              key={`pill-${range.label}`}
                              onClick={() => {
                                togglePriceRange(range);
                                setMobileFiltersOpen(false);
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                selectedPriceRange &&
                                selectedPriceRange.label === range.label
                                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                                  : "bg-blue-50 text-blue-900 hover:bg-blue-100"
                              }`}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div> */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {ratingOptions && ratingOptions.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setIsRatingOpenMobile(!isRatingOpenMobile)}
                    className="flex items-center w-full font-semibold text-blue-800 mb-3"
                  >
                    Rating
                    {isRatingOpenMobile ? (
                      <ChevronUp size={16} className="ml-auto" />
                    ) : (
                      <ChevronDown size={16} className="ml-auto" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isRatingOpenMobile && (
                      <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.2}}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mb-2">
                          {ratingOptions.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                id={`mobile-rating-${option.value}`}
                                name="mobile-rating"
                                checked={selectedRating === option.value}
                                onChange={() => {
                                  toggleRating(option);
                                  setMobileFiltersOpen(false);
                                }}
                                className="mr-3 accent-yellow-500 w-4 h-4"
                              />
                              <label
                                htmlFor={`mobile-rating-${option.value}`}
                                className="text-sm text-blue-900 cursor-pointer flex items-center flex-1"
                              >
                                {option.label}
                                <span className="ml-1 flex">
                                  <Star
                                    size={12}
                                    className="text-yellow-400 fill-yellow-400"
                                  />
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                        {/* <div className="flex flex-wrap gap-2 mt-3">
                          {ratingOptions.map((option) => (
                            <button
                              key={`pill-${option.value}`}
                              onClick={() => {
                                toggleRating(option);
                                setMobileFiltersOpen(false);
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center ${
                                selectedRating === option.value
                                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                                  : "bg-blue-50 text-blue-900 hover:bg-blue-100"
                              }`}
                            >
                              {option.label}
                              <Star
                                size={12}
                                className="ml-1 text-yellow-400 fill-yellow-400"
                              />
                            </button>
                          ))}
                        </div> */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <motion.button
                onClick={() => {
                  handleClearAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-200"
                whileTap={{scale: 0.98}}
              >
                Clear All Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="hidden lg:block w-64 shrink-0"
        initial={{x: -50, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        transition={{delay: 0.4}}
      >
        <div className="bg-white rounded-2xl p-4 shadow-md sticky top-24 border border-teal-100 overflow-y-auto h-[calc(100vh-6rem)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-blue-800 text-lg flex items-center">
              <Filter size={18} className="mr-2" /> Filters
            </h2>
            <button
              onClick={handleClearAllFilters}
              className="text-xs text-teal-600 hover:text-teal-700 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center w-full font-semibold text-blue-900 mb-3"
            >
              <SortDesc size={16} className="mr-2" />
              Sort By
              {isSortOpen ? (
                <ChevronUp size={16} className="ml-auto" />
              ) : (
                <ChevronDown size={16} className="ml-auto" />
              )}
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{duration: 0.2}}
                >
                  <div className="space-y-2">
                    {sortOptions?.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          id={`desktop-sort-${option.value}`}
                          name="desktop-sort"
                          checked={selectedSort === option.value}
                          onChange={() => handleSortChange(option.value)}
                          className="mr-2 accent-blue-500"
                        />
                        <label
                          htmlFor={`desktop-sort-${option.value}`}
                          className="text-sm text-blue-900 cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {allCategories && allCategories.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center w-full font-semibold text-blue-900 mb-3"
              >
                Categories
                {isCategoryOpen ? (
                  <ChevronUp size={16} className="ml-auto" />
                ) : (
                  <ChevronDown size={16} className="ml-auto" />
                )}
              </button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.2}}
                  >
                    <div className="space-y-2">
                      {allCategories.map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            type="radio"
                            id={`desktop-category-${category}`}
                            name="desktop-category"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="mr-2 accent-green-500"
                          />
                          <label
                            htmlFor={`desktop-category-${category}`}
                            className="text-sm text-blue-900 cursor-pointer"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {priceRanges && priceRanges.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="flex items-center w-full font-semibold text-blue-900 mb-3"
              >
                Price Range
                {isPriceOpen ? (
                  <ChevronUp size={16} className="ml-auto" />
                ) : (
                  <ChevronDown size={16} className="ml-auto" />
                )}
              </button>
              <AnimatePresence>
                {isPriceOpen && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.2}}
                  >
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <div key={range.label} className="flex items-center">
                          <input
                            type="radio"
                            id={`desktop-price-${range.label}`}
                            name="desktop-price"
                            checked={
                              selectedPriceRange &&
                              selectedPriceRange.label === range.label
                            }
                            onChange={() => togglePriceRange(range)}
                            className="mr-2 accent-green-500"
                          />
                          <label
                            htmlFor={`desktop-price-${range.label}`}
                            className="text-sm text-blue-900 cursor-pointer"
                          >
                            {range.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {ratingOptions && ratingOptions.length > 0 && (
            <div className="mb-12">
              <button
                onClick={() => setIsRatingOpen(!isRatingOpen)}
                className="flex items-center w-full font-semibold text-blue-900 mb-3"
              >
                Rating
                {isRatingOpen ? (
                  <ChevronUp size={16} className="ml-auto" />
                ) : (
                  <ChevronDown size={16} className="ml-auto" />
                )}
              </button>
              <AnimatePresence>
                {isRatingOpen && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.2}}
                  >
                    <div className="space-y-2">
                      {ratingOptions.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            id={`desktop-rating-${option.value}`}
                            name="desktop-rating"
                            checked={selectedRating === option.value}
                            onChange={() => toggleRating(option)}
                            className="mr-2 accent-green-500"
                          />
                          <label
                            htmlFor={`desktop-rating-${option.value}`}
                            className="text-sm text-blue-900 cursor-pointer flex items-center"
                          >
                            {option.label}
                            <span className="ml-1 flex">
                              <Star
                                size={12}
                                className="text-yellow-400 fill-yellow-400"
                              />
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
