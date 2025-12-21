import { useState, useEffect } from "react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-8 right-8 z-50 group"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(100px)",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.3s ease-in-out",
          }}
          aria-label="Back to top"
        >
          <div
            className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 shadow-lg hover:shadow-xl border-2 border-white/30 backdrop-blur-sm transition-all duration-300 ease-in-out flex items-center justify-center"
            style={{
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              boxShadow: isHovered
                ? "0 20px 40px -10px rgba(59, 130, 246, 0.4), 0 10px 25px -5px rgba(20, 184, 166, 0.3)"
                : "0 10px 20px -5px rgba(59, 130, 246, 0.3), 0 4px 10px -2px rgba(20, 184, 166, 0.2)",
            }}
          >
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 transition-all duration-300 ${
                isHovered ? "opacity-30 scale-125" : "opacity-0 scale-100"
              }`}
            ></div>

            <svg
              className={`w-6 h-6 text-white transition-all duration-300 relative z-10 ${
                isHovered ? "transform -translate-y-0.5" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>

          {/* Tooltip */}
          <div
            className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800/90 text-white text-sm rounded-lg backdrop-blur-sm transition-all duration-300 whitespace-nowrap ${
              isHovered
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-2 pointer-events-none"
            }`}
          >
            Back to top
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800/90"></div>
          </div>

          {/* Ripple effect on click */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="ripple absolute inset-0 bg-white/30 rounded-full transform scale-0 group-active:animate-ping"></div>
          </div>
        </button>
      )}

      <style jsx>{`
        .ripple {
          animation-duration: 0.6s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .group:hover .ripple {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default BackToTopButton;
