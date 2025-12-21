import React, { useEffect, useState } from "react";
import { User, Smartphone } from "lucide-react";
import {
  updateB2cProfileService,
  getProfileService,
} from "../../services/b2cServices";
// import { toast } from "../Toast/Toast";
import {
  sendEmailOtpService,
  sendPhoneOtpService,
  verifyEmailOtpService,
  verifyPhoneOtpService,
} from "../../services/b2cAuthServices";

export const ProfileInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailOtpTimer, setEmailOtpTimer] = useState(300); // 5 minutes
  const [resendEmailOtpDisabled, setResendEmailOtpDisabled] = useState(true);

  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(300);
  const [resendPhoneOtpDisabled, setResendPhoneOtpDisabled] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const [originalFormData, setOriginalFormData] = useState({});

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await getProfileService();
      // console.log("Profile data:", response);

      if (response.success && response.user) {
        setUser(response.user);
        const userData = {
          firstName: response.user.fullname?.firstname || "",
          lastName: response.user.fullname?.lastname || "",
          email: response.user.email || "",
          mobile: response.user.phoneNo || "",
        };
        setFormData(userData);
        setOriginalFormData(userData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message || "Failed to fetch profile data");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    let interval;
    if (isVerifyingEmail && emailOtpTimer > 0) {
      interval = setInterval(() => {
        setEmailOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (emailOtpTimer === 0) {
      setResendEmailOtpDisabled(false);
    }
    return () => clearInterval(interval);
  }, [emailOtpTimer, isVerifyingEmail]);

  useEffect(() => {
  let interval;
  if (isVerifyingPhone && phoneOtpTimer > 0) {
    interval = setInterval(() => {
      setPhoneOtpTimer((prev) => prev - 1);
    }, 1000);
  } else if (phoneOtpTimer === 0) {
    setResendPhoneOtpDisabled(false);
  }
  return () => clearInterval(interval);
}, [phoneOtpTimer, isVerifyingPhone]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateOtp = (otp) => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  };

  const handleSendEmailOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setEmailError("Please enter an email address");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setEmailError("");
    setEmailSuccess("");
    try {
      const response = await sendEmailOtpService({ email: formData.email });
      console.log("sendEmailOtp response:", response);
      setEmailSuccess(response.message);
      setIsVerifyingEmail(true);
      setEmailOtpTimer(300);
      setResendEmailOtpDisabled(true);
    } catch (err) {
      console.log("sendEmailOtp error:", err);
      setEmailError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setEmailError("Please enter an email address");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setEmailError("");
    setEmailSuccess("");
    try {
      const response = await sendEmailOtpService({ email: formData.email });
      console.log("resendEmailOtp response:", response);
      setEmailSuccess("OTP resent successfully");
      setEmailOtpTimer(300);
      setResendEmailOtpDisabled(true);
    } catch (err) {
      console.log("resendEmailOtp error:", err);
      setEmailError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false)
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) {
      setEmailError("Please enter OTP");
      return;
    }
    if (!validateOtp(emailOtp)) {
      setEmailError("OTP must be exactly 6 digits");
      return;
    }
    setLoading(true);
    setEmailError("");
    setEmailSuccess("");
    try {
      const response = await verifyEmailOtpService({ otp: emailOtp });
      console.log("verifyEmailOtp response:", response);
      setEmailSuccess(response.message);
      setIsVerifyingEmail(false);
      setEmailOtp("");
      await fetchUserProfile();
    } catch (err) {
      console.log("verifyEmailOtp error:", err);
      setEmailError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!formData.mobile) {
      setPhoneError("Please enter a phone number");
      return;
    }
    setLoading(true);
    setPhoneError("");
    setPhoneSuccess("");
    try {
      const response = await sendPhoneOtpService({ phoneNo: formData.mobile });
      setPhoneSuccess(response.message);
      setIsVerifyingPhone(true);
      setPhoneOtpTimer(300);
      setResendPhoneOtpDisabled(true);
    } catch (err) { 
      setPhoneError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    setLoading(true);
    try {
      const response = await sendPhoneOtpService({ phoneNo: formData.mobile });
      setPhoneSuccess("OTP resent successfully");
      setPhoneOtpTimer(300);
      setResendPhoneOtpDisabled(true);
    } catch (err) {
      setPhoneError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) {
      setPhoneError("Please enter OTP");
      return;
    }
    if (!/^\d{6}$/.test(phoneOtp)) {
      setPhoneError("OTP must be exactly 6 digits");
      return;
    }
    setLoading(true);
    try {
      const response = await verifyPhoneOtpService({ otp: phoneOtp });
      setPhoneSuccess(response.message);
      setIsVerifyingPhone(false);
      setPhoneOtp("");
      await fetchUserProfile(); // refresh user
    } catch (err) {
      setPhoneError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

const handleSaveChanges = async () => {
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const profileData = new FormData();
    profileData.append("fullname.firstname", formData.firstName);
    profileData.append("fullname.lastname", formData.lastName);
    profileData.append("email", formData.email);
    profileData.append("phoneNo", formData.mobile);

    const response = await updateB2cProfileService(profileData);
    setSuccess(response.message || "Profile updated successfully!");
    setIsEditing(false);
    await fetchUserProfile(); // Refresh profile data
  } catch (error) {
    setError(error.message || "Failed to update profile");
    console.error("Profile update error:", error);
  } finally {
    setLoading(false);
  }
};
const handleCancel = () => {
  setFormData({ ...originalFormData });
  setIsEditing(false);
  setError("");
  setSuccess("");
  setEmailOtp("");
  setEmailSuccess("");
  setEmailError("");
};

const handleEditToggle = () => {
  if (isEditing) {
    handleSaveChanges();
  } else {
    setIsEditing(true);
    setError("");
    setSuccess("");
  }
};

  if (profileLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden ">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Personal Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account details and preferences
            </p>
          </div>
          <button
            onClick={handleEditToggle}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-800 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <User className="h-4 w-4 mr-2" />
            {loading
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {(success || error) && (
        <div className="px-4 sm:px-6 lg:px-8 pt-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 text-green-400">✓</div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 text-red-400">!</div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form
          className="space-y-6 sm:space-y-8"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Name Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  disabled={!isEditing || loading}
                  required
                  className={`w-full px-4 py-3 sm:py-4 border rounded-lg text-sm sm:text-base transition-all duration-200 ${
                    isEditing && !loading
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                />
                {isEditing && !loading && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  disabled={!isEditing || loading}
                  required
                  className={`w-full px-4 py-3 sm:py-4 border rounded-lg text-sm sm:text-base transition-all duration-200 ${
                    isEditing && !loading
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                />
                {isEditing && !loading && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <label className=" block text-sm font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  {user.emailVerified && formData.email === user.email ? (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Verified
                    </span>
                  ) : formData.email ? (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={loading || isVerifyingEmail}
                      className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                    >
                      Verify
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Email not verified
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing || loading}
                    required
                    className={`w-full px-4 py-3 sm:py-4 border rounded-lg text-sm sm:text-base transition-all duration-200 ${
                      isEditing && !loading
                        ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        : "border-gray-200 bg-white cursor-not-allowed"
                    }`}
                  />
                </div>
                {isEditing && isVerifyingEmail && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      pattern="\d{6}"
                      title="OTP must be exactly 6 digits"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Time remaining: {emailOtpTimer} seconds
                      </span>
                      <button
                        type="button"
                        onClick={handleResendEmailOtp}
                        disabled={resendEmailOtpDisabled || loading}
                        className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={loading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
                    >
                      Submit OTP
                    </button>
                  </div>
                )}
                {emailSuccess && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    {emailSuccess}
                  </div>
                )}
                {emailError && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {emailError}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  {user.phoneNoVerified && formData.mobile === user.phoneNo ? (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Verified
                    </span>
                  ) : formData.mobile ? (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={loading || isVerifyingPhone}
                      className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                    >
                      Verify
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Phone not verified
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    disabled={!isEditing || loading}
                    required
                    className={`w-full px-4 py-3 sm:py-4 border rounded-lg text-sm sm:text-base transition-all duration-200 ${
                      isEditing && !loading
                        ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        : "border-gray-200 bg-white cursor-not-allowed"
                    }`}
                  />
                </div>
                {/* In the Contact Information section, replace the phone OTP rendering block */}
{isVerifyingPhone && (
  <div className="space-y-2">
    <input
      type="text"
      placeholder="Enter 6-digit OTP"
      value={phoneOtp}
      onChange={(e) => setPhoneOtp(e.target.value)}
      className="w-full px-4 py-3 border rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
    />
    <div className="flex justify-between items-center">
      <span className="text-gray-600">
        Time remaining: {phoneOtpTimer} seconds
      </span>
      <button
        type="button"
        onClick={handleResendPhoneOtp}
        disabled={resendPhoneOtpDisabled || loading}
        className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
      >
        Resend OTP
      </button>
    </div>
    <button
      type="button"
      onClick={handleVerifyPhoneOtp}
      disabled={loading}
      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
    >
      Submit OTP
    </button>
  </div>
)}
                {phoneSuccess && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    {phoneSuccess}
                  </div>
                )}
                {phoneError && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {phoneError}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons for Mobile */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
