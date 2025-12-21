"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  selectIsB2bAuthenticated,
  selectB2bUserStatus,
} from "../../redux/slice/b2bUserSlice";

export default function ProtectedRouteB2B({ children }) {
  const isAuthenticated = useSelector(selectIsB2bAuthenticated);
  const status = useSelector(selectB2bUserStatus);
  const router = useRouter();

  useEffect(() => {
    if (status === "succeeded" && !isAuthenticated) {
      router.replace("/login");
    }

    if (status === "failed") {
      router.replace("/login");
    }
  }, [status, isAuthenticated, router]);

  if (status === "loading" || status === "idle")
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-lime-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  //   {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p>Checking authentication...</p>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
