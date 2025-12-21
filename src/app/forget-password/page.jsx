// ForgotPassword.jsx
"use client";

import { useState } from "react";
import { Mail, Loader } from "lucide-react";
import { forgetPasswordService } from "@/services/b2cServices";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await forgetPasswordService(email);
      setMessage("Reset link sent to your email");
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-900 mb-4">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your registered email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                <Loader className="animate-spin mr-2 h-4 w-4" /> Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-teal-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
