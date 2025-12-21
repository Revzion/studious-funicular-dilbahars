import { useState, useEffect } from "react";

// Simple visibility hook with optional delay (in seconds)
const useInView = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000); // delay in seconds

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Single FAQ item
const FAQItem = ({ question, answer, delay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isVisible = useInView(delay);

  return (
    <div
      className={`mb-4 w-full transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div
        className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-lg text-gray-800">{question}</h3>
        <button className="text-blue-500 focus:outline-none transition-transform duration-300 transform">
          {isOpen ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>
      </div>

      <div
        className={`bg-white px-4 overflow-hidden transition-all duration-300 rounded-b-lg ${
          isOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

export default function ProductFAQ({ faqData = [], name = "FAQs" }) {
  const isTitleVisible = useInView(0.1);

  // Fallback message if no FAQs passed
  const hasFAQs = faqData && faqData.length > 0;

  return (
    <div className="w-full py-16 px-4 bg-opacity-75 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-repeat"></div>

      <div className="container mx-auto relative">
        <div
          className={`max-w-3xl mx-auto mb-12 transition-all duration-700 transform ${
            isTitleVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-4xl font-bold mb-6 text-indigo-900">FAQ</h2>
          <div className="w-54 h-1 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 mb-8"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          {hasFAQs ? (
            faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                delay={0.2 + index * 0.1}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No FAQs available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
