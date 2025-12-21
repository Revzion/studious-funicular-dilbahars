// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import {
//   Calendar,
//   Tag,
//   Clock,
//   User,
//   ChevronLeft,
//   Share2,
//   Heart,
//   BookOpen,
//   Facebook,
//   Twitter,
//   Linkedin,
//   Mail,
//   MessageCircle,
// } from "lucide-react";
// import { getBlogById, toggleLike } from "@/services/blogServices";
// import parse from "html-react-parser";

// const BlogDetailsPage = () => {
//   const { slug: blogId } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isLiked, setIsLiked] = useState(false);
//   const [showShareMenu, setShowShareMenu] = useState(false);
//   const shareMenuRef = useRef(null);

//   const formatDescription = (description) => {
//     return parse(description);
//   }
//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const data = await getBlogById(blogId);
//         setBlog(data.category);
//         setIsLiked(data.category.like);
//       } catch (error) {
//         console.error("Error fetching blog:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (blogId) fetchBlog();
//   }, [blogId]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         shareMenuRef.current &&
//         !shareMenuRef.current.contains(event.target)
//       ) {
//         setShowShareMenu(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   console.log(blogId, blog);

//   const shareUrl = typeof window !== "undefined" ? window.location.href : "";
//   const shareTitle = blog?.title ? encodeURIComponent(blog.title) : "";

//   const shareLinks = {
//     facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       shareUrl
//     )}`,
//     instagram: `https://www.instagram.com/`,
//     whatsapp: `https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(
//       shareUrl
//     )}`,
//     email: `mailto:?subject=${shareTitle}&body=Check%20out%20this%20blog%20post:%20${encodeURIComponent(
//       shareUrl
//     )}`,
//   };

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-gray-500">Loading blog post...</div>
//     );
//   }

//   if (!blog) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-100">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Blog Post Not Found
//           </h1>
//           <Link href="/blog" className="text-teal-600 hover:underline">
//             Back to Blog
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 pt-30">
//       {/* Header */}
      // <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white py-16 overflow-hidden">
      //   <div className="absolute inset-0 bg-black opacity-20"></div>
      //   <div className="relative max-w-4xl mx-auto px-4 ">
      //     <Link
      //       href="/blog"
      //       className="inline-flex items-center text-cyan-100 hover:text-white mb-6"
      //     >
      //       <ChevronLeft className="w-5 h-5 mr-1" />
      //       Back to Blog
      //     </Link>

      //     <div className="mb-4">
      //       <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
      //         {blog.tags?.[0] || "General"}
      //       </span>
      //     </div>

      //     <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
      //       {blog.title}
      //     </h1>

      //     <div className="flex flex-wrap items-center gap-6 text-cyan-100">
      //       <div className="flex items-center gap-2">
      //         <Calendar className="w-5 h-5" />
      //         <span>
      //           Created At : {new Date(blog.createdAt).toLocaleDateString()}
      //         </span>
      //       </div>
      //       <div className="flex items-center gap-2">
      //         <Clock className="w-5 h-5" />
      //         <span>
      //           Updated At : {new Date(blog.updatedAt).toLocaleDateString()}
      //         </span>
      //       </div>
      //     </div>
      //   </div>
      // </div>

//       {/* Main Content */}
//       <div className="max-w-4xl mx-auto px-4 py-12">
//         <div className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
//           <img
//             src={blog.image?.url || "/placeholder.jpg"}
//             alt={blog.title}
//             className="w-full h-120 object-contain"
//           />
//         </div>

//         <div className="flex items-center justify-between mb-8 p-6 bg-white rounded-2xl shadow-lg">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setIsLiked(!isLiked)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isLiked
//                   ? "bg-red-100 text-red-600"
//                   : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
//                 }`}
//             >
//               <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
//               <span>Like {blog.like}</span>
//             </button>

//             <div className="relative" ref={shareMenuRef}>
//               <button
//                 onClick={() => setShowShareMenu(!showShareMenu)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600"
//               >
//                 <Share2 className="w-5 h-5" />
//                 <span>Share</span>
//               </button>

//               {showShareMenu && (
//                 <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border p-4 z-10 flex gap-4">
//                   <a
//                     href={shareLinks.whatsapp}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
//                   >
//                     <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="white"
//                       >
//                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.297" />
//                       </svg>
//                     </div>
//                     <span className="text-xs">WhatsApp</span>
//                   </a>

//                   <a
//                     href={shareLinks.instagram}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
//                   >
//                     <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center">
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="white"
//                       >
//                         <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//                       </svg>
//                     </div>
//                     <span className="text-xs">Instagram</span>
//                   </a>
//                   <a
//                     href={shareLinks.facebook}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
//                   >
//                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="white"
//                       >
//                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                       </svg>
//                     </div>
//                     <span className="text-xs">Facebook</span>
//                   </a>

//                   <a
//                     href={shareLinks.email}
//                     className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
//                   >
//                     <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="white"
//                       >
//                         <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z" />
//                       </svg>
//                     </div>
//                     <span className="text-xs">Email</span>
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Blog Content */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
//           <div className="prose prose-lg max-w-none">
//             {formatDescription(blog.description)}
//           </div>
//           {/* Tags */}
//           <div className="mt-8 pt-8 border-t border-gray-200">
//             <div className="flex items-center gap-3 flex-wrap">
//               <Tag className="w-5 h-5 text-gray-500" />
//               {blog.tags?.map((tag) => (
//                 <span
//                   key={tag}
//                   className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium"
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetailsPage;

import BlogDetailsPage from '@/components/Blog/BlogDetailsPage' 
import { getBlogById } from '@/services/blogServices'
import React from 'react' 

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const { slug } = params
  
  try {
    const data = await getBlogById(slug)
    const blog = data.blog
    
    if (!blog) {
      return {
        title: "Blog Not Found - Dilbahar's",
        description: "The requested blog post could not be found.",
      }
    }

    // Clean description of HTML
    const cleanDescription = blog.metaDescription || (
      blog.description
        ? blog.description.replace(/<[^>]*>/g, '').substring(0, 160)
        : "Dilbahar's"
    )

    // Add tags to keywords metadata
    const keywords = blog.tags?.length > 0
      ? blog.tags.map(tag => tag.replace(/^#/, '')) // remove '#' if present
      : []

    return {
      title: blog.metaTitle || blog.title || "Dilbahar's",
      description: cleanDescription,
      keywords, // This will show up as <meta name="keywords" content="SweetWithCare, DilbaharsPromise, MindfulCandies">
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "Dilbahar's",
      description: "Dilbahar's",
    }
  }
}

const page = () => { 
  return ( 
    <div> 
      <BlogDetailsPage /> 
    </div> 
  ) 
} 

export default page

