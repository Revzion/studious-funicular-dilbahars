"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  selectIsAuthenticated,
  selectUserStatus,
} from "../../redux/slice/userSlice";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectUserStatus);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()

  const protectedRoutes = [
    "/cart",
    "/favorites",
    "/myorders",
    "/myqueries",
    "/profile",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

useEffect(() => {
    if (status !== "loading" && isProtected && !isAuthenticated) {
      // 1. Construct the full URL the user was trying to access
      const currentParams = searchParams.toString();
      const fullPath = currentParams ? `${pathname}?${currentParams}` : pathname;

      // 2. Redirect to login with the 'redirect' query parameter
      // We use encodeURIComponent to ensure special characters like '?' or '=' don't break the URL
      router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
    }
  }, [isAuthenticated, isProtected, router, status, pathname, searchParams]);

  // ⏳ Wait until auth check completes
  if (status === "loading")
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-lime-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading...</p>
        </div>
      </div>
    );

  // 🚫 Hide protected content if not allowed
  if (isProtected && !isAuthenticated) return null;

  return <>{children}</>;
}
