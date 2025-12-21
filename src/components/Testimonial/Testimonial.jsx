"use client";
import React, { useRef, useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAllTestimonials } from "@/services/testimonialServices";

function Reviews({ hero, id }) {
  const [testimonial, setTestimonial] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const data = await getAllTestimonials();
        // console.log("Fetched data:", data);

        // ✅ Adjust based on actual API response
        if (Array.isArray(data)) {
          setTestimonial(data);
        } else if (Array.isArray(data.testimonials)) {
          setTestimonial(data.testimonials);
        } else {
          console.error("Unexpected testimonial format", data);
          setTestimonial([]); // fallback
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      }
    };

    fetchTestimonial();
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -310, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 310, behavior: "smooth" });
  };

  return (
    <section id={id} className={`py-16 pt-${hero ? "16" : "48"} bg-[#CEFAFE]`}>
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-indigo-900 mb-2">
              Customer <span>Testimonials</span>
            </h2>
            <p className="text-lg text-teal-700 max-w-2xl mb-4">
              Discover what our valued customers have to say about our premium
              products
            </p>
          </div>
          {hero && (
            <Link
              href="/testmonials"
              className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-md font-medium hover:shadow-lg transition-all duration-300 text-sm w-fit"
            >
              See More Reviews
            </Link>
          )}
        </div>

        {hero ? (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 snap-x pb-6 scroll-smooth custom-scrollbar"
          >
            {testimonial.map((testimonial, index) => (
              <div
                key={index}
                className="bg-blue-50 p-5 min-w-[280px] md:min-w-[300px] h-[240px] rounded-lg shadow-md border-l-4 border-teal-500 hover:shadow-lg transition-all duration-300 snap-start flex flex-col"
              >
                <div className="flex items-center mb-4 text-blue-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>

                <div className="mb-4 relative flex-grow">
                  <Quote
                    size={24}
                    className="text-teal-600 absolute -top-2 -left-2 opacity-50"
                  />
                  <p className="text-teal-800 leading-relaxed relative z-10 pl-4 text-sm line-clamp-3">
                    "{testimonial.message}"
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                        {testimonial.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-teal-800 text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-blue-600">
                          {testimonial.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="text-xs py-1 px-3 bg-teal-100 text-teal-800 rounded-full w-fit">
                    {testimonial.product}
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {testimonial.map((testimonial, index) => (
              <div
                key={index}
                className="bg-blue-50 p-6 rounded-lg shadow-md border-l-4 border-teal-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4 text-blue-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <div className="mb-4 relative">
                  <Quote
                    size={24}
                    className="text-teal-200 absolute -top-2 -left-2 opacity-50"
                  />
                  <p className="text-teal-800 leading-relaxed relative z-10 pl-4 text-sm">
                    "{testimonial.message}"
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-teal-800 text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                  {/* <div className="text-xs py-1 px-3 bg-teal-100 text-teal-800 rounded-full">
                    {testimonial.product}
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Reviews;
