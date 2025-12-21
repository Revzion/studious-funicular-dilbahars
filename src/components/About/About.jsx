import { useState } from 'react';

const AboutDilbahar = ({ hero }) => {
  const [showMore, setShowMore] = useState(false);
  // const basePt = hero ? "pt-2 md:pt-2 lg:pt-2" : "pt-2 md:pt-2 lg:pt-2";
  
  return (
    <section className={`bg-[#EFFFFA] pb-16 px-4 md:px-8 lg:px-16`}>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-indigo-900">
          About us
        </h2>
        <p className="text-teal-600 text-base sm:text-lg font-medium mt-2">
          We are dedicated to excellence, offering high-quality products that combine Ayurvedic tradition with modern consumer needs.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <img
            src="/AboutSection.png"
            alt="Dilbahar's Family"
            className="w-full h-auto rounded-lg object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6 text-gray-800 text-base text-justify sm:text-lg">
          {/* Mobile view with read more functionality */}
          <div className="block md:hidden">
            <p>
              Established in 1964, <strong>Dilbahar’s</strong> has grown from a family-run business into a global leader in manufacturing and distributing high-quality <strong>Sweet Suparis</strong>, <strong>Yummy Digestives (Churans)</strong>, and <strong>Mouth Fresheners</strong>. With decades of experience, we take pride in offering an array of superior-quality products, catering to both local and international markets.
            </p>
            
            {showMore && (
              <>
                <p className="mt-6">
                  We provide a diverse range of products under well-recognized brands, each synonymous with quality and customer satisfaction:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>
                    <strong>Dilbahar’s Yummy Digestive (Churan):</strong> Our premium range of ayurvedic digestive products.
                  </li>
                  <li>
                    <strong>Sweet Supari:</strong> Traditional, delicious sweet supari, crafted to perfection.
                  </li>
                </ul>
              </>
            )}
            
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-4 text-teal-600 font-medium hover:text-teal-700 transition-colors duration-200  rounded"
            >
              {showMore ? "Read Less" : "Read More"}
            </button>
          </div>

          {/* Desktop view - unchanged */}
          <div className="hidden md:block space-y-6">
            <p>
              Established in 1964, <strong>Dilbahar’s</strong> has grown from a family-run business into a global leader in manufacturing and distributing high-quality <strong>Sweet Suparis</strong>, <strong>Yummy Digestives (Churans)</strong>, and <strong>Mouth Fresheners</strong>. With decades of experience, we take pride in offering an array of superior-quality products, catering to both local and international markets.
            </p>
            <p>
              We provide a diverse range of products under well-recognized brands, each synonymous with quality and customer satisfaction:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Dilbahar’s Yummy Digestive (Churan):</strong> Our premium range of ayurvedic digestive products.
              </li>
              <li>
                <strong>Sweet Supari:</strong> Traditional, delicious sweet supari, crafted to perfection.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <div className="mt-10">
        <p className="text-center text-lg text-teal-600 italic">
          Because we don't just make digestives — we pass on a tradition of
          care, taste, and wellness.
        </p>
      </div> */}
    </section>
  );
};

export default AboutDilbahar;