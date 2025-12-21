"use client";
import {useEffect, useState} from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Stars,
  ChevronRight,
  Sparkles,
  User,
  Phone,
  MapPin,
  Camera,
  Upload,
  Building,
  Hash,
  FileText,
} from "lucide-react";
import {useRouter} from "next/navigation";
import {useSearchParams} from "next/navigation";
import SignupConsumer from "./SignupConsumer";
import {
  sendPhoneOtpService,
  verifyPhoneOtpService,
  sendEmailOtpService,
  verifyEmailOtpService,
  registerB2bUserService,
} from "@/services/b2bAuthServices";

export default function SignupDealer() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState("consumer");
  const [b2bForm, setB2bForm] = useState({
    fullname: {firstname: "", lastname: ""},
    email: "",
    phoneNo: "",
    password: "",
    gstnumber: "",
    companyname: "",
    interestProduct: [],
    profile: null,
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      addresstype: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const router = useRouter();

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "dealer" || roleParam === "consumer") {
      setRole(roleParam);
    }
  }, [searchParams]);

  // Handle B2B form changes
  const handleB2bChange = (e) => {
    const {name, value} = e.target;

    if (name.startsWith("fullname.")) {
      const field = name.split(".")[1];
      setB2bForm((prev) => ({
        ...prev,
        fullname: {
          ...prev.fullname,
          [field]: value,
        },
      }));
      if (value && field === "firstname") {
        setErrors((prev) => ({...prev, firstname: ""}));
      }
    } else if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setB2bForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setB2bForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Real-time email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email:
          value && !emailRegex.test(value)
            ? "Please enter a valid email address (e.g., user@domain.com)"
            : "",
      }));
    }

    // Real-time phone number validation
    if (name === "phoneNo") {
      const phoneRegex = /^\d{10}$/;
      setErrors((prev) => ({
        ...prev,
        phone:
          value && !phoneRegex.test(value)
            ? "Phone number must be exactly 10 digits"
            : "",
      }));
    }

    // Clear error for password when value is entered
    if (name === "password" && value) {
      setErrors((prev) => ({...prev, password: ""}));
    }
  };

  // Handle file upload for B2B
  const handleB2bFileChange = (e) => {
    setB2bForm((prev) => ({
      ...prev,
      profile: e.target.files[0],
    }));
    if (error) setError("");
  };

  const handleVerifyPhone = async () => {
    const phoneRegex = /^\d{10}$/;
    if (!b2bForm.phoneNo || !phoneRegex.test(b2bForm.phoneNo)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid 10-digit phone number",
      }));
      return;
    }
    setPhoneOtpLoading(true);
    try {
      console.log("Sending phone OTP for:", b2bForm.phoneNo);
      await sendPhoneOtpService(b2bForm.phoneNo);
      setShowPhoneOtp(true);
      console.log("Phone OTP sent successfully");
    } catch (err) {
      console.error("Error sending phone OTP:", err);
      setErrors((prev) => ({
        ...prev,
        phone: err.message || "Failed to send phone OTP",
      }));
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const handleSubmitPhoneOtp = async () => {
    setPhoneOtpLoading(true);
    try {
      console.log(
        "Verifying phone OTP for:",
        b2bForm.phoneNo,
        "OTP:",
        phoneOtp
      );
      await verifyPhoneOtpService(b2bForm.phoneNo, phoneOtp);
      setPhoneVerified(true);
      setShowPhoneOtp(false);
      setPhoneOtp("");
      setErrors((prev) => ({...prev, phone: "", phoneOtp: ""}));
      console.log("Phone OTP verified successfully");
    } catch (err) {
      console.error("Error verifying phone OTP:", err);
      setErrors((prev) => ({
        ...prev,
        phoneOtp: err.message || "Phone verification failed. Please try again.",
      }));
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!b2bForm.email || !emailRegex.test(b2bForm.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address (e.g., user@domain.com)",
      }));
      return;
    }
    setEmailOtpLoading(true);
    try {
      console.log("Sending email OTP for:", b2bForm.email);
      await sendEmailOtpService(b2bForm.email);
      setShowEmailOtp(true);
      console.log("Email OTP sent successfully");
    } catch (err) {
      console.error("Error sending email OTP:", err);
      setErrors((prev) => ({
        ...prev,
        email: err.message || "Failed to send email OTP",
      }));
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleSubmitEmailOtp = async () => {
    setEmailOtpLoading(true);
    try {
      console.log("Verifying email OTP for:", b2bForm.email, "OTP:", emailOtp);
      await verifyEmailOtpService(b2bForm.email, emailOtp);
      setEmailVerified(true);
      setShowEmailOtp(false);
      setEmailOtp("");
      setErrors((prev) => ({...prev, email: "", emailOtp: ""}));
      console.log("Email OTP verified successfully");
    } catch (err) {
      console.error("Error verifying email OTP:", err);
      setErrors((prev) => ({
        ...prev,
        emailOtp: err.message || "Email verification failed. Please try again.",
      }));
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // Handle B2B form submission
  const handleB2bSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setErrors((prev) => ({...prev, general: ""}));

    // Client-side validation
    let newErrors = {};
    if (!b2bForm.fullname.firstname) {
      newErrors.firstname = "First name is required";
    }
    if (!b2bForm.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(b2bForm.email)) {
        newErrors.email =
          "Please enter a valid email address (e.g., user@domain.com)";
      }
    }
    if (!b2bForm.phoneNo) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(b2bForm.phoneNo)) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
    }
    if (!b2bForm.password) {
      newErrors.password = "Password is required";
    }
    if (!phoneVerified) {
      newErrors.phone = "Phone number must be verified";
    }
    if (!emailVerified) {
      newErrors.email = "Email must be verified";
    }

    setErrors((prev) => ({...prev, ...newErrors}));

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      // ✅ Flatten payload because controller expects keys like "fullname.firstname"
      const payload = {
        "fullname.firstname": b2bForm.fullname.firstname || "",
        "fullname.lastname": b2bForm.fullname.lastname || "",
        email: b2bForm.email || "",
        phoneNo: b2bForm.phoneNo || "",
        password: b2bForm.password || "",
        gstnumber: b2bForm.gstnumber || "",
        companyname: b2bForm.companyname || "",
      };

      let finalData;

      if (b2bForm.profile) {
        // ✅ Use FormData for file + fields
        finalData = new FormData();
        Object.entries(payload).forEach(([key, val]) => {
          if (val) finalData.append(key, val);
        });

        // Add address fields explicitly since backend expects `req.body.address.*`
        if (b2bForm.address) {
          Object.entries(b2bForm.address).forEach(([key, val]) => {
            if (val) finalData.append(`address.${key}`, val);
          });
        }

        finalData.append("profile", b2bForm.profile);
      } else {
        // ✅ Normal JSON payload
        finalData = {
          ...payload,
          address: b2bForm.address,
        };
      }

      await registerB2bUserService(finalData, !!b2bForm.profile);

      setSuccess("Dealer registered successfully!");
      console.log("B2B registration successful");

      // Reset form after success
      setTimeout(() => {
        setB2bForm({
          fullname: {firstname: "", lastname: ""},
          email: "",
          phoneNo: "",
          password: "",
          gstnumber: "",
          companyname: "",
          // interestProduct: [],
          profile: null,
          address: {
            street: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            addresstype: "",
          },
        });
        window.location.href = `/login?role=${role}`;
      }, 2000);
    } catch (err) {
      console.error("Error registering B2B user:", err);
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Dealer registration failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div
          className="relative mx-auto w-fit mb-8"
          style={{animation: "slideIn 0.6s ease-out"}}
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
            Join Dilbahar's
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
            Sign Up as Consumer
          </button>
          <button
            onClick={() => setRole("dealer")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              role === "dealer"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            Sign Up as Dealer
          </button>
        </div>

        {/* Consumer Form */}
        {role === "consumer" && <SignupConsumer />}

        {/* Dealer Form */}
        {role === "dealer" && (
          <div
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-4 border-teal-200"
            style={{animation: "slideIn 0.8s ease-out 0.2s both"}}
          >
            <div className="px-8 py-10">
              <form className="space-y-6" onSubmit={handleB2bSubmit}>
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div style={{animation: "slideIn 0.6s ease-out 0.5s both"}}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <User size={18} className="mr-2 text-emerald-500" />
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullname.firstname"
                        placeholder="First name"
                        value={b2bForm.fullname?.firstname}
                        onChange={handleB2bChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                        required
                      />
                    </div>
                    {errors.firstname && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstname}
                      </p>
                    )}
                  </div>

                  <div style={{animation: "slideIn 0.6s ease-out 0.5s both"}}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <User size={18} className="mr-2 text-emerald-500" />
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullname.lastname"
                        placeholder="Last name"
                        value={b2bForm.fullname.lastname}
                        onChange={handleB2bChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div style={{animation: "slideIn 0.6s ease-out 0.6s both"}}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <Mail size={18} className="mr-2 text-emerald-500" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={b2bForm.email}
                        onChange={handleB2bChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                        required
                      />
                      {!emailVerified && (
                        <button
                          type="button"
                          onClick={handleVerifyEmail}
                          disabled={emailOtpLoading}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-600 hover:text-emerald-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {emailOtpLoading ? "Sending..." : "Verify"}
                        </button>
                      )}
                      {emailVerified && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                    {showEmailOtp && (
                      <div className="mt-2 flex">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          value={emailOtp}
                          maxLength={6}
                          onChange={(e) => {
                            setEmailOtp(e.target.value);
                            setErrors((prev) => ({...prev, emailOtp: ""}));
                          }}
                          className="flex-1 px-3 py-2 rounded-l-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300 text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleSubmitEmailOtp}
                          disabled={emailOtpLoading}
                          className="px-3 py-2 bg-emerald-500 text-white rounded-r-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {emailOtpLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                    )}
                    {showEmailOtp && errors.emailOtp && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.emailOtp}
                      </p>
                    )}
                  </div>

                  <div style={{animation: "slideIn 0.6s ease-out 0.6s both"}}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <Phone size={18} className="mr-2 text-emerald-500" />
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phoneNo"
                        placeholder="Enter your phone"
                        value={b2bForm.phoneNo}
                        onChange={handleB2bChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                        required
                      />
                      {!phoneVerified && (
                        <button
                          type="button"
                          onClick={handleVerifyPhone}
                          disabled={phoneOtpLoading}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-600 hover:text-emerald-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {phoneOtpLoading ? "Sending..." : "Verify"}
                        </button>
                      )}
                      {phoneVerified && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                    {showPhoneOtp && (
                      <div className="mt-2 flex">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          value={phoneOtp}
                          maxLength={6}
                          onChange={(e) => {
                            setPhoneOtp(e.target.value);
                            setErrors((prev) => ({...prev, phoneOtp: ""}));
                          }}
                          className="flex-1 px-3 py-2 rounded-l-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300 text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleSubmitPhoneOtp}
                          disabled={phoneOtpLoading}
                          className="px-3 py-2 bg-emerald-500 text-white rounded-r-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {phoneOtpLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                    )}
                    {showPhoneOtp && errors.phoneOtp && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phoneOtp}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div style={{animation: "slideIn 0.6s ease-out 0.7s both"}}>
                  <label className="flex items-center mb-2 text-gray-700 font-medium">
                    <Lock size={18} className="mr-2 text-emerald-500" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={b2bForm.password}
                      onChange={handleB2bChange}
                      className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200  transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div style={{animation: "slideIn 0.6s ease-out 0.8s both"}}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <Building size={18} className="mr-2 text-green-500" />
                      Company Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="companyname"
                        placeholder="Company name"
                        value={b2bForm.companyname}
                        onChange={handleB2bChange}
                        className="w-full px-4 py-3 rounded-xl bg-green-50 border-2 border-green-100 focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div style={{animation: "slideIn 0.6s ease-out 0.8s both"}}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <Hash size={18} className="mr-2 text-emerald-500" />
                      GST Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="gstnumber"
                        placeholder="GST number"
                        value={b2bForm.gstnumber}
                        onChange={handleB2bChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div style={{animation: "slideIn 0.6s ease-out 0.9s both"}}>
                  <label className="flex items-center mb-2 text-gray-700 font-medium">
                    <Camera size={18} className="mr-2 text-lime-500" />
                    Profile Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleB2bFileChange}
                      className="w-full px-4 py-3 rounded-xl bg-lime-50 border-2 border-lime-100 focus:border-lime-300 focus:ring focus:ring-lime-200 focus:ring-opacity-50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-100 file:text-cyan-700 hover:file:bg-lime-200"
                    />
                  </div>
                </div>

                {/* Address Section */}
                {/* <div style={{ animation: "slideIn 0.6s ease-out 1s both" }}>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <MapPin size={20} className="mr-2 text-teal-500" />
                    Address Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address.street"
                      placeholder="Street Address"
                      value={b2bForm.address.street}
                      onChange={handleB2bChange}
                      className="w-full px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-100 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-300"
                    />

                    <input
                      type="text"
                      name="address.city"
                      placeholder="City"
                      value={b2bForm.address.city}
                      onChange={handleB2bChange}
                      className="w-full px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-100 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50focus:ring-opacity-50 transition-all duration-300"
                    />

                    <input
                      type="text"
                      name="address.state"
                      placeholder="State"
                      value={b2bForm.address.state}
                      onChange={handleB2bChange}
                      className="w-full px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-100 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50focus:ring-opacity-50 transition-all duration-300"
                    />

                    <input
                      type="text"
                      name="address.country"
                      placeholder="Country"
                      value={b2bForm.address.country}
                      onChange={handleB2bChange}
                      className="w-full px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-100 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-300"
                    />

                    <input
                      type="text"
                      name="address.pincode"
                      placeholder="PIN Code"
                      value={b2bForm.address.pincode}
                      onChange={handleB2bChange}
                      className="w-full px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-100 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-300"
                    />

                    <select
                      name="address.addresstype"
                      value={b2bForm.address.addresstype}
                      onChange={handleB2bChange}
                      className="w-full px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-100 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 focus:ring-opacity-50 transition-all duration-300"
                    >
                      <option value="">Address Type</option>
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div> */}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !phoneVerified || !emailVerified}
                  className="w-full rounded-xl py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{animation: "slideIn 0.6s ease-out 1.1s both"}}
                >
                  <span className="flex items-center justify-center">
                    {loading ? (
                      "Creating Account..."
                    ) : (
                      <>
                        Create Dealer Account
                        <ChevronRight
                          size={20}
                          className="ml-1"
                          style={{animation: "float 1s ease-in-out infinite"}}
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
                {errors.general && (
                  <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {errors.general}
                  </div>
                )}

                {/* Login Link */}
                <div
                  className="text-center text-sm"
                  style={{animation: "slideIn 0.6s ease-out 1.2s both"}}
                >
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/login?role=dealer"
                      className="text-teal-700 hover:text-teal-900 font-medium"
                    >
                      Login here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
