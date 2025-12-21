
"use client";

const AboutDilbahar = () => {
  return (
    <section className="   min-h-screen bg-[#EFFFFA] py-12 px-4 md:px-8 lg:px-16">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#F05A22]">
          About Dilbahar’s
        </h2>
        <p className="text-[#FBBF24] text-base sm:text-lg font-medium mt-2">
          At Dilbahar's, we believe health should be joyful!
        </p>
      </div>

      {/* Content Row */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/AboutSection.png"
            alt="Dilbahar's Family"
            className="w-full h-auto rounded-lg object-contain"
            priority
          />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 space-y-6 text-gray-800 text-base sm:text-lg">
          <p>
            Rooted in the ancient science of <strong>“Ayurveda”</strong>, our
            journey began with the desire to bring{" "}
            <strong>“traditional Indian digestive wisdom”</strong> into every
            household — in a form that’s not just healthy but also delicious.
          </p>
          <p>
            From the <strong>“tangy churans”</strong> kids crave, to the{" "}
            <strong>“soothing herbs”</strong> elders trust, Dilbahar's is a
            celebration of <strong>“India’s rich food heritage”</strong>. Every
            product is a reminder of <strong>“your dadi-nani’s kitchen”</strong>,
            reimagined for today’s lifestyle.
          </p>
          <p>
            With our playful sub-brand <strong>“Funtush”</strong>, we bring
            natural mouth fresheners and premium treats — with or without
            artificial flavors, all <strong>“FSSAI-approved”</strong> and made
            with love.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-10">
        <p className="text-center text-lg text-[#F05A22] italic">
          Because we don’t just make digestives — we pass on a tradition of
          care, taste, and wellness.
        </p>
      </div>
    </section>
  );
};

export default AboutDilbahar;
