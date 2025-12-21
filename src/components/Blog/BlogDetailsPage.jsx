"use client";
import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import parse, {domToReact} from "html-react-parser";
import {Calendar, Clock, ChevronLeft, Tag} from "lucide-react";
import {getBlogById} from "@/services/blogServices";

const BlogDetailsPage = () => {
  const {slug: blogId} = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState("");
  const sectionRefs = useRef([]);
  const headings = useRef([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(blogId);
        // console.log("data", data);
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {rootMargin: "-100px 0px -70% 0px"}
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      sectionRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [blog]);

  const renderContent = () => {
    let headingIndex = 0;
    sectionRefs.current = [];
    headings.current = [];

    return parse(blog.description || "", {
      replace: (domNode) => {
        if (
          domNode.type === "tag" &&
          /^h[1-4]$/.test(domNode.name) &&
          domNode.children?.[0]?.data
        ) {
          const id = `heading-${headingIndex}`;
          sectionRefs.current.push(null); // Reserve space
          headings.current.push({
            id,
            text: domNode.children[0].data,
          });

          const Tag = domNode.name;
          const content = domToReact(domNode.children);

          return (
            <Tag
              id={id}
              ref={(el) => (sectionRefs.current[headingIndex++] = el)}
              className="scroll-mt-32 font-semibold text-gray-800"
            >
              {content}
            </Tag>
          );
        }
      },
    });
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!blog) {
    return (
      <div className="p-10 text-center text-red-500">Blog post not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 ">
          <Link
            href="/blog"
            className="inline-flex items-center text-cyan-100 hover:text-white mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Blog
          </Link>

          <div className="mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {blog.tags?.[0] || "General"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-cyan-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                Created At : {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                Updated At : {new Date(blog.updatedAt).toLocaleDateString()}
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto px-4 py-12">
        {/* Table of Contents */}
        {/* <aside className="w-full md:w-1/4 bg-white p-4 rounded-xl shadow sticky top-24 h-max">
          <h2 className="text-lg font-semibold mb-4">Contents</h2>
          <ul className="space-y-2 text-sm">
            {headings.current.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block hover:text-teal-600 ${
                    activeId === heading.id ? "text-teal-600 font-semibold" : ""
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </aside> */}

        {/* Blog Content */}
        <div className="w-full md:w-full bg-white rounded-2xl shadow p-6">
          {blog.image?.url && (
            <img
              src={blog.image?.url || "/placeholder.jpg"}
              alt={blog.title}
              className=" mx-auto mb-8 rounded-xl "
            />
          )}
          <div className="prose prose-lg max-w-none">{renderContent()}</div>

          {/* Tags */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
            <Tag className="w-5 h-5 text-gray-500" />
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
