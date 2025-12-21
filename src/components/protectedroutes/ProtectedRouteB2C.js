"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
  selectIsAuthenticated,
  selectUserStatus,
} from "../../redux/slice/userSlice";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectUserStatus);
  const router = useRouter();
  const pathname = usePathname();

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
      router.replace("/login");
    }
  }, [isAuthenticated, isProtected, router, status]);

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
