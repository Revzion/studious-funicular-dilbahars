"use client";
import AboutDilbahar from "@/components/About/About";
import Carousel from "@/components/About/CertificateCarousel";
import CertificationsShowcase from "@/components/About/Certification";
import Journey from "@/components/About/Journey";
import React, { useEffect, useRef } from "react";

const page = () => {
  const sectionsRef = useRef({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToSection = (sectionId) => {
      const element = sectionsRef.current[sectionId];
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace("#", "");
        // Wait for components to render
        setTimeout(() => {
          scrollToSection(targetId);
        }, 100);
      }
    };

    // Initial scroll on page load
    const timer = setTimeout(() => {
      handleHashChange();
    }, 200);

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br pt-16 from-emerald-50 via-teal-50 to-cyan-100">
      <AboutDilbahar />
      <div
        ref={(el) => (sectionsRef.current["journal-section"] = el)}
        id="journal-section"
      >
        <Journey />
      </div>
      <div
        ref={(el) => (sectionsRef.current["certifications-section"] = el)}
        id="certifications-section"
      >
        <Carousel />
      </div>
    </div>
  );
};

export default page;
