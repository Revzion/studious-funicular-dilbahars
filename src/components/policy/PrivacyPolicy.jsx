import React from 'react';

export default function PrivacyPolicy() {
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-center">
            Privacy Policy
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
                    Privacy Policy
                  </h2>
                </div>
                
                {/* <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 sm:p-6 border-l-4 border-blue-600 mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-blue-900">
                    Who we are
                  </h3>
                  <p className="text-sm sm:text-base text-blue-800 mb-0">
                    Our website address is: <span className="font-semibold text-blue-600">https://dilbahars.com</span>
                  </p>
                </div> */}
              </div>

              {/* Content Sections */}
              <div className="space-y-6 md:space-y-8">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    When you are on this website and are asked for personal information, you are sharing that information with <span className="font-semibold text-blue-800">Natural Consumer Care Marketing Pvt. Ltd.</span> alone, unless it is specifically stated otherwise. If the data is being collected and/or maintained by any company other than Natural Consumer Care Marketing Pvt. Ltd., you will be notified prior to the time of the data collection or transfer.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-xl p-4 sm:p-6 border border-green-200">
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    While using the site you may disclose your name, email address and some other information. Our primary goal in collecting personal information is to provide you, the user, with <span className="font-semibold text-green-800">better responses and high interactivity</span>.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    Please be aware that this website contains links to external websites and once you are on any external website, they may collect personally identifiable information about you. This privacy statement does not cover the information practices of those websites linked from this website.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-200">
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    As a general rule, <span className="font-semibold text-indigo-800">Natural Consumer Care Marketing Pvt. Ltd.</span> will not disclose or share any of your personally identifiable information except when Natural Consumer Care Marketing Pvt. Ltd. has your permission or under special circumstances, such as when Natural Consumer Care Marketing Pvt. Ltd. believes in good faith that the law requires it or as permitted in terms of this policy.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    Natural Consumer Care Marketing Pvt. Ltd. may also disclose account information in special cases when it has reasons to believe that disclosing this information is necessary to identify, contact or bring legal action against someone who may be violating our Terms of Service or may be causing injury to or interference with (either intentionally or unintentionally) Natural Consumer Care Marketing Pvt. Ltd.'s rights or property, other website users, or if Natural Consumer Care Marketing Pvt. Ltd. deems it necessary to maintain, service, and improve its products and services.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-4 sm:p-6 border border-pink-200">
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    As with all information, <span className="font-semibold text-pink-800">Natural Consumer Care Marketing Pvt. Ltd. will never rent or sell your personal, financial, or other information</span>. Unfortunately, no data transmission over the Internet can be guaranteed to be 100% secure. As a result, while Natural Consumer Care Marketing Pvt. Ltd. strives to protect your personal information, Natural Consumer Care Marketing Pvt. Ltd. cannot ensure or warrant the security of any information you transmit to Natural Consumer Care Marketing Pvt. Ltd. and you do so at your own risk.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 sm:p-6 border border-green-200">
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-0">
                    Once Natural Consumer Care Marketing Pvt. Ltd. receives your transmission, it makes best efforts to ensure its security of its systems.
                  </p>
                </div>
              </div>

              {/* Footer Section */}
              <div className="mt-8 md:mt-12 p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white">
                <div className="text-center">
                  <p className="text-sm sm:text-base font-semibold mb-2">
                    Protected by Dilbahar's Privacy Standards
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