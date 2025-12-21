import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, CreditCard } from 'lucide-react';

export default function RefundCancellationPolicy() {
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
            Refund & Cancellation Policy
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl lg:max-w-7xl xl:max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            
            {/* Introduction */}
            <div className="mb-8 md:mb-10">
              <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-green-600 rounded-full mr-4"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">
                  Refund & Cancellation Policy
                </h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 sm:p-6 md:p-8 border-l-4 border-blue-600">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-blue-800 mb-0">
                  At <span className="font-bold text-blue-900">Dilbahar’s</span>, we always strive to deliver products that bring joy, nostalgia, and satisfaction. However, if there’s ever an issue with your order, we’re here to help.
                </p>
              </div>
            </div>

            {/* Return Eligibility */}
            <div className="mb-8 md:mb-10">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-3" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900">
                  Return Eligibility
                </h3>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 sm:p-6 md:p-8 border border-green-200">
                <p className="text-sm sm:text-base md:text-lg font-medium text-green-800 mb-4">
                  You may request a return or replacement under the following conditions:
                </p>
                <div className="grid gap-4 sm:gap-6">
                  {[
                    { title: 'Wrong Product', desc: 'You received an item different from what you ordered.', color: 'from-red-50 to-pink-50 border-red-200' },
                    { title: 'Wrong Quantity', desc: 'The number of items delivered does not match your order.', color: 'from-orange-50 to-red-50 border-orange-200' },
                    { title: 'Damaged Product', desc: 'The product or its packaging was damaged upon delivery.', color: 'from-yellow-50 to-orange-50 border-yellow-200' },
                    { title: 'Significantly Different', desc: 'The product received is substantially different from its online description.', color: 'from-blue-50 to-indigo-50 border-blue-200' }
                  ].map((item, index) => (
                    <div key={index} className={`bg-gradient-to-r ${item.color} rounded-xl p-4 sm:p-6 border flex flex-col sm:flex-row items-start sm:items-center`}>
                      <span className="font-semibold text-sm sm:text-base text-gray-800 mb-1 sm:mb-0 sm:mr-3">{index + 1}. {item.title}:</span>
                      <span className="text-sm sm:text-base text-gray-700">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Return Exceptions */}
            <div className="mb-8 md:mb-10">
              <div className="flex items-center mb-6">
                <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mr-3" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-900">
                  Return Exceptions
                </h3>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 sm:p-6 md:p-8 border border-red-200">
                <p className="font-semibold text-red-800 mb-4 text-sm sm:text-base">
                  We are unable to accept returns if the product:
                </p>
                <div className="space-y-3">
                  {[
                    'Has been used, consumed, or altered in any way.',
                    'Shows physical damage to the packaging or product.',
                    'Is returned without the original packaging and labels.',
                    'Has a tampered or missing serial/batch number.'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-sm sm:text-base text-red-700">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm sm:text-base text-red-800">
                  If you receive an <span className="font-semibold">empty parcel</span>, please report it to our customer support within <span className="font-semibold">24 hours</span> of delivery.
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-8 md:mb-10">
              <div className="flex items-center mb-6">
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">
                  Cancellation Policy
                </h3>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 sm:p-6 md:p-8 border border-blue-200">
                <ul className="space-y-3 text-sm sm:text-base text-blue-800">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    Orders can be cancelled within <span className="font-semibold">24 hours of placement</span> or <span className="font-semibold">before the order is shipped</span>, whichever occurs first.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    Once an order has been shipped, cancellation will not be possible.
                  </li>
                </ul>
              </div>
            </div>

            {/* Refunds */}
            <div className="mb-8 md:mb-10">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-3" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900">
                  Refunds
                </h3>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 sm:p-6 md:p-8 border border-green-200">
                <ul className="space-y-3 text-sm sm:text-base text-green-800">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    Refunds are initiated within <span className="font-semibold">3–10 Working days</span> after your return or cancellation is approved.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    For online payments (credit/debit card, net banking, UPI), the amount will be credited back to the same account.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    For Cash on Delivery (COD) orders, we will require your bank details (Account Holder Name, Bank Name, IFSC Code, and Account Number) to process the refund via NEFT.
                  </li>
                </ul>
              </div>
            </div>

            {/* Return Process */}
            <div className="mb-8 md:mb-10">
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mr-3" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-900">
                  Return Process
                </h3>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 md:p-8 border border-indigo-200">
                <ul className="space-y-3 text-sm sm:text-base text-indigo-800">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    Returns are typically processed within 7 Working days of receiving your request.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    Once approved, a reverse pickup will be arranged through our courier partner.
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    The courier partner will make up to two pickup attempts. If unsuccessful (e.g., the packet isn’t ready or the recipient is unavailable), the return request will be considered cancelled.
                  </li>
                </ul>
              </div>
            </div>

            {/* Shipping Charges */}
            <div className="mb-8 md:mb-10">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 md:p-8 border border-yellow-200">
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-orange-900 mb-4">
                  Shipping Charges
                </h4>
                <p className="text-sm sm:text-base text-orange-800">
                  We’ll refund the <span className="font-semibold">product value</span> once your return is approved.<br />
                  If a product is returned for any other reason (including order refusal upon delivery), <span className="font-semibold">one-way shipping charges will be deducted</span> from your refund amount.
                </p>
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-8 md:mt-12 p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white">
              <div className="text-center">
                <p className="text-sm sm:text-base font-semibold mb-2">
                  Your Satisfaction is Our Priority
                </p>
                <p className="text-xs sm:text-sm opacity-90 mb-3">
                  Contact us for any queries regarding returns and refunds
                </p>
                <div className="w-16 sm:w-20 h-1 bg-white/30 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}