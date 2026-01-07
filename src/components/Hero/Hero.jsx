"use client";
import React, { useState, useEffect } from "react";
import { getCarouselImages } from "@/services/carouselService";
import { ExternalLink } from "lucide-react";

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]); // Array of { url, link_url, ... }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      setLoading(true);
      try {
        const res = await getCarouselImages();
        const fetchedImages = res?.carousel?.images || [];

        if (fetchedImages.length === 0) {
          setImages([{ url: "/hero2.png", link_url: "" }]);
        } else {
          setImages(fetchedImages);
        }
      } catch (err) {
        console.error("Failed to fetch carousel images:", err);
        setImages([{ url: "/hero2.png", link_url: "" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToSlide = (i) => setCurrentIndex(i);

  const handleImageClick = (link_url) => {
    if (link_url && link_url.trim()) {
      window.open(link_url.trim(), "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-100 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full" style={{ paddingTop: "39.0625%" }}>
        {/* Slides */}
        {images.map((imageObj, index) => {
          const { url, link_url } = imageObj;
          const hasLink = link_url && link_url.trim() !== "";

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={url}
                alt={`Dilbahars Banner ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain object-center"
                onError={(e) => (e.target.src = "/hero2.png")}
                loading={index === 0 ? "eager" : "lazy"}
              />

              {/* Click Button - Only if link exists */}
              {hasLink && index === currentIndex && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-4 w-full max-w-md">
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(link_url);
                      }}
                      className="
          inline-flex items-center justify-center gap-2 
          px-4 py-1.5 
          sm:px-4 sm:py-1.5 
          md:px-6 md:py-2 
          lg:px-8 lg:py-3 
          bg-white hover:bg-gray-100 
          text-gray-900 font-semibold 
          text-sm sm:text-base md:text-lg 
          rounded-xl 
          shadow-2xl 
          transition-all duration-300 
          hover:scale-105 active:scale-95 
          whitespace-nowrap
        "
                    >
                      <span>Visit Now</span>
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Optional: Subtle overlay gradient for better button visibility */}
              {hasLink && index === currentIndex && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              )}
            </div>
          );
        })}

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(i);
                }}
                className={`transition-all ${
                  i === currentIndex
                    ? "w-10 h-3 bg-white rounded-full shadow-md"
                    : "w-3 h-3 bg-white/70 hover:bg-white rounded-full"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Desktop Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-2xl z-30 transition-all hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-2xl z-30 transition-all hover:scale-110"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </>
        )}
      </div>
    </div>
  );
}
