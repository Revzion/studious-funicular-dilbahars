"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  Package,
  Search,
  User,
  LogOut,
  UserCircle,
  List,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { logoutB2BUser } from "@/services/b2bServices";
import { clearB2bUser } from "@/redux/slice/b2bUserSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../Notification/Notification";

const Navbar = ({ cartLength }) => {
  const b2bUser = useSelector((state) => state.b2bUser.b2bUser);
  console.log("b2bUser", b2bUser);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isDropdownOpen]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 3000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutB2BUser();
      dispatch(clearB2bUser());
      // Notification({ message: "Logged out successfully!", type: "success" });
      window.location.href = "/login?role=dealer";
    } catch (error) {
      console.log("error", error);
      Notification({
        message: error.message || "Failed to logout",
        type: "error",
      });
    }
  };

  const closeDropdownAndNavigate = (path) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dealer" passHref>
            <div className="logo-container text-2xl font-bold flex items-center justify-center cursor-pointer">
              <img
                src="/Dilbahars-logo.png"
                width={100}
                alt="Dilbahar's"
              />
              <img
                src="/logo2.png"
                width={100}
                alt="Dilbahar's"
                className="pb-2"
              />
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            {/* <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div> */}
            <button
              onClick={() => router.push("/dealer/rfq")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <List className="h-5 w-5 text-gray-600" />
              RFQs
            </button>
            <Link href={"/dealer/quotations"}>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FileText className="h-5 w-5 text-gray-600" />
                Quotations
              </button>
            </Link>

            <button
              onClick={() => router.push("/dealer/query")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              My Query
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <User className="h-5 w-5 text-gray-600" />
                <span>
                  {b2bUser?.fullname
                    ? `${b2bUser.fullname.firstname} ${b2bUser.fullname.lastname}`
                    : "Profile"}
                </span>
              </button>
              <div
                className={`absolute right-0 mt-3 w-56 bg-white border-0 rounded-xl shadow-2xl z-50 overflow-hidden transform transition-all duration-200 ease-out ${
                  isDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="py-2">
                  <button
                    onClick={() => closeDropdownAndNavigate("/dealer/profile")}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-150 flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-150">
                      <UserCircle className="h-4 w-4 text-gray-600 group-hover:text-indigo-600" />
                    </div>
                    <span className="font-medium">My Profile</span>
                  </button>

                  <div className="mx-3 my-1 border-t border-gray-100"></div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-150">
                      <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Optional Cart Button */}
            {/* <button
              onClick={() => setShowCart((prev) => !prev)}
              className="relative bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>RFQ Cart</span>
              {cartLength > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cartLength}
                </span>
              )}
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
