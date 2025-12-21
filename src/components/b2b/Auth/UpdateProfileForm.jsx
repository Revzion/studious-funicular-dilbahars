"use client";

import React, { useState, useRef } from "react";
import { updateB2BProfile } from "../../../services/b2bServices";
import { Info, Upload } from "lucide-react";
import { fetchB2bUser, setB2bUser } from "@/redux/slice/b2bUserSlice";
import { useDispatch } from "react-redux";

const UpdateProfileForm = ({
  user,
  setNotification,
  closeModal,
  fetchProfile,
}) => {
  const [formData, setFormData] = useState({
    "fullname.firstname": user?.fullname?.firstname || "",
    "fullname.lastname": user?.fullname?.lastname || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    companyname: user?.companyname || "",
    gstnumber: user?.gstnumber || "",
    "address[0].addressinfo.street":
      user?.address?.[0]?.addressinfo?.street || "",
    "address[0].addressinfo.city": user?.address?.[0]?.addressinfo?.city || "",
    "address[0].addressinfo.state":
      user?.address?.[0]?.addressinfo?.state || "",
    "address[0].addressinfo.country":
      user?.address?.[0]?.addressinfo?.country || "",
    "address[0].addressinfo.pincode":
      user?.address?.[0]?.addressinfo?.pincode || "",
    "address[0].addresstype": user?.address?.[0]?.addresstype || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(user?.profile?.url || "");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData["fullname.firstname"])
      newErrors["fullname.firstname"] = "First name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phoneNo) newErrors.phoneNo = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNo))
      newErrors.phoneNo = "Phone number must be 10 digits";
    if (
      formData.gstnumber &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.gstnumber
      )
    ) {
      newErrors.gstnumber = "Invalid GST number format";
    }
    // Validate address fields if any are filled
    if (
      formData["address[0].addressinfo.street"] ||
      formData["address[0].addressinfo.city"] ||
      formData["address[0].addressinfo.state"] ||
      formData["address[0].addressinfo.country"] ||
      formData["address[0].addressinfo.pincode"] ||
      formData["address[0].addresstype"]
    ) {
      if (
        formData["address[0].addressinfo.pincode"] &&
        !/^\d{5,6}$/.test(formData["address[0].addressinfo.pincode"])
      ) {
        newErrors["address[0].addressinfo.pincode"] =
          "Pincode must be 5 or 6 digits";
      }
      if (
        formData["address[0].addresstype"] &&
        !["home", "work", "other"].includes(formData["address[0].addresstype"])
      ) {
        newErrors["address[0].addresstype"] = "Invalid address type";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profilePic: "Please upload a valid image file",
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePic: "File size must be less than 2MB",
        }));
        return;
      }
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profilePic: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const data = new FormData();

    // Append non-address fields
    const nonAddressFields = [
      "fullname.firstname",
      "fullname.lastname",
      "email",
      "phoneNo",
      "companyname",
      "gstnumber",
    ];
    nonAddressFields.forEach((key) => {
      if (formData[key]?.trim()) data.append(key, formData[key].trim());
    });

    // Append address fields only if provided
    const addressFields = {
      "address[0].addressinfo.street":
        formData["address[0].addressinfo.street"],
      "address[0].addressinfo.city": formData["address[0].addressinfo.city"],
      "address[0].addressinfo.state": formData["address[0].addressinfo.state"],
      "address[0].addressinfo.country":
        formData["address[0].addressinfo.country"],
      "address[0].addressinfo.pincode":
        formData["address[0].addressinfo.pincode"],
      "address[0].addresstype": formData["address[0].addresstype"],
    };
    if (Object.values(addressFields).some((value) => value?.trim())) {
      Object.entries(addressFields).forEach(([key, value]) => {
        if (value?.trim()) data.append(key, value.trim());
      });
    }

    // Append profile picture
    if (profilePic) {
      data.append("b2bprofile", profilePic);
    }

    try {
      const response = await updateB2BProfile(data);
      setNotification({
        message: "Profile updated successfully!",
        type: "success",
      });
      dispatch(fetchB2bUser());
      setProfilePic(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      closeModal();
      // fetchProfile();
    } catch (error) {
      setNotification({
        message: error.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      "fullname.firstname": user?.fullname?.firstname || "",
      "fullname.lastname": user?.fullname?.lastname || "",
      email: user?.email || "",
      phoneNo: user?.phoneNo || "",
      companyname: user?.companyname || "",
      gstnumber: user?.gstnumber || "",
      "address[0].addressinfo.street":
        user?.address?.[0]?.addressinfo?.street || "",
      "address[0].addressinfo.city":
        user?.address?.[0]?.addressinfo?.city || "",
      "address[0].addressinfo.state":
        user?.address?.[0]?.addressinfo?.state || "",
      "address[0].addressinfo.country":
        user?.address?.[0]?.addressinfo?.country || "",
      "address[0].addressinfo.pincode":
        user?.address?.[0]?.addressinfo?.pincode || "",
      "address[0].addresstype": user?.address?.[0]?.addresstype || "",
    });
    setProfilePic(null);
    setPreview(user?.profile?.url || "");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-full mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        Update Profile
        <span className="text-indigo-600 text-sm font-normal">
          All fields are optional unless marked *
        </span>
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                name="profile-pic"
              />
              {errors.profilePic && (
                <p className="text-red-500 text-xs mt-1">{errors.profilePic}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Max size: 2MB, Formats: PNG, JPEG, JPG
              </p>
            </div>
          </div>
        </div>
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullname.firstname"
              value={formData["fullname.firstname"]}
              onChange={handleChange}
              placeholder="Enter first name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors["fullname.firstname"]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {errors["fullname.firstname"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["fullname.firstname"]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="fullname.lastname"
              value={formData["fullname.lastname"]}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.phoneNo
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {errors.phoneNo && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyname"
            value={formData.companyname}
            onChange={handleChange}
            placeholder="Enter company name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            GST Number
            <span className="tooltiptext relative group">
              <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
              <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-4 z-10">
                Format: 22AAAAA0000A1Z5
              </span>
            </span>
          </label>
          <input
            type="text"
            name="gstnumber"
            value={formData.gstnumber}
            onChange={handleChange}
            placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.gstnumber
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {errors.gstnumber && (
            <p className="text-red-500 text-xs mt-1">{errors.gstnumber}</p>
          )}
        </div>
        {/* Address Info */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Address Information
          </h4>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address[0].addressinfo.street"
                value={formData["address[0].addressinfo.street"]}
                onChange={handleChange}
                placeholder="Enter street address"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors["address[0].addressinfo.street"]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {errors["address[0].addressinfo.street"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address[0].addressinfo.street"]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="address[0].addressinfo.city"
                  value={formData["address[0].addressinfo.city"]}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="address[0].addressinfo.state"
                  value={formData["address[0].addressinfo.state"]}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="address[0].addressinfo.country"
                  value={formData["address[0].addressinfo.country"]}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="address[0].addressinfo.pincode"
                  value={formData["address[0].addressinfo.pincode"]}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors["address[0].addressinfo.pincode"]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors["address[0].addressinfo.pincode"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["address[0].addressinfo.pincode"]}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <select
                name="address[0].addresstype"
                value={formData["address[0].addresstype"]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors["address[0].addresstype"]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              >
                <option value="">Select address type</option>
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
              {errors["address[0].addresstype"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address[0].addresstype"]}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
