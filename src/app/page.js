"use client";
import BlogPosts from "@/components/Blog/Blog";
import HeroSection from "@/components/Hero/Hero";
import AboutDilbahar from "@/components/About/About";
import Bestseller from "@/components/Home/Bestseller";
import ShopByCategory from "@/components/Home/Category";
import Reviews from "@/components/Testimonial/Testimonial";
import React, { useEffect } from "react";
import HelpMeChoose from "@/components/HelpMeChoose/HelpMeChoose";
import NewArrival from "@/components/NewArrival/NewArrival";
import { useRouter } from "next/navigation";
import BlogListPage from "@/components/Home/BlogList";

const page = () => {
  const router = useRouter();

  // Replace the existing useEffect in your home page with this:
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace("#", "");

        const scrollToElement = (attempts = 10, delay = 100) => {
          const element = document.getElementById(targetId);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 50);
          } else if (attempts > 0) {
            setTimeout(() => scrollToElement(attempts - 1, delay), delay);
          }
        };

        scrollToElement();
      }
    };

    // Initial scroll after a short delay to ensure components are rendered
    const timer = setTimeout(() => {
      scrollToHash();
    }, 200);

    // Handle hash changes
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <div className="bg-gray-200 ">
      <HeroSection />
      <ShopByCategory />
      <AboutDilbahar hero={true} />
      <HelpMeChoose />
      <NewArrival />
      <Bestseller />
      <BlogListPage hero={true} />
      <Reviews hero={true} id="reviews-section" />
    </div>
  );
};

export default page;
