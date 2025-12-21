"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Stars,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectIsAuthenticated } from "../../redux/slice/userSlice";
import {
  setB2bUser,
  selectIsB2bAuthenticated,
} from "../../redux/slice/b2bUserSlice";
import { useRouter } from "next/navigation";
import { loginB2BUser } from "@/services/b2bServices";
import { loginB2cUserService } from "@/services/b2cServices";
import { useSearchParams } from "next/navigation";
import { fetchCompanyProfile } from "@/redux/slice/companySlice";
import { transferGuestCartToUser } from "@/redux/thunks/cartThunks";

export default function LoginPage() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isB2bAuthenticated = useSelector(selectIsB2bAuthenticated);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [role, setRole] = useState("consumer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "dealer" || roleParam === "consumer") {
      setRole(roleParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    } else if (isB2bAuthenticated) {
      router.replace("/dealer");
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, isB2bAuthenticated, router]);

  if (checkingAuth) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.identifier || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!form.identifier.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      let result;
      if (role === "consumer") {
        result = await loginB2cUserService({
          identifier: form.identifier,
          password: form.password,
        });

        if (result && result.token) {
          dispatch(
            setUser({
              user: result.user,
              token: result.token,
            })
          );

          await dispatch(fetchCompanyProfile()).unwrap();

          // Transfer guest cart using Redux thunk
          try {
            const transferResult = await dispatch(
              transferGuestCartToUser()
            ).unwrap();
            if (transferResult.success && transferResult.transferredCount > 0) {
              console.log(
                `${transferResult.transferredCount} items transferred to your cart`
              );
            }
          } catch (transferError) {
            console.error("Failed to transfer guest cart:", transferError);
          }

          setSuccess("Login successful! Welcome back!");

          const redirectUrl = searchParams.get("redirect") || "/";
          router.push(redirectUrl);
        }
      } else {
        // B2B user login
        result = await loginB2BUser({
          identifier: form.identifier,
          password: form.password,
        });

        if (result && result.token) {
          dispatch(
            setB2bUser({
              b2bUser: result.b2buser,
              token: result.token,
            })
          );
          setSuccess("Login successful! Welcome back!");
          router.push("/dealer");
        }
      }

      if (!result || !result.token) {
        setError("Login failed. Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <style jsx>{`
        @keyframes bubble {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.3) rotate(5deg);
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes sparkle1 {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateY(-100px) translateX(50px) scale(1.5);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) translateX(75px) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes sparkle2 {
          0% {
            transform: translateY(0) translateX(0) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: translateY(-80px) translateX(-30px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) translateX(-45px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div
          className="relative mx-auto w-fit mb-8"
          style={{ animation: "slideIn 0.6s ease-out" }}
        >
          <svg
            width="360"
            height="100"
            viewBox="0 0 360 100"
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -z-10"
          >
            <path
              d="M10,50 Q-10,25 30,15 Q60,0 180,10 Q300,0 330,15 Q370,25 350,50 Q370,75 330,85 Q300,100 180,90 Q60,100 30,85 Q-10,75 10,50"
              fill="#312E81"
            />
            <path d="M330,55 L360,85 L320,75 Z" fill="#312E81" />
          </svg>
          <h2 className="text-3xl md:text-4xl font-bold text-white py-6 px-16 text-center">
            Welcome Back!
          </h2>
        </div>

        {/* Role Selection Buttons */}
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => setRole("consumer")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              role === "consumer"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            Login as Consumer
          </button>
          <button
            onClick={() => setRole("dealer")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              role === "dealer"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            Login as Dealer
          </button>
        </div>

        {/* Login Form */}
        <div
          className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-4 border-teal-200"
          style={{ animation: "slideIn 0.8s ease-out 0.2s both" }}
        >
          <div className="px-8 py-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ animation: "slideIn 0.6s ease-out 0.7s both" }}>
                <label className="flex items-center mb-2 text-gray-700 font-medium">
                  <Mail size={18} className="mr-2 text-lime-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="identifier"
                    placeholder="Enter your email"
                    value={form.identifier}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-lime-50 border-2 border-lime-100 focus:border-lime-300 focus:ring focus:ring-lime-200 focus:ring-opacity-50 transition-all duration-300"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ animation: "slideIn 0.6s ease-out 0.8s both" }}>
                <label className="flex items-center mb-2 text-gray-700 font-medium">
                  <Lock size={18} className="mr-2 text-teal-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-100 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-300"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors duration-200"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ animation: "slideIn 0.6s ease-out 0.9s both" }}
              >
                <span className="flex items-center justify-center">
                  {loading ? (
                    "Signing In..."
                  ) : (
                    <>
                      {role === "consumer"
                        ? "Login as Consumer"
                        : "Login as Dealer"}
                      <ChevronRight
                        size={20}
                        className="ml-1"
                        style={{ animation: "float 1s ease-in-out infinite" }}
                      />
                    </>
                  )}
                </span>
              </button>

              {/* Success/Error Messages */}
              {success && (
                <div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  {success}
                </div>
              )}
              {error && (
                <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Forgot Password and Signup Links */}
              <div
                className="text-center text-sm"
                style={{ animation: "slideIn 0.6s ease-out 1s both" }}
              >
                <a
                  href="/forget-password"
                  className="text-teal-500 hover:text-teal-700 font-medium"
                >
                  Forgot your password?
                </a>
              </div>
              <div
                className="text-center text-sm"
                style={{ animation: "slideIn 0.6s ease-out 1.2s both" }}
              >
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href={`/signup?role=${role}`}
                    className="text-teal-500 hover:text-teal-700 font-medium"
                  >
                    Signup here
                  </a>
                </p>
              </div>
              {role === "consumer" && (
                <div
                  className="text-center text-sm"
                  style={{ animation: "slideIn 0.6s ease-out 1s both" }}
                >
                  <a
                    href="/"
                    className="text-teal-700 hover:text-teal-900 font-medium"
                  >
                    Continue Without Login
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
