"use client";
import React, { useState, useEffect } from "react";
import { getCarouselImages } from "@/services/carouselService";

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      setLoading(true);
      try {
        const res = await getCarouselImages();
        const fetchedImages = res?.carousel?.images || [];

        if (fetchedImages.length === 0) {
          setImages(["/hero2.png"]);
        } else {
          setImages(fetchedImages.map((img) => img.url));
        }
      } catch (err) {
        console.error("Failed to fetch carousel images:", err);
        setImages(["/hero2.png"]);
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
      {/* THIS IS THE ONLY CORRECT WAY → Pure aspect ratio container */}
      <div className="relative  w-full" style={{ paddingTop: "39.0625%" }}>
        {/* 750 / 1920 = 39.0625% → Perfect 1920×750 ratio */}

        {/* Slides */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Dilbahars Banner ${index + 1}`}
              className="absolute inset-0 w-full h-full object-contain object-center"
              onError={(e) => (e.target.src = "/hero2.png")}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
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
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-2xl z-10 transition-all hover:scale-110"
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
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-2xl z-10 transition-all hover:scale-110"
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
