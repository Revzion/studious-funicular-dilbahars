"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Phone,
  MapPin,
  Mail,
  MessageCircle,
  Package,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircleQuestion,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { sendContactMessage } from "../../services/contactService";
import { QueryFormModal } from "../Profile/QueryForm";
import Link from "next/link";
// import { toast } from '../Toast/Toast';

function ContactPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getErrorMessage = (error) => {
    if (typeof error === "string") {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.response?.data?.error) {
      return error.response.data.error;
    }

    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          return "Invalid form data. Please check your inputs.";
        case 401:
          return "Unauthorized. Please check your credentials.";
        case 403:
          return "Access denied. You do not have permission to perform this action.";
        case 404:
          return "Service not found. Please try again later.";
        case 429:
          return "Too many requests. Please wait a moment before trying again.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return "Failed to send message. Please try again.";
      }
    }

    // Fallback message
    return "Failed to send message. Please try again.";
  };

  const validateForm = () => {
    const { name, email, subject, message } = formData;

    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!subject.trim()) return "Subject is required";
    if (!message.trim()) return "Message is required";

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      // toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      // Call your API service
      const response = await sendContactMessage(formData);

      // console.log("Contact message sent successfully:", response);

      // Show success toast
      // toast.success(response.message, {
      //   duration: 2000,
      // });

      setSubmitted(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setSubmitted(false);
      }, 4000);
    } catch (error) {
      console.error("Error sending contact message:", error);

      const errorMessage = getErrorMessage(error);

      // toast.error(errorMessage, {
      //   duration: 3000,
      // });
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    {
      name: "facebook",
      icon: "https://static.vecteezy.com/system/resources/previews/018/930/698/non_2x/facebook-logo-facebook-icon-transparent-free-png.png",
      link: "https://www.facebook.com/dilbahars",
    },
    {
      name: "instagram",
      icon: "https://static.vecteezy.com/system/resources/previews/042/148/632/non_2x/instagram-logo-instagram-social-media-icon-free-png.png",
      link: "https://www.instagram.com/dilbahars_/",
    },
    {
      name: "youtube",
      icon: "youtube1.png",
      link: "https://www.youtube.com/@DilbaharsSince1964",
    },
    {
      name: "linkedin",
      icon: "linkedIn.png",
      link: "https://www.linkedin.com/company/natural-consumer-care-marketing-pvt-ltd/",
    },
  ];

  return (
    <section className="relative bg-blue-50 min-h-screen overflow-hidden pt-10">
      <section className={`px-4 md:px-8 lg:px-16`}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-900">Contact Us</h2>
          <p className="text-teal-600 text-base sm:text-lg font-medium mt-2">
            Reach out with your questions, concerns, or feedback — our support
            team is just a message away
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-blue-500"
            >
              <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                <MessageCircle className="mr-2 text-green-600" />
                Get in Touch
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-8 rounded-lg text-center"
                >
                  <Package className="mx-auto mb-4 text-green-600" size={48} />
                  <h3 className="text-xl font-bold mb-2">
                    Thank you for reaching out!
                  </h3>
                  <p>
                    Our team will get back to you promptly with the information
                    you need.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-blue-800 mb-1"
                    >
                      Your Name *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01, borderColor: "#3b82f6" }}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-100 focus:border-green-400 focus:outline-none transition-all"
                      placeholder="Your Name"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-blue-800 mb-1"
                    >
                      Email Address *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01, borderColor: "#3b82f6" }}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-100 focus:border-green-400 focus:outline-none transition-all"
                      placeholder="Email@example.com"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-blue-800 mb-1"
                    >
                      Subject *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01, borderColor: "#3b82f6" }}
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-100 focus:border-green-400 focus:outline-none transition-all"
                      placeholder="Subject of your message"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-blue-800 mb-1"
                    >
                      Your Message *
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01, borderColor: "#3b82f6" }}
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue-100 focus:border-green-400 focus:outline-none transition-all"
                      placeholder="Tell us what's on your mind..."
                      disabled={loading}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={
                      !loading
                        ? {
                            scale: 1.03,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }
                        : {}
                    }
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    disabled={loading}
                    style={{ backgroundColor: loading ? "#9ca3af" : "#349048" }}
                    className="text-white px-6 py-3 rounded-lg font-bold text-lg flex items-center justify-center w-full shadow-lg disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* <div className="bg-white rounded-2xl mt-8 p-6 md:p-8 shadow-xl border-t-4 border-green-500 transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 flex items-center">
                <MessageCircleQuestion
                  className="mr-3 text-green-600"
                  size={28}
                />
                If You Have Any Queries
              </h2>
              <p className="text-gray-600 mb-5 text-sm md:text-base">
                Feel free to reach out to us for any additional questions or
                concerns. Our team is happy to help!
              </p>
              <Link href="/query">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform transition-transform hover:scale-105">
                  Submit Query
                </button>
              </Link>
            </div> */}
          </div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* <Link href="/query">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                Submit Query
              </button>
            </Link> */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="h-52 w-full mb-6 rounded-2xl flex items-center justify-center"
            >
              <img
                src="/ContactImage.png"
                alt="Contact Image"
                className="h-full object-contain"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-green-500"
            >
              <h2 className="text-2xl font-bold text-blue-800 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-800">Phone</h3>
                    <p className="text-gray-500">+91-9116177986</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-start"
                >
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Mail className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-800">Email</h3>
                    <p className="text-gray-500">sales@dilbahars.com</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-800">
                      Location
                    </h3>
                    <p className="text-gray-500">
                      Natural Consumer Care Marketing Pvt. Ltd. G-1-763-764,
                      BLOCK 2, GROUND FLOOR, SITAPURA INDUSTRIAL AREA TONK ROAD,
                      JAIPUR, 302022 (INDIA)
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-800">
                      Location
                    </h3>
                    <p className="text-gray-500">
                      Shakun Ayurved Pvt. Ltd. G-1-763-764, BLOCK 2, GROUND
                      FLOOR, SITAPURA INDUSTRIAL AREA TONK ROAD, JAIPUR, 302022
                      (INDIA)
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
          className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
        >
          <div className="aspect-w-16 aspect-h-7">
            <div className="w-full h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.045417227015!2d75.84735777449974!3d26.77482216600442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f131!3m3!1m2!1s0x396db438c5555577%3A0x270cc114cfd18cc1!2sNatural%20Consumer%20Care%20Marketing%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1749120570095!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Location"
              ></iframe>
            </div>
          </div>
        </motion.div>

        {/* Social media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-bold text-blue-800 mb-4">
            Follow Us For Updates
          </h3>
          <div className="flex justify-center space-x-5">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{
                  scale: 1.2,
                  rotate: 10,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-br p-1  shadow-md"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 text-sm">
                  <img src={social.icon} alt="" height={150} width={150} />
                  {/* {social.icon} */}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactPage;
