"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth, clearUser, fetchUser } from "@/redux/slice/userSlice";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useRouter, usePathname } from "next/navigation";
import { fetchB2bUser, initializeB2bAuth } from "@/redux/slice/b2bUserSlice";
import { loadGuestItemsFromStorage } from "@/redux/slice/cartSlice"; // NEW: Import loadGuestItemsFromStorage

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  const publicRoutes = ["/login", "/signup", "/forgot-password"];

  const isB2BRoute = pathname.startsWith("/dealer");
  const isProductDetailsPage = pathname.match(/^\/products\/[^/]+$/);

  const isPublicRoute = publicRoutes.includes(pathname);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Initialize auth and fetch user data
    dispatch(fetchUser());
    dispatch(fetchB2bUser());

    // NEW: Load guest cart from localStorage
    const guestCartData = localStorage.getItem('guestCart');
    if (guestCartData) {
      try {
        const parsedData = JSON.parse(guestCartData);
        if (Array.isArray(parsedData)) {
          dispatch(loadGuestItemsFromStorage(parsedData));
        }
      } catch (error) {
        console.error("Failed to parse guest cart from localStorage:", error);
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;
  }, [loading, isAuthenticated]);

  // Determine if footer should be hidden
  const shouldHideFooter = isB2BRoute || (isProductDetailsPage && isMobile);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-lime-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {!isB2BRoute && <Navbar />}
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}