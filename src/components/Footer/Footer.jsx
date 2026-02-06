"use client";
import { Instagram, Facebook, Youtube, Phone, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import BackToTopButton from "./BackToTopButton";

export default function Footer() {
  return (
    <div className="w-full px-4 mx-auto bg-blue-50 py-12">
      <footer className="max-w-7xl mx-auto">
        {/* Features Section */}
        <div className="flex flex-col md:flex-row justify-between mb-10 items-center">
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            {[
              { img: "/f1.png", text: "Family Recipe Since 1964" },
              { img: "/f4.png", text: "Satisfaction Guaranteed" },
              { img: "/f3.png", text: "Authentic Product" },
              { img: "/f2.png", text: "Eco-Friendly Manufacturing" },
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="border border-blue-800 rounded-full p-1 mr-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img
                      src={item.img}
                      alt={item.text}
                      className="max-w-full max-h-full"
                    />
                  </div>
                </div>
                <span className="text-blue-900 text-sm md:text-[16px] cursor-pointer">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[2px] mb-8 bg-gradient-to-r from-transparent via-green-600 to-transparent"></div>

        {/* Grid with responsive columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 font-semibold">
          {/* Shop */}
          <div>
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              Useful Links
            </h2>
            <ul className="space-y-3 font-semibold">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-conditions"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/refund-cancellation-policy"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Refund & Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/profile?tab=orders"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              Help
            </h2>
            <ul className="space-y-3">
              {/* <li>
                <a
                  href="/"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  FAQs
                </a>
              </li> */}
              <li>
                <a
                  href="/profile?tab=queries"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Queries
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="/profile?tab=orders"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Track Order
                </a>
              </li>

              <li>
                <a
                  href="dealership"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Dealership
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              About
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="/contact"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/WomenEmpowerment"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Women Empowerment
                </a>
              </li>

              <li>
                <Link
                  href="/about#certifications-section"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Factory & Certifications
                </Link>
              </li>
              <li>
                <Link
                  href="/about#journal-section"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  Journey
                </Link>
              </li>
              <Link
                href="/#reviews-section"
                className="text-blue-800 border-blue-300 hover:text-blue-900"
              >
                Reviews
              </Link>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="break-words max-w-full">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              Get in Touch
            </h2>

            <ul className="flex flex-wrap gap-4 md:block md:space-y-3">
              <li>
                <a
                  href="https://wa.me/919116177986"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-800 border-blue-300 hover:text-blue-900 space-x-2"
                >
                  <FaWhatsapp size={22} className="flex-shrink-0" />
                  <span className="break-all hidden md:inline">
                    +91-9116177986
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:sales@dilbahars.com"
                  className="flex items-center text-blue-800 border-blue-300 hover:text-blue-900 space-x-2"
                >
                  <Mail size={18} className="flex-shrink-0" />
                  <span className="break-all hidden md:inline">
                    sales@dilbahars.com
                  </span>
                </a>
              </li>

              <li className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/dilbahars_/"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.facebook.com/dilbahars"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.youtube.com/@DilbaharsSince1964"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  <Youtube size={20} />
                </a>
                 <a
                  href="https://www.linkedin.com/company/natural-consumer-care-marketing-pvt-ltd/"
                  className="text-blue-800 border-blue-300 hover:text-blue-900"
                >
                  <Linkedin size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[2px] my-8 bg-gradient-to-r from-transparent via-green-600 to-transparent"></div>

        <div className="mt-8 text-blue-900 text-center md:text-left cursor-pointer">
          Copyright © 2024 Dilbahar's, All rights reserved. Made by{" "}
          <a
            target="_blank"
            className="font-bold"
            href="https://getcatalyzed.com"
          >
            Get Catalyzed
          </a>
          .
        </div>
        {/*<BackToTopButton />*/}
      </footer>
    </div>
  );
}
