"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectIsAuthenticated } from "../../redux/slice/userSlice";
import { useRouter } from "next/navigation";
import { fetchCompanyProfile } from "@/redux/slice/companySlice";
import { transferGuestCartToUser } from "@/redux/thunks/cartThunks";
import {
  signinRequestOtpService,
  signinVerifyOtpService,
} from "@/services/b2cAuthServices";

export default function LoginConsumer() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    phoneNo: "",
  });
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let interval;
    if (step === "verify" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  // Validation functions
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateOtp = (otp) => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate phone number
    if (!validatePhoneNumber(form.phoneNo)) {
      setError("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await signinRequestOtpService({ phoneNo: form.phoneNo });
      console.log("OTP sent:", response);
      setSuccess(response.message);
      setStep("verify");
      setTimer(300);
      setResendDisabled(true);
    } catch (err) {
      console.error("OTP request error:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate phone number
    if (!validatePhoneNumber(form.phoneNo)) {
      setError("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await signinRequestOtpService({ phoneNo: form.phoneNo });
      console.log("OTP resent:", response);
      setSuccess("OTP resent successfully");
      setTimer(300);
      setResendDisabled(true);
    } catch (err) {
      console.error("OTP resend error:", err);
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate OTP
    if (!validateOtp(otp)) {
      setError("OTP must be exactly 6 digits");
      setLoading(false);
      return;
    }

    try {
      const result = await signinVerifyOtpService({
        phoneNo: form.phoneNo,
        otp,
      });
      console.log("Verification result:", result);
      if (result && result.token) {
        dispatch(
          setUser({
            user: result.user,
            token: result.token,
          })
        );
        console.log("User set successfully in Redux");

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
        console.log("Login successful, redirecting...");

        const redirectUrl =
          new URLSearchParams(window.location.search).get("redirect") || "/";
        router.push(redirectUrl);
      } else {
        setError("Login failed. Invalid response.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return null;
  }

  return (
    <div
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-4 border-teal-200"
      style={{ animation: "slideIn 0.8s ease-out 0.2s both" }}
    >
      <div className="px-8 py-10">
        {step === "form" && (
          <form className="space-y-6" onSubmit={handleSubmitForm}>
            {/* Phone Number */}
            <div style={{ animation: "slideIn 0.6s ease-out 0.6s both" }}>
              <label className="flex items-center mb-2 text-gray-700 font-medium">
                <Phone size={18} className="mr-2 text-emerald-500" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNo"
                  placeholder="Enter your phone"
                  value={form.phoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                  required
                  pattern="\d{10}"
                  title="Phone number must be exactly 10 digits"
                />
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
                  "Processing..."
                ) : (
                  <>
                    Next
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

            {/* Signup Link */}
            <div
              className="text-center text-sm"
              style={{ animation: "slideIn 0.6s ease-out 1s both" }}
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup?role=consumer"
                  className="text-green-500 hover:text-green-700 font-medium"
                >
                  Signup here
                </a>
              </p>
            </div>
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
          </form>
        )}

        {step === "verify" && (
          <form className="space-y-6" onSubmit={handleSubmitOtp}>
            <div className="flex items-center md:justify-between">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="absolute left-7 text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center md:static"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-700 flex-1 text-center  md:flex-1 md:justify-center">
                Verify Mobile Number
              </h3>
              <div className="hidden md:block w-20"></div>{" "}
              {/* Spacer for alignment in desktop */}
            </div>
            <p className="text-gray-600 mb-4">
              Enter the OTP sent to {form.phoneNo}
            </p>

            <div style={{ animation: "slideIn 0.6s ease-out 0.5s both" }}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                required
                pattern="\d{6}"
                title="OTP must be exactly 6 digits"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Time remaining: {timer} seconds
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendDisabled || loading}
                className="text-emerald-600 hover:text-emerald-800 font-medium text-sm disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={!otp || loading}
              className="w-full rounded-xl py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ animation: "slideIn 0.6s ease-out 0.9s both" }}
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify
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
          </form>
        )}
      </div>
    </div>
  );
}
