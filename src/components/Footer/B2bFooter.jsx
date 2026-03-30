"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Mail, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur border-t border-gray-200  shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left */}
        <div className="text-sm text-gray-600 text-center md:text-left">
          © {new Date().getFullYear()} Dilbahars. All rights reserved.
        </div>

        {/* Right - Contact + Social */}
        <ul className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 items-center">
          
          {/* WhatsApp */}
          <li>
            <a
              href="https://wa.me/919116177986"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-teal-600 transition space-x-2"
            >
              <FaWhatsapp size={20} />
              <span className="hidden md:inline">+91-9116177986</span>
            </a>
          </li>

          {/* Email */}
          <li>
            <a
              href="mailto:sales@dilbahars.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-teal-600 transition space-x-2"
            >
              <Mail size={18} />
              <span className="hidden md:inline">sales@dilbahars.com</span>
            </a>
          </li>

          {/* Social Icons */}
          <li className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/dilbahars_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-teal-600 transition"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://www.facebook.com/dilbahars"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-teal-600 transition"
            >
              <Facebook size={20} />
            </a>

            <a
              href="https://www.youtube.com/@DilbaharsSince1964"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-teal-600 transition"
            >
              <Youtube size={20} />
            </a>

            <a
              href="https://www.linkedin.com/company/natural-consumer-care-marketing-pvt-ltd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-teal-600 transition"
            >
              <Linkedin size={20} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;