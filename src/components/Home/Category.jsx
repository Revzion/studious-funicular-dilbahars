import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { getCategoriesService } from "../../services/categoryServices";

const CategoryCard = ({ title, imageSrc, color, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBackgroundColor = () => {
    switch (color) {
      case "blue":
        return "bg-blue-100";
      case "green":
        return "bg-green-100";
      case "teal":
        return "bg-teal-100";
      case "cyan":
        return "bg-cyan-100";
      default:
        return "bg-white";
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case "blue":
        return "border-blue-300";
      case "green":
        return "border-green-300";
      case "teal":
        return "border-teal-300";
      case "cyan":
        return "border-cyan-300";
      default:
        return "border-gray-200";
    }
  };

  const getOverlayGradient = () => {
    switch (color) {
      case "blue":
        return "from-blue-400/40 to-blue-600/60";
      case "green":
        return "from-green-400/40 to-green-600/60";
      case "teal":
        return "from-teal-400/40 to-teal-600/60";
      case "cyan":
        return "from-cyan-400/40 to-cyan-600/60";
      default:
        return "from-gray-400/40 to-gray-600/60";
    }
  };

  const displayTitle = title;

  return (
    <Link href={`/products?category=${encodeURIComponent(title)}`}>
      <div
        className={`rounded-xl border-2 ${getBorderColor()} overflow-hidden transition-all duration-300 ease-in-out cursor-pointer relative group h-full shadow-md hover:shadow-xl`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Full Image Background */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {/* Base gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

          {/* Hover overlay with category-specific gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${getOverlayGradient()} transition-all duration-500 ease-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Content overlay - only visible on hover */}
            <div
              className={`absolute inset-0 flex flex-col justify-center items-center text-center p-6 transition-all duration-500 ease-out ${
                isHovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              {/* Category Icon */}
              {icon && (
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4 transform transition-transform duration-300 hover:scale-110">
                  {icon}
                </div>
              )}

              {/* Category Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                {displayTitle}
              </h3>

              {/* Explore Button */}
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 text-white font-medium hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-2">
                  Explore Collection
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ShopByCategory() {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback image if API doesn't provide one
  const fallbackImage =
    "https://dilbahars.com/wp-content/uploads/2024/09/3.png";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesService();
        const fetchedCategories = response.data.categories.map((category) => ({
          title: category.title,
          imageSrc: category.image?.url || fallbackImage,
        }));
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="bg-blue-50 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-3 text-center">
            Shop by Category
          </h2>
          <p className="text-teal-600 text-center mb-6">
            From classic suparis to zesty digestives and delightful candies —
            browse our flavorful collections made to satisfy every craving.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 gap-6 snap-x custom-scrollbar scroll-smooth"
          >
            {categories.map((category, index) => (
              <div key={index} className="flex-shrink-0 w-80 h-56 snap-center">
                <CategoryCard
                  title={category.title}
                  imageSrc={category.imageSrc}
                  color={category.color}
                  icon={category.icon}
                />
              </div>
            ))}
          </div>

          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 hidden md:block">
            <button
              onClick={scrollLeft}
              className="rounded-full bg-blue-100 shadow-lg p-2 hover:bg-blue-200 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 hidden md:block">
            <button
              onClick={scrollRight}
              className="rounded-full bg-blue-100 shadow-lg p-2 hover:bg-blue-200 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
