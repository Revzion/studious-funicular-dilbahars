"use client";

import { useState } from "react";
import { Lock, Loader } from "lucide-react";
import { resetPasswordService } from "@/services/b2cServices";
// import { toast } from "../Toast/Toast";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("New password must be different from old password.");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordService({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      // toast.success(res.message || "Password changed successfully!");
      setSuccessMessage(res.message || "Password changed successfully!");

      setTimeout(() => {
        setSuccessMessage(""); // Auto-hide after 3 sec
      }, 3000);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      // toast.error(error.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
      </div>
      <div className="bg-white p-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-44 text-m font-semibold text-gray-600">
              Old Password
            </label>
            <div className="relative w-full">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Old Password"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-44 text-m font-semibold text-gray-600">
              New Password
            </label>
            <div className="relative w-full">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-44 text-m font-semibold text-gray-600">
              Confirm New Password
            </label>
            <div className="relative w-full">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2 h-4 w-4" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
          {successMessage && (
            <div className="mt-4 text-green-600 font-medium text-sm text-center">
              {successMessage}
            </div>
          )}
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Password must be at least 6 characters long</p>
        </div>
      </div>
    </>
  );
}
