"use client";

import { useState, useEffect } from "react";
import { Lock, Loader } from "lucide-react";
import { changePasswordService } from "@/services/b2cServices";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const params = useSearchParams();
  const token = params.get("token");
    const router = useRouter();

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid or missing token");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await changePasswordService({ token, password, confirmPassword });
      setMessage("Password changed successfully. You can now log in.");
      setPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-900 mb-4">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter and confirm your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="New password"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2 h-4 w-4" /> Changing...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${message.includes("successfully") ? "text-teal-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
