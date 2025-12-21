"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllBlogs } from "@/services/blogServices";

const BlogListPage = ({ hero }) => {
  const scrollRef = useRef(null);
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const basePt = hero ? "pt-16 md:pt-16 lg:pt-16" : "pt-20 md:pt-20 lg:pt-28";

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  const handleNavigate = () => {
    router.push("/blog");
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        // console.log("Fetched blogs:", data);
        setBlogs(data.blogs || data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div
      className={`bg-gradient-to-br pb-16 ${basePt} from-emerald-50 via-teal-50 to-cyan-100`}
    >
      {!hero ? (
        <section className={`bg-[#EFFFFA] px-4 md:px-8 lg:px-16`}>
          <div className="text-center mb-10 mt-13">
            <h2 className="text-3xl font-bold text-indigo-900">Our Blog</h2>
            <p className="text-teal-600 text-base sm:text-lg font-medium mt-2">
              Discover traditional recipes, health benefits, and cultural
              insights from the world of natural wellness
            </p>
          </div>
        </section>
      ) : (
        <div className="px-4 max-w-7xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
                Our Blog
              </h2>
              <p className="text-teal-600 mt-2">
                Discover traditional recipes, health benefits, and cultural
                insights
              </p>
            </div>
            <button
              onClick={handleNavigate}
              className="group bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden w-fit"
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Articles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4">
        {hero && (
          <div className="hidden md:block">
            <button
              onClick={scrollLeft}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 rounded-full bg-blue-100 shadow-lg p-2 hover:bg-blue-200 transition-all text-teal-600 pointer-events-auto"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={scrollRight}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 rounded-full bg-blue-100 shadow-lg p-2 hover:bg-blue-200 transition-all text-teal-600 pointer-events-auto"
            >
              <ChevronRight />
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No blog posts found.
          </p>
        ) : (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 gap-4 snap-x custom-scrollbar scroll-smooth"
          >
            {blogs.map((post) => (
              <Link href={`/blog/${post.customUrl}`} key={post._id}>
                <div
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 cursor-pointer h-[420px] flex flex-col min-w-[293px] flex-shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="relative overflow-hidden flex-shrink-0">
                    <img
                      src={post.image?.url || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* <div className="absolute top-2 left-2">
                      <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        {post.tags?.[0] || "General"}
                      </span>
                    </div> */}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2 flex-shrink-0">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
