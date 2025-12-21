import React from 'react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 right-8 w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-cyan-200 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-green-200 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-3/4 w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-200 rounded-full animate-pulse"></div>
        </div>
        
        {/* Decorative Spice Jars */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-2 sm:space-x-3 md:space-x-4 opacity-30">
            {[
              'bg-cyan-300', 'bg-blue-400', 'bg-green-400', 
              'bg-indigo-400', 'bg-teal-400', 'bg-blue-500', 'bg-green-500'
            ].map((color, index) => (
              <div 
                key={index}
                className={`w-8 h-10 sm:w-12 sm:h-16 md:w-16 md:h-20 ${color} rounded-lg transform hover:scale-110 transition-transform duration-300`}
              ></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-4 text-center leading-tight">
            Terms & Conditions
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl lg:max-w-7xl xl:max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed">
              
              {/* Header Section */}
              <div className="mb-8 md:mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-green-600 rounded-full mr-4"></div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">
                    Terms & Conditions
                  </h2>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-6 md:space-y-8">

                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-blue-900">
                    Website Terms of Use
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    Welcome to our website!<br/>
                    By accessing, browsing, or using this site, you agree that you have read, understood, and accepted the following terms and conditions. If you do not agree, we kindly request that you discontinue using the site.<br/>
                    We may update or modify these terms and any website content at any time without prior notice. Your continued use of the website indicates your acceptance of any such changes.
                  </p>
                </div>

                {/* Copyright & IP */}
                <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-xl p-4 sm:p-6 border border-green-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-green-900">
                    Copyright & Intellectual Property
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    All content on this website — including text, images, graphics, designs, product names, logos, and trademarks — is the property of <span className="font-semibold text-green-800">Natural Consumer Care Marketing Pvt. Ltd.</span> and is protected by applicable copyright and intellectual property laws.<br/>
                    No part of this website may be reproduced, distributed, or transmitted in any form without prior written consent from <span className="font-semibold text-green-800">Natural Consumer Care Marketing Pvt. Ltd.</span><br/>
                    Access to this website does not grant you any license or right to use any intellectual property displayed herein without authorization.
                  </p>
                </div>

                {/* Accuracy */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-blue-900">
                    Accuracy of Information
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    While we strive to keep all information up to date and accurate, this website may occasionally contain technical inaccuracies, typographical errors, or outdated data.<br/>
                    <span className="font-semibold text-blue-800">Natural Consumer Care Marketing Pvt. Ltd.</span> does not accept liability for any errors or omissions and makes no warranty about the completeness, accuracy, or reliability of the information. Use of any information or material from this website is solely at your own risk.
                  </p>
                </div>

                {/* Information You Share */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-indigo-900">
                    Information You Share
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    Any data, suggestions, feedback, or material shared with <span className="font-semibold text-indigo-800">Natural Consumer Care Marketing Pvt. Ltd.</span> through this website will be considered non-confidential and non-proprietary.<br/>
                    By submitting such content, you grant us a worldwide, irrevocable, royalty-free license to use, reproduce, display, modify, and distribute that material for business or communication purposes.
                  </p>
                </div>

                {/* External Links */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-purple-900">
                    External Links
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    Our website may include links to external sites for your convenience. These links do not imply endorsement or responsibility for the content or policies of those third-party websites.<br/>
                    We encourage you to review their privacy and security policies before engaging with them.<br/>
                    <span className="font-semibold text-purple-800">Natural Consumer Care Marketing Pvt. Ltd.</span> bears no responsibility for viruses, malware, or other harmful components that may arise from using external links.
                  </p>
                </div>

                {/* Limitation of Liability */}
                <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-4 sm:p-6 border border-pink-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-pink-900">
                    Limitation of Liability
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    In no event shall <span className="font-semibold text-pink-800">Natural Consumer Care Marketing Pvt. Ltd.</span> be held liable for any direct, indirect, incidental, or consequential damages — including loss of profits, data, or business interruption — arising from the use or inability to use this website or any linked site, even if we have been advised of the possibility of such damages.
                  </p>
                </div>

                {/* Closing */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 sm:p-6 border border-teal-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-teal-900">
                    Stay Responsible, Stay Informed
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    Your use of this website signifies your acceptance of these terms. We appreciate your trust and encourage you to check back periodically for updates or revisions to these Terms of Use.
                  </p>
                </div>
              </div>

              {/* Footer Section */}
              <div className="mt-8 md:mt-12 p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white">
                <div className="text-center">
                  <p className="text-sm sm:text-base font-semibold mb-2">
                    Protected by Dilbahar's Standards
                  </p>
                  <div className="w-16 sm:w-20 h-1 bg-white/30 rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}