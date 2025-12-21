// "use client";
// import React from "react";

// const WomenEmpowerment = () => {
//   const sections = [
//     {
//       id: 1,
//       title: "Breaking Barriers",
//       content:
//         "Women are shattering glass ceilings across every industry, from technology and finance to politics and science. Today's women leaders are not just participating—they're innovating, leading transformative changes, and creating pathways for future generations to follow with confidence and determination.",
//       image:
//         "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
//     },
//     {
//       id: 2,
//       title: "Education Excellence",
//       content:
//         "Education is the cornerstone of empowerment. Women today represent the majority of university graduates globally, excelling in STEM fields, medicine, law, and business. Every educated woman becomes a catalyst for change, lifting not just herself but her entire community towards progress and prosperity.",
//       image:
//         "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
//     },
//     {
//       id: 3,
//       title: "Economic Independence",
//       content:
//         "Financial freedom unlocks infinite possibilities. Women entrepreneurs are creating businesses, generating employment, and contributing significantly to global economic growth. From startups to multinational corporations, women are proving that economic empowerment transforms societies and builds stronger, more inclusive economies.",
//       image:
//         "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop",
//     },
//     {
//       id: 4,
//       title: "Leadership & Governance",
//       content:
//         "Women in leadership bring diverse perspectives, collaborative approaches, and innovative solutions to complex global challenges. From boardrooms to parliaments, women leaders are reshaping decision-making processes and creating more inclusive, effective governance that benefits everyone in society.",
//       image:
//         "https://images.unsplash.com/photo-1594736797933-d0bc48d12d0a?w=800&h=600&fit=crop",
//     },
//     {
//       id: 5,
//       title: "Future Changemakers",
//       content:
//         "The next generation of women is rising with unprecedented opportunities and unwavering determination. Through mentorship, technology access, and supportive communities, we're nurturing future leaders who will continue advancing gender equality and creating a more equitable world for all.",
//       image:
//         "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Women Empowerment
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Celebrating strength, resilience, and the limitless potential of
//             women worldwide
//           </p>
//         </div>

//         <div className="space-y-24">
//           {sections.map((section, index) => {
//             const isOdd = section.id % 2 === 1;

//             return (
//               <div
//                 key={section.id}
//                 className="group transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in"
//                 style={{
//                   animationDelay: `${index * 0.2}s`,
//                   animationFillMode: "forwards",
//                 }}
//               >
//                 <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
//                   <div
//                     className={`flex flex-col ${
//                       isOdd ? "lg:flex-row" : "lg:flex-row-reverse"
//                     } min-h-[400px]`}
//                   >
//                     {/* Image Section */}
//                     <div className="lg:w-1/2 relative overflow-hidden">
//                       <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 z-10"></div>
//                       <img
//                         src={section.image}
//                         alt={section.title}
//                         className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                         loading="lazy"
//                       />
//                       <div className="absolute inset-0 bg-black/10 z-20"></div>
//                     </div>

//                     {/* Text Content Section */}
//                     <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
//                       <div className="space-y-6">
//                         <div className="flex items-center space-x-4">
//                           <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                             {section.id}
//                           </div>
//                           <div className="h-px bg-gradient-to-r from-pink-500 to-purple-600 flex-1"></div>
//                         </div>

//                         <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
//                           {section.title}
//                         </h2>

//                         <p className="text-lg text-gray-600 leading-relaxed">
//                           {section.content}
//                         </p>

//                         {/* <div className="pt-4">
//                           <button className="group/btn bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
//                             Explore More
//                             <span className="inline-block ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">
//                               →
//                             </span>
//                           </button>
//                         </div> */}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.8s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default WomenEmpowerment;


"use client";

import React from "react";

const WomenEmpowerment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Women Empowerment
          </h1>
        </div>

        <div className="space-y-24">

          {/* Section 1 */}
          <div className="group transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in" style={{ animationDelay: "0s", animationFillMode: "forwards" }}>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
              <div className="flex flex-col lg:flex-row min-h-[400px]">
                {/* Image */}
                <div className="lg:w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
                    alt="Empowering Women, Enriching Communities"
                    className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 z-20"></div>
                </div>

                {/* Text */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        1
                      </div>
                      <div className="h-px bg-gradient-to-r from-pink-500 to-purple-600 flex-1"></div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      Empowering Women, Enriching Communities
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      At Dilbahar’s, we firmly believe that progress is most sustainable when it is inclusive. Honoring India’s timeless tradition of women craftsmanship while embracing a future-focused mindset, we are proud that <b>over 70% of our workforce comprises talented women</b> from nearby villages.
                      <br /><br />
                      These incredible women bring not only skill and dedication, but also a unique sense of warmth, discipline, and attention to quality that reflects in every product we craft.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="group transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
              <div className="flex flex-col lg:flex-row-reverse min-h-[400px]">
                <div className="lg:w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                    alt="Safe Journeys"
                    className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 z-20"></div>
                </div>

                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        2
                      </div>
                      <div className="h-px bg-gradient-to-r from-pink-500 to-purple-600 flex-1"></div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      Opportunity Beyond Employment
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      To foster an environment of dignity, safety, and growth, we have enabled:
                      <br /><br />
                      ✅ <b>Dedicated cab transportation</b> for women who travel from distant villages, ensuring safe, reliable commuting every day.<br />
                      ✅ <b>Equal skill-development opportunities</b> to upskill and scale their earning potential.<br />
                      ✅ <b>A respectful, inclusive workplace culture</b> rooted in empathy and professional growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="group transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
              <div className="flex flex-col lg:flex-row min-h-[400px]">
                <div className="lg:w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop"
                    alt="Social Impact"
                    className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 z-20"></div>
                </div>

                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        3
                      </div>
                      <div className="h-px bg-gradient-to-r from-pink-500 to-purple-600 flex-1"></div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      Creating Social Impact at the Grassroots
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Every woman who joins our workforce multiplies her impact:
                      <br /><br />
                      • She contributes to her household income,<br />
                      • Inspires financial independence,<br />
                      • Drives education access for children,<br />
                      • And transforms her community’s perception of women at work.
                      <br /><br />
                      This isn’t just employment — it’s <b>empowerment with purpose</b>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="group transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
              <div className="flex flex-col lg:flex-row-reverse min-h-[400px]">
                <div className="lg:w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 z-10"></div>
                  <img
                    src="https://plus.unsplash.com/premium_photo-1664300446487-7feebcbc2471?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d29tZW4lMjBlbXBvd2VybWVudCUyMGNyYWZ0aW5nfGVufDB8fDB8fHww"
                    alt="Strong Values"
                    className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 z-20"></div>
                </div>

                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        4
                      </div>
                      <div className="h-px bg-gradient-to-r from-pink-500 to-purple-600 flex-1"></div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      Crafted by Strong Hands, Guided by Strong Values
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      As custodians of a brand with legacy, we remain humble yet ambitious. We continue to innovate our processes, modernize our operations, and think outside the box — without losing sight of the traditions that shaped us.
                      <br /><br />
                      Our women are the backbone of what we produce, and their stories are woven into every jar, every candy, every batch that leaves our factory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="group transition-all duration-700 hover:scale-[1.02] opacity-0 animate-fade-in" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
              <div className="flex flex-col lg:flex-row min-h-[400px]">
                <div className="lg:w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop"
                    alt="Together We Rise"
                    className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 z-20"></div>
                </div>

                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        5
                      </div>
                      <div className="h-px bg-gradient-to-r from-pink-500 to-purple-600 flex-1"></div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      Together, We Rise
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      From rural homes to global shelves, their journey symbolizes resilience, progress, and pride.<br />
                      And we are committed to expanding this initiative — building pathways for more women to learn, earn, and lead.
                      <br /><br />
                      <b>Because when women rise, communities transform.<br />
                      And when communities transform, a nation accelerates.</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WomenEmpowerment;