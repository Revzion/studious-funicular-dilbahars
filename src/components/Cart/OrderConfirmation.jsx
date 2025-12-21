"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Star,
  Sparkles,
  Truck,
  Shield,
  Clock,
} from "lucide-react";

const OrderConfirmation = ({ orderData }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Use orderData directly, no dummy data
  const order = orderData || {
    orderNumber: "",
    totalAmount: 0,
    discountAmount: 0,
    shippingCharge: 0,
    payableAmount: 0,
    shippingAddress: "",
  };

  useEffect(() => {
    if (orderData) {
      setIsVisible(true);
      setConfettiActive(true);

      // Staggered animation timing
      const timer1 = setTimeout(() => setAnimationStep(1), 200);
      const timer2 = setTimeout(() => setAnimationStep(2), 600);
      const timer3 = setTimeout(() => setAnimationStep(3), 1000);
      const confettiTimer = setTimeout(() => setConfettiActive(false), 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(confettiTimer);
      };
    }
  }, [orderData]);

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const handleViewOrders = () => {
    router.push("/profile?tab=orders");
  };

  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 py-8 px-4 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-r from-purple-200/30 to-blue-200/30 animate-float`}
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Confetti */}
      {confettiActive && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-sm"
                style={{
                  backgroundColor: [
                    "#ff6b6b",
                    "#4ecdc4",
                    "#45b7d1",
                    "#f9ca24",
                    "#f0932b",
                    "#eb4d4b",
                    "#6c5ce7",
                    "#a29bfe",
                  ][Math.floor(Math.random() * 8)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto relative mt-30 z-20">
        {/* Main Success Card */}
        <div
          className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 mb-6 transform transition-all duration-1000 ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-10 opacity-0 scale-95"
          }`}
        >
          {/* Success Icon and Header */}
          <div className="text-center mb-6">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div
                className={`w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-1000 ${
                  animationStep >= 1 ? "scale-100 animate-pulse" : "scale-0"
                }`}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div
                className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center transform transition-all duration-1000 ${
                  animationStep >= 1 ? "animate-spin scale-100" : "scale-0"
                }`}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            <h1
              className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 transform transition-all duration-1000 delay-200 ${
                animationStep >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              Order Confirmed!
            </h1>
            <p
              className={`text-sm text-gray-600 mb-3 transform transition-all duration-1000 delay-300 ${
                animationStep >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              Thank you for your purchase! Your order has been successfully
              placed.
            </p>
            {order.orderNumber && (
              <div
                className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full border border-purple-200/50 transform transition-all duration-1000 delay-400 ${
                  animationStep >= 1
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <Package className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">
                  Order #{order.orderNumber}
                </span>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div
            className={`grid md:grid-cols-2 gap-6 mb-6 transform transition-all duration-1000 delay-500 ${
              animationStep >= 2
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-xl p-5 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Order Details
              </h3>
              <div className="space-y-2">
                {order.totalAmount > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/70">
                    <p className="text-sm font-medium text-gray-700">
                      Total Amount
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                )}
                {order.discountAmount > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/70">
                    <p className="text-sm font-medium text-gray-700">
                      Discount
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      -₹{order.discountAmount}
                    </p>
                  </div>
                )}
                {order.shippingCharge > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/70">
                    <p className="text-sm font-medium text-gray-700">
                      Shipping Charge
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      ₹{order.shippingCharge}
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 text-base font-bold">
                  <span className="text-gray-800">Payable Amount:</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    ₹{order.payableAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            {order.shippingAddress && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-600" />
                  Shipping Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Shipping Address:
                    </p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rating Prompt */}
          {/* <div
            className={`bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-200/50 transform transition-all duration-1000 delay-600 ${
              animationStep >= 2
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Rate Your Experience
                </h3>
                <p className="text-xs text-gray-600">
                  Help us improve by rating your shopping experience
                </p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-amber-400 fill-current cursor-pointer hover:scale-110 transition-all duration-200 hover:text-amber-500"
                  />
                ))}
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 justify-center transform transition-all duration-1000 delay-700 ${
              animationStep >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <button
              onClick={handleViewOrders}
              className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              View All Orders
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleContinueShopping}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Continue Shopping
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* What's Next Section */}
        <div
          className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-5 transform transition-all duration-1000 delay-800 ${
            animationStep >= 3
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              What's Next?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-600">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <p className="font-medium text-gray-800">Order Processing</p>
                <p className="text-center">
                  We'll prepare your order for shipment
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <p className="font-medium text-gray-800">Quality Check</p>
                <p className="text-center">Each item is carefully inspected</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-medium text-gray-800">Fast Delivery</p>
                <p className="text-center">
                  Your order will be delivered quickly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-confetti {
          animation: confetti 3s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
