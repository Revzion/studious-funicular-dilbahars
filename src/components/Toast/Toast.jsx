"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simple global toast state manager
let toastManager = {
  listeners: [],
  addToast: (toast) => {
    toastManager.listeners.forEach((listener) => listener(toast));
  },
  subscribe: (listener) => {
    toastManager.listeners.push(listener);
    return () => {
      toastManager.listeners = toastManager.listeners.filter(
        (l) => l !== listener
      );
    };
  },
};

// Toast functions that can be imported anywhere
export const toast = {
  success: (message, duration = 1000) => {
    toastManager.addToast({ type: "success", message, duration });
  },
  error: (message, duration = 1000) => {
    toastManager.addToast({ type: "error", message, duration });
  },
  warning: (message, duration = 1000) => {
    toastManager.addToast({ type: "warning", message, duration });
  },
  info: (message, duration = 1000) => {
    toastManager.addToast({ type: "info", message, duration });
  },
};

// Toast container component
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((toast) => {
      const id = Date.now();
      const newToast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      // Auto remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 1000); // Use provided duration or default to 1000ms
    });

    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Toast config for different types with your theme colors
  const toastConfig = {
    success: {
      containerBg:
        "bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600",
      iconBg: "bg-emerald-600 text-white",
      textColor: "text-emerald-800",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      ),
    },
    error: {
      containerBg:
        "bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500",
      iconBg: "bg-red-500 text-white",
      textColor: "text-red-800",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
      ),
    },
    warning: {
      containerBg:
        "bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500",
      iconBg: "bg-amber-500 text-white",
      textColor: "text-amber-800",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
        </svg>
      ),
    },
    info: {
      containerBg:
        "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600",
      iconBg: "bg-blue-600 text-white",
      textColor: "text-blue-800",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
        </svg>
      ),
    },
  };

  return (
    <div
      className="fixed top-4 right-4 flex flex-col gap-3 z-50"
      style={{ zIndex: 1000 }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type] || toastConfig.info;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex items-center w-full max-w-sm p-4 rounded-xl shadow-lg backdrop-blur-sm ${config.containerBg}`}
              role="alert"
            >
              <div
                className={`inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-full shadow-sm ${config.iconBg}`}
              >
                {config.icon}
              </div>
              <div
                className={`ms-3 text-sm font-medium ${config.textColor} leading-relaxed`}
              >
                {toast.message}
              </div>
              <button
                type="button"
                className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-2 hover:bg-white/50 inline-flex items-center justify-center h-8 w-8 transition-colors duration-200 ${config.textColor} hover:text-gray-700`}
                onClick={() => removeToast(toast.id)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
