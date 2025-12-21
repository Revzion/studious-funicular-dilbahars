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
  User,
  Phone,
  MapPin,
  Camera,
  Upload,
  Building,
  Hash,
  FileText,
} from "lucide-react";
import { registerB2cUserService } from "@/services/b2cServices";
import { useRouter } from "next/navigation";
import { registerB2bUser } from "@/services/b2bServices";
import { useSearchParams } from "next/navigation";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState("consumer");
  const [b2cForm, setB2cForm] = useState({
    "fullname.firstname": "",
    "fullname.lastname": "",
    email: "",
    phoneNo: "",
    password: "",
  });
  const [b2bForm, setB2bForm] = useState({
    fullname: { firstname: "", lastname: "" },
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "dealer" || roleParam === "consumer") {
      setRole(roleParam);
    }
  }, [searchParams]);

  // Handle B2C form changes
  const handleB2cChange = (e) => {
    const { name, value } = e.target;
    setB2cForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // Handle B2B form changes
  const handleB2bChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("fullname.")) {
      const field = name.split(".")[1];
      setB2bForm((prev) => ({
        ...prev,
        fullname: {
          ...prev.fullname,
          [field]: value,
        },
      }));
    } else if (name.startsWith("address.")) {
      // 🔄 CHANGED: Added address handling
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
    if (error) setError("");
  };

  // Handle file upload for B2B
  const handleB2bFileChange = (e) => {
    setB2bForm((prev) => ({
      ...prev,
      profile: e.target.files[0],
    }));
    if (error) setError("");
  };

  // Handle B2C form submission
  const handleB2cSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerB2cUserService(b2cForm);
      setSuccess("Consumer registered successfully!");

      // Reset form after success
      setTimeout(() => {
        setB2cForm({
          "fullname.firstname": "",
          "fullname.lastname": "",
          email: "",
          phoneNo: "",
          password: "",
        });
        window.location.href = `/login?role=${role}`;
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Consumer registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle B2B form submission
  const handleB2bSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      formData.append("fullname.firstname", b2bForm.fullname.firstname);
      formData.append("fullname.lastname", b2bForm.fullname.lastname);
      formData.append("email", b2bForm.email);
      formData.append("phoneNo", b2bForm.phoneNo);
      formData.append("password", b2bForm.password);

      // Optional fields
      if (b2bForm.gstnumber) {
        formData.append("gstnumber", b2bForm.gstnumber);
      }
      if (b2bForm.companyname) {
        formData.append("companyname", b2bForm.companyname);
      }
      if (b2bForm.interestProduct.length > 0) {
        formData.append(
          "interestProduct",
          JSON.stringify(b2bForm.interestProduct)
        );
      }

      // Profile image
      if (b2bForm.profile) {
        formData.append("b2bprofile", b2bForm.profile);
      }

      // Address
      const { street, city, state, country, pincode, addresstype } =
        b2bForm.address;
      const isAddressFilled =
        street || city || state || country || pincode || addresstype;
      if (isAddressFilled) {
        if (street) formData.append("address[street]", street);
        if (city) formData.append("address[city]", city);
        if (state) formData.append("address[state]", state);
        if (country) formData.append("address[country]", country);
        if (pincode) formData.append("address[pincode]", pincode);
        if (addresstype) formData.append("address[addresstype]", addresstype);
      }

      await registerB2bUser(formData);
      setSuccess("Dealer registered successfully!");

      // Reset form after success
      setTimeout(() => {
        setB2bForm({
          fullname: { firstname: "", lastname: "" },
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
        window.location.href = `/login?role=${role}`;
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Dealer registration failed. Please try again.");
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
      <div className="relative z-10 w-full max-w-2xl">
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
        {role === "consumer" && (
          <div
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-4 border-teal-200"
            style={{ animation: "slideIn 0.8s ease-out 0.2s both" }}
          >
            <div className="px-8 py-10">
              <form className="space-y-6" onSubmit={handleB2cSubmit}>
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div style={{ animation: "slideIn 0.6s ease-out 0.5s both" }}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <User size={18} className="mr-2 text-emerald-500" />
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullname.firstname"
                        placeholder="First name"
                        value={b2cForm["fullname.firstname"]}
                        onChange={handleB2cChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ animation: "slideIn 0.6s ease-out 0.5s both" }}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <User size={18} className="mr-2 text-emerald-500" />
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullname.lastname"
                        placeholder="Last name"
                        value={b2cForm["fullname.lastname"]}
                        onChange={handleB2cChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

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
                      value={b2cForm.phoneNo}
                      onChange={handleB2cChange}
                      className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 hover:rotate-6 transition-transform duration-200">
                      <Stars size={20} className="text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ animation: "slideIn 0.6s ease-out 0.7s both" }}>
                  <label className="flex items-center mb-2 text-gray-700 font-medium">
                    <Mail size={18} className="mr-2 text-lime-500" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={b2cForm.email}
                      onChange={handleB2cChange}
                      className="w-full px-4 py-3 rounded-xl bg-lime-50 border-2 border-lime-100 focus:border-lime-300 focus:ring focus:ring-lime-200 focus:ring-opacity-50 transition-all duration-300"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 hover:rotate-6 transition-transform duration-200">
                      <Stars size={20} className="text-lime-400" />
                    </div>
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
                      placeholder="Create a password"
                      value={b2cForm.password}
                      onChange={handleB2cChange}
                      className="w-full px-4 py-3 rounded-xl bg-teal-50 border-2 border-teal-100 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors duration-200"
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
                      "Creating Account..."
                    ) : (
                      <>
                        Create Consumer Account
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

                {/* Login Link */}

                <div
                  className="text-center text-sm"
                  style={{ animation: "slideIn 0.6s ease-out 1s both" }}
                >
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/login?role=consumer"
                      className="text-green-500 hover:text-green-700 font-medium"
                    >
                      Login here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dealer Form */}
        {role === "dealer" && (
          <div
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border-4 border-teal-200"
            style={{ animation: "slideIn 0.8s ease-out 0.2s both" }}
          >
            <div className="px-8 py-10">
              <form className="space-y-6" onSubmit={handleB2bSubmit}>
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div style={{ animation: "slideIn 0.6s ease-out 0.5s both" }}>
                    <label className="flex items-center mb-2 text-gray-700 font-medium">
                      <User size={18} className="mr-2 text-emerald-500" />
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullname.firstname"
                        placeholder="First name"
                        value={b2bForm.fullname.firstname}
                        onChange={handleB2bChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ animation: "slideIn 0.6s ease-out 0.5s both" }}>
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
                  <div style={{ animation: "slideIn 0.6s ease-out 0.6s both" }}>
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
                    </div>
                  </div>

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
                        value={b2bForm.phoneNo}
                        onChange={handleB2bChange}
                        className="w-full px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div style={{ animation: "slideIn 0.6s ease-out 0.7s both" }}>
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
                </div>

                {/* Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div style={{ animation: "slideIn 0.6s ease-out 0.8s both" }}>
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

                  <div style={{ animation: "slideIn 0.6s ease-out 0.8s both" }}>
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
                <div style={{ animation: "slideIn 0.6s ease-out 0.9s both" }}>
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
                <div style={{ animation: "slideIn 0.6s ease-out 1s both" }}>
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
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ animation: "slideIn 0.6s ease-out 1.1s both" }}
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

                {/* Login Link */}
                <div
                  className="text-center text-sm"
                  style={{ animation: "slideIn 0.6s ease-out 1.2s both" }}
                >
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/login?role=dealer"
                      className="text-teal-500 hover:text-teal-700 font-medium"
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
