"use client";

import { clearUser } from "@/redux/slice/userSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutB2cUserService } from "@/services/b2cServices";

const Dealership = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleB2BAccess = async (type) => {
    setIsLoading(true);
    try {
      if(user && user.isAuthenticated){
        // If user is authenticated, log them out first
        await logoutB2cUserService();
        dispatch(clearUser());
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      // // Call the B2C logout API
      // await logoutB2cUserService();

      // // Clear Redux user state
      // dispatch(clearUser());

      // // Optional: small delay for smoother UX
      // await new Promise((resolve) => setTimeout(resolve, 300));

      // Redirect to the dealer portal
      if (type === "login") {
        window.location.href = "/login?role=dealer";
      } else {
        window.location.href = "/signup?role=dealer";
      }
    } catch (error) {
      console.error("Error during B2C logout:", error);
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 pt-10">
      <div className="max-w-5xl mx-auto">
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="relative bg-gradient-to-br from-cyan-50 via-white to-cyan-50 border border-cyan-200/50 rounded-2xl p-10 max-w-md mx-auto shadow-xl backdrop-blur-sm">
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full opacity-30"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full opacity-20"></div>
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full p-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
              </div>
            </div>
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Business Portal Access
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Access exclusive B2B features
                </p>
              </div>
              <button
                onClick={() => handleB2BAccess("login")}
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(to right, #cffafe 0%, #ffffff 50%, #cffafe 100%)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-white to-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative px-8 py-4 flex items-center justify-center">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                  ) : (
                    <svg
                      className="w-5 h-5 mr-3 text-cyan-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  )}
                  <span className="font-semibold text-cyan-800 group-hover:text-cyan-900 transition-colors">
                    {isLoading ? "Redirecting..." : "Login as Dealer"}
                  </span>
                </div>
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyan-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-r from-cyan-50 to-white text-gray-500">
                    or
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-50 to-white rounded-lg p-4 border border-cyan-100">
                <p className="text-sm text-gray-600 mb-3">
                  Don't have a dealer account yet?
                </p>
                <button
                  onClick={() => handleB2BAccess("signup")}
                  disabled={isLoading}
                  className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm hover:underline transition-all duration-200 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                  ) : (
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                  {isLoading ? "Processing..." : "Create Dealer Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dealership;
