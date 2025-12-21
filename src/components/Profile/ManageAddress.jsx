import React, { useState, useEffect } from "react";
import { MapPin, MoreVertical, Edit, Trash2, X, Plus } from "lucide-react";
import {
  addB2cAddressService,
  deleteB2cAddressService,
  updateB2cAddressService,
  getProfileService,
} from "@/services/b2cServices";
// import { toast } from "../Toast/Toast";

const ManageAddresses = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    customType: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getProfileService();
        setUser(response.user);
        setAddresses(response.user?.address || []);
      } catch (error) {
        const errorMessage = error.message || "Failed to fetch user data";
        // toast.error(errorMessage);
        console.error("Fetch user error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const resetForm = () => {
    setFormData({
      type: "",
      customType: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    setError("");
    setIsPincodeVerified(false);
  };

  const handleAddNew = () => {
    resetForm();
    setEditingAddressId(null);
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleEdit = (address) => {
    setFormData({
      type: address.addresstype,
      customType: address.customType || "",
      street: address.addressinfo.street,
      city: address.addressinfo.city,
      state: address.addressinfo.state,
      country: address.addressinfo.country,
      pincode: address.addressinfo.pincode,
    });
    setEditingAddressId(address._id);
    setShowForm(true);
    setActiveDropdown(null);
    setIsPincodeVerified(true); // Assume existing addresses are verified
  };

  const handleDelete = async (addressId) => {
    try {
      setIsLoading(true);
      await deleteB2cAddressService(addressId);
      const response = await getProfileService();
      setUser(response.user);
      setAddresses(response.user?.address || []);
      setError("");
      // toast.success("Address deleted successfully!");
    } catch (error) {
      const errorMessage = error.message || "Failed to delete address";
      // toast.error(errorMessage);
      console.error("Address delete error:", error);
    } finally {
      setIsLoading(false);
    }
    setActiveDropdown(null);
  };

  const validatePincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  };

  const handlePincodeCheck = async (pincode) => {
    if (!pincode) {
      setError("Pincode is required");
      setIsPincodeVerified(false);
      return;
    }

    if (!validatePincode(pincode)) {
      setError("Invalid pincode. Please enter a valid 6-digit Indian pincode");
      setIsPincodeVerified(false);
      return;
    }

    try {
      setIsPincodeLoading(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0]?.Status !== "Success") {
        setError("Invalid pincode. Please enter a correct Indian pincode");
        setIsPincodeVerified(false);
        return;
      }

      const postOffice = data[0]?.PostOffice[0];
      if (postOffice) {
        setFormData((prev) => ({
          ...prev,
          state: postOffice.State,
          city: postOffice.District,
          country: "India",
        }));
        setIsPincodeVerified(true);
        setError("");
      }
    } catch (error) {
      setError("Failed to verify pincode. Please try again.");
      setIsPincodeVerified(false);
      console.error("Pincode API error:", error);
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const handlePincodeBlur = async (e) => {
    const pincode = e.target.value;
    if (!pincode) {
      setError("Pincode is required");
      setIsPincodeVerified(false);
      return;
    }

    if (!validatePincode(pincode)) {
      setError("Invalid pincode. Please enter a valid 6-digit Indian pincode");
      setIsPincodeVerified(false);
      return;
    }

    try {
      setIsPincodeLoading(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0]?.Status !== "Success") {
        setError("Invalid pincode. Please enter a correct Indian pincode");
        setIsPincodeVerified(false);
        return;
      }

      const postOffice = data[0]?.PostOffice[0];
      if (postOffice) {
        setFormData((prev) => ({
          ...prev,
          state: postOffice.State,
          city: postOffice.District,
          country: "India",
        }));
        setIsPincodeVerified(true);
        setError("");
      }
    } catch (error) {
      setError("Failed to verify pincode. Please try again.");
      setIsPincodeVerified(false);
      console.error("Pincode API error:", error);
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.type ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.country ||
      !formData.pincode
    ) {
      const errorMessage = "Please fill in all fields";
      // toast.error(errorMessage);
      setError(errorMessage);
      return;
    }

    if (formData.type === "other" && !formData.customType) {
      const errorMessage = "Please specify custom address type";
      // toast.error(errorMessage);
      setError(errorMessage);
      return;
    }

    if (!isPincodeVerified) {
      const errorMessage = "Please verify the pincode before saving";
      // toast.error(errorMessage);
      setError(errorMessage);
      return;
    }

    try {
      setIsLoading(true);

      if (editingAddressId) {
        // Update existing address
        const addressData = {
          addresstype: formData.type,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        };

        if (formData.type === "other") {
          addressData.customType = formData.customType;
        }

        await updateB2cAddressService(editingAddressId, addressData);
        // toast.success("Address updated successfully!");
      } else {
        // Add new address
        const addressData = {
          addresstype: formData.type,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        };

        if (formData.type === "other" && formData.customType) {
          addressData.customType = formData.customType;
        }

        await addB2cAddressService(addressData);
        // toast.success("Address added successfully!");
      }

      const response = await getProfileService();
      setUser(response.user);
      setAddresses(response.user?.address || []);
      setShowForm(false);
      resetForm();
      setEditingAddressId(null);
      setError("");
    } catch (error) {
      const errorMessage = error.message || "Failed to save address";
      // toast.error(errorMessage);
      setError(errorMessage);
      console.error("Address save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
    setEditingAddressId(null);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode" && value.length > 6) {
      return; // Prevent input beyond 6 digits
    }
    const newValue = name === "pincode" ? value.replace(/[^0-9]/g, "") : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
    setError("");
    if (name === "pincode") {
      setIsPincodeVerified(false);
      if (newValue.length === 6) {
        handlePincodeCheck(newValue);
      }
    }
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className=" bg-white pb-10">
      {!showForm && (
        <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Manage Addresses</h1>
          <button
            onClick={handleAddNew}
            disabled={isLoading}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add New Address
          </button>
        </div>
      )}

      {/* Address Form - Inline */}
      {showForm && (
        <div className="mb-8 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select type</option>
                <option value="home">Home</option>
                <option value="work">Office</option>
                <option value="other">Other</option>
              </select>
            </div>
            {formData.type === "other" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Address Type
                </label>
                <input
                  type="text"
                  name="customType"
                  value={formData.customType}
                  onChange={handleInputChange}
                  placeholder="e.g. Gym, School, Friend's House"
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                maxLength={6}
                inputMode="numeric"
                required
                disabled={isLoading || isPincodeLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {isPincodeLoading && (
                <div className="absolute right-3 top-9">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading || isPincodeLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading || isPincodeLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                disabled={isLoading || isPincodeLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || isPincodeLoading || !isPincodeVerified}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? editingAddressId
                    ? "Updating..."
                    : "Adding..."
                  : editingAddressId
                  ? "Update Address"
                  : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && !user ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No addresses saved
          </h3>
          <p className="text-gray-600 mb-4">
            Add your addresses for faster checkout
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-1 pl-2 pr-2">
          {addresses.map((address) => {
            const displayAddress = {
              id: address._id,
              type:
                address.addresstype === "other" && address.customType
                  ? address.customType
                  : address.addresstype,
              name:
                `${user?.fullname?.firstname || ""} ${
                  user?.fullname?.lastname || ""
                }`.trim() || "User",
              street: address.addressinfo.street,
              city: address.addressinfo.city,
              state: address.addressinfo.state,
              zipCode: address.addressinfo.pincode,
              phone: user?.phoneNo || "N/A",
            };
            return (
              <div
                key={displayAddress.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-blue-600" size={20} />
                    <span className="font-medium text-gray-900">
                      {displayAddress.type}
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(displayAddress.id)}
                      disabled={isLoading}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                    {activeDropdown === displayAddress.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleEdit(address)}
                          disabled={isLoading}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address._id)}
                          disabled={isLoading}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={14} />
                          {isLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {displayAddress.name}
                  </p>
                  <p>{displayAddress.street}</p>
                  <p>
                    {displayAddress.city}, {displayAddress.state}{" "}
                    {displayAddress.zipCode}
                  </p>
                  <p>{displayAddress.phone}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default ManageAddresses;
