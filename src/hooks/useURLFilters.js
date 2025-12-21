import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import debounce from 'lodash/debounce';

export const useURLFilters = (defaultFilters = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL parameters into filter state
  const parseURLParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    return {
      search: params.get('q') || params.get('search') || defaultFilters.search || '',
      categories: params.get('category') ? [params.get('category')] : defaultFilters.categories || [],
      priceRange: getPriceRangeFromParams(params),
      rating: params.get('rating') ? parseFloat(params.get('rating')) : defaultFilters.rating || null,
      sort: params.get('sort') || defaultFilters.sort || 'featured',
      page: parseInt(params.get('page')) || defaultFilters.page || 1,
      limit: parseInt(params.get('limit')) || defaultFilters.limit || 12,
    };
  }, [searchParams, defaultFilters]);

  const getPriceRangeFromParams = (params) => {
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    
    if (minPrice !== null || maxPrice !== null) {
      return {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : Infinity,
      };
    }
    return defaultFilters.priceRange || null;
  };

  // Initialize filters from URL
  const [filters, setFilters] = useState(() => parseURLParams());

  // Update URL function
  const updateURL = useCallback((newFilters, options = {}) => {
    const params = new URLSearchParams();
    const { replace = true, preserveParams = [] } = options;

    // Add search query
    if (newFilters.search) {
      params.set('q', newFilters.search);
    }

    // Add single category
    if (newFilters.categories && newFilters.categories.length > 0) {
      params.set('category', newFilters.categories[0]);
    }

    // Add price range
    if (newFilters.priceRange) {
      if (newFilters.priceRange.min > 0) {
        params.set('minPrice', newFilters.priceRange.min.toString());
      }
      if (newFilters.priceRange.max !== Infinity) {
        params.set('maxPrice', newFilters.priceRange.max.toString());
      }
    }

    // Add rating
    if (newFilters.rating) {
      params.set('rating', newFilters.rating.toString());
    }

    // Add sort (only if not default)
    if (newFilters.sort && newFilters.sort !== 'featured') {
      params.set('sort', newFilters.sort);
    }

    // Add page (only if not first page)
    if (newFilters.page && newFilters.page > 1) {
      params.set('page', newFilters.page.toString());
    }

    // Add limit if different from default
    if (newFilters.limit && newFilters.limit !== 12) {
      params.set('limit', newFilters.limit.toString());
    }

    // Preserve specified parameters
    const existingParams = new URLSearchParams(searchParams.toString());
    preserveParams.forEach(param => {
      const value = existingParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });

    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    
    if (replace) {
      router.replace(newURL);
    } else {
      router.push(newURL);
    }
  }, [pathname, router, searchParams]);

  // Debounced URL update
  const debouncedUpdateURL = useMemo(
    () => debounce(updateURL, 300),
    [updateURL]
  );

  // Update filters and URL
  const updateFilters = useCallback((newFilters, options = {}) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    if (options.debounced !== false) {
      debouncedUpdateURL(updatedFilters, options);
    } else {
      updateURL(updatedFilters, options);
    }
  }, [filters, debouncedUpdateURL, updateURL]);

  // Individual filter updaters
  const updateSearch = useCallback((search) => {
    updateFilters({ search, page: 1 });
  }, [updateFilters]);

  const updateCategories = useCallback((categories) => {
    updateFilters({ categories, page: 1 });
  }, [updateFilters]);

  const updatePriceRange = useCallback((priceRange) => {
    updateFilters({ priceRange, page: 1 });
  }, [updateFilters]);

  const updateRating = useCallback((rating) => {
    updateFilters({ rating, page: 1 });
  }, [updateFilters]);

  const updateSort = useCallback((sort) => {
    updateFilters({ sort, page: 1 });
  }, [updateFilters]);

  const updatePage = useCallback((page) => {
    updateFilters({ page }, { debounced: false });
  }, [updateFilters]);

  const toggleCategory = useCallback((category) => {
    const newCategories = filters.categories.includes(category)
      ? [] // Deselect if already selected
      : [category]; // Select only this category
    updateCategories(newCategories);
  }, [filters.categories, updateCategories]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      categories: [],
      priceRange: null,
      rating: null,
      sort: 'featured',
      page: 1,
      limit: 12,
    };
    
    setFilters(clearedFilters);
    
    // Clear URL completely or preserve certain params
    const params = new URLSearchParams();
    const preserveParams = ['who', 'goal', 'taste'];
    
    const existingParams = new URLSearchParams(searchParams.toString());
    preserveParams.forEach(param => {
      const value = existingParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });
    
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newURL);
  }, [pathname, router, searchParams]);

  // Listen to URL changes (browser navigation)
  useEffect(() => {
    const newFilters = parseURLParams();
    
    // Only update if filters actually changed
    const hasChanged = Object.keys(newFilters).some(key => {
      if (key === 'categories') {
        return JSON.stringify(newFilters[key]) !== JSON.stringify(filters[key]);
      }
      if (key === 'priceRange') {
        return JSON.stringify(newFilters[key]) !== JSON.stringify(filters[key]);
      }
      return newFilters[key] !== filters[key];
    });
    
    if (hasChanged) {
      setFilters(newFilters);
    }
  }, [searchParams, parseURLParams]);

  // Generate query parameters for API calls
  const getAPIParams = useCallback(() => {
    const apiParams = {};
    
    if (filters.search) apiParams.search = filters.search;
    if (filters.categories.length > 0) apiParams.category = filters.categories[0];
    if (filters.priceRange) {
      apiParams.minPrice = filters.priceRange.min;
      if (filters.priceRange.max !== Infinity) {
        apiParams.maxPrice = filters.priceRange.max;
      }
    }
    if (filters.rating) apiParams.rating = filters.rating;
    if (filters.sort !== 'featured') apiParams.sort = filters.sort;
    apiParams.page = filters.page;
    apiParams.limit = filters.limit;
    
    return apiParams;
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      filters.categories.length > 0 ||
      filters.priceRange ||
      filters.rating ||
      (filters.sort && filters.sort !== 'featured')
    );
  }, [filters]);

  return {
    filters,
    updateFilters,
    updateSearch,
    updateCategories,
    updatePriceRange,
    updateRating,
    updateSort,
    updatePage,
    toggleCategory,
    clearAllFilters,
    getAPIParams,
    hasActiveFilters,
    searchParams: searchParams.toString(),
  };
};
