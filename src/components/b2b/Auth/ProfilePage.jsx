"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getB2BProfile } from "../../../services/b2bServices";
import UpdateProfileForm from "./UpdateProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import {
  User,
  Mail,
  Phone,
  Building,
  FileText,
  MapPin,
  X,
  Edit,
  Lock,
  Shield,
} from "lucide-react";
import { fetchB2bUser, setB2bUser } from "@/redux/slice/b2bUserSlice";

const ProfilePage = ({ setNotification }) => {
  const [user, setUser] = useState({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const response = await getB2BProfile();
      setUser(response.user);
      // dispatch(fetchB2bUser());
    } catch (error) {
      setNotification({
        message: error.message || "Failed to fetch profile",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [setNotification]);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    fetchProfile(); // Fetch updated profile when modal closes
  };
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full overflow-y-auto">
        <div className="flex flex-col lg:flex-row items-start gap-6 h-[calc(100vh-200px)]">
          {/* Profile Avatar Section */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border-0 p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  {user?.profile?.url ? (
                    <img
                      src={user.profile.url}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {user?.fullname?.firstname || "User"}{" "}
                {user?.fullname?.lastname || ""}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {user?.email || "user@example.com"}
              </p>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={openProfileModal}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Edit className="h-4 w-4" />
                  Update Profile
                </button>
                <button
                  onClick={openPasswordModal}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* User Details Card */}
          <div className="w-full lg:w-3/4 flex-grow">
            <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Personal Information
                    </h3>
                    <p className="text-indigo-100 text-sm">
                      Your account details and business information
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Details */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Personal Details
                    </h4>

                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 group-hover:bg-indigo-50 transition-colors duration-200">
                        <div className="w-10 h-10 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Full Name
                          </p>
                          <p className="text-gray-600">
                            {user?.fullname?.firstname || "N/A"}{" "}
                            {user?.fullname?.lastname || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 group-hover:bg-indigo-50 transition-colors duration-200">
                        <div className="w-10 h-10 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                          <Mail className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Email Address
                          </p>
                          <p className="text-gray-600">
                            {user?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 group-hover:bg-indigo-50 transition-colors duration-200">
                        <div className="w-10 h-10 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                          <Phone className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Phone Number
                          </p>
                          <p className="text-gray-600">
                            {user?.phoneNo || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Business Details
                    </h4>

                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 group-hover:bg-purple-50 transition-colors duration-200">
                        <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                          <Building className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Company Name
                          </p>
                          <p className="text-gray-600">
                            {user?.companyname || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 group-hover:bg-purple-50 transition-colors duration-200">
                        <div className="w-10 h-10 bg-purple-100 group-hover underestimated:bg-purple-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            GST Number
                          </p>
                          <p className="text-gray-600">
                            {user?.gstnumber || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 group-hover:bg-purple-50 transition-colors duration-200">
                        <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Business Address
                          </p>
                          <p className="text-gray-600 leading-relaxed">
                            {user?.address?.[0]?.addressinfo
                              ? `${user.address[0].addressinfo.street || ""}, ${
                                  user.address[0].addressinfo.city || ""
                                }, ${
                                  user.address[0].addressinfo.state || ""
                                }, ${
                                  user.address[0].addressinfo.country || ""
                                } - ${
                                  user.address[0].addressinfo.pincode || ""
                                }`
                              : "No address provided"}
                          </p>
                          {user?.address?.[0]?.addresstype && (
                            <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                              {user.address[0].addresstype}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Update Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 bg-gray-500/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Edit className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Update Profile
                  </h3>
                </div>
                <button
                  onClick={closeProfileModal}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <UpdateProfileForm
                  user={user}
                  setNotification={setNotification}
                  closeModal={closeProfileModal} // Pass updated closeProfileModal
                  fetchProfile={fetchProfile}
                />
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-gray-500/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-red-500 to-pink-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Change Password
                  </h3>
                </div>
                <button
                  onClick={closePasswordModal}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <ChangePasswordForm setNotification={setNotification} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
