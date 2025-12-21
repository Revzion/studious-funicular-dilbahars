"use client";

import ProtectedRouteB2B from "@/components/protectedroutes/ProtectedRouteB2B";
import Navbar from "../../components/b2b/Navbar/Navbar";

export default function B2BLayout({ children }) {
  return (
    <>
      <div className="min-w-[1280px] mx-auto overflow-x-auto">
        <Navbar />
        <ProtectedRouteB2B>{children}</ProtectedRouteB2B>
      </div>
    </>
  );
}
