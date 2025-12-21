// 'use client';
// import React from 'react';

// const WomenEmpowerment = () => {
//   const sections = [
//     {
//       id: 1,
//       title: "Breaking Barriers",
//       content: "Women are shattering glass ceilings across every industry, from technology and finance to politics and science. Today's women leaders are not just participating—they're innovating, leading transformative changes, and creating pathways for future generations to follow with confidence and determination.",
//       image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
//     },
//     {
//       id: 2,
//       title: "Education Excellence",
//       content: "Education is the cornerstone of empowerment. Women today represent the majority of university graduates globally, excelling in STEM fields, medicine, law, and business. Every educated woman becomes a catalyst for change, lifting not just herself but her entire community towards progress and prosperity.",
//       image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
//     },
//     {
//       id: 3,
//       title: "Economic Independence",
//       content: "Financial freedom unlocks infinite possibilities. Women entrepreneurs are creating businesses, generating employment, and contributing significantly to global economic growth. From startups to multinational corporations, women are proving that economic empowerment transforms societies and builds stronger, more inclusive economies.",
//       image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop"
//     },
//     {
//       id: 4,
//       title: "Leadership & Governance",
//       content: "Women in leadership bring diverse perspectives, collaborative approaches, and innovative solutions to complex global challenges. From boardrooms to parliaments, women leaders are reshaping decision-making processes and creating more inclusive, effective governance that benefits everyone in society.",
//       image: "https://images.unsplash.com/photo-1594736797933-d0bc48d12d0a?w=800&h=600&fit=crop"
//     },
//     {
//       id: 5,
//       title: "Future Changemakers",
//       content: "The next generation of women is rising with unprecedented opportunities and unwavering determination. Through mentorship, technology access, and supportive communities, we're nurturing future leaders who will continue advancing gender equality and creating a more equitable world for all.",
//       image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Women Empowerment
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Celebrating strength, resilience, and the limitless potential of women worldwide
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
//                   animationFillMode: 'forwards'
//                 }}
//               >
//                 <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
//                   <div className={`flex flex-col ${isOdd ? 'lg:flex-row' : 'lg:flex-row-reverse'} min-h-[400px]`}>
                    
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
                        
//                         <div className="pt-4">
//                           <button className="group/btn bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
//                             Explore More
//                             <span className="inline-block ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">
//                               →
//                             </span>
//                           </button>
//                         </div>
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

'use client';
import React, { useState } from 'react';
import { Award, Calendar, ExternalLink, X, CheckCircle } from 'lucide-react';

const CertificationsShowcase = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  const certifications = [
    {
      id: 1,
      title: "Women Leadership Excellence",
      issuer: "Global Leadership Institute",
      date: "2024",
      level: "Expert",
      category: "Leadership",
      description: "Advanced certification in women leadership development, strategic decision-making, and organizational transformation.",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
      credentialId: "WLE-2024-5847",
      skills: ["Strategic Leadership", "Team Management", "Decision Making", "Change Management"]
    },
    {
      id: 2,
      title: "Digital Marketing Mastery",
      issuer: "Digital Marketing Academy",
      date: "2024",
      level: "Professional",
      category: "Marketing",
      description: "Comprehensive certification covering social media marketing, content strategy, and digital advertising campaigns.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      credentialId: "DMM-2024-3921",
      skills: ["Social Media Marketing", "Content Strategy", "SEO", "Analytics"]
    },
    {
      id: 3,
      title: "Financial Planning & Analysis",
      issuer: "Finance Professionals Board",
      date: "2023",
      level: "Advanced",
      category: "Finance",
      description: "Specialized certification in financial planning, investment analysis, and risk management for women entrepreneurs.",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
      credentialId: "FPA-2023-7654",
      skills: ["Financial Analysis", "Investment Planning", "Risk Assessment", "Budget Management"]
    },
    {
      id: 4,
      title: "Project Management Professional",
      issuer: "Project Management Institute",
      date: "2023",
      level: "Expert",
      category: "Management",
      description: "Industry-standard certification for project management excellence with focus on agile methodologies and team leadership.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
      credentialId: "PMP-2023-8901",
      skills: ["Project Planning", "Agile Methodology", "Resource Management", "Quality Assurance"]
    },
    {
      id: 5,
      title: "Data Science & Analytics",
      issuer: "Tech Academy International",
      date: "2023",
      level: "Professional",
      category: "Technology",
      description: "Advanced certification in data analysis, machine learning, and business intelligence for data-driven decision making.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      credentialId: "DSA-2023-4567",
      skills: ["Data Analysis", "Machine Learning", "Python", "Business Intelligence"]
    },
    {
      id: 6,
      title: "Entrepreneurship & Innovation",
      issuer: "Women Entrepreneurs Network",
      date: "2022",
      level: "Advanced",
      category: "Business",
      description: "Comprehensive program covering startup development, funding strategies, and innovative business model design.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
      credentialId: "EI-2022-9876",
      skills: ["Business Development", "Funding Strategies", "Innovation", "Market Research"]
    }
  ];

  const categories = [...new Set(certifications.map(cert => cert.category))];

  const getLevelColor = (level) => {
    switch(level) {
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      case 'Advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Professional': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Leadership': 'bg-pink-100 text-pink-800',
      'Marketing': 'bg-green-100 text-green-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Management': 'bg-indigo-100 text-indigo-800',
      'Technology': 'bg-cyan-100 text-cyan-800',
      'Business': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional Certifications
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Showcasing expertise through industry-recognized certifications and continuous learning achievements
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-pink-600 mb-2">{certifications.length}</div>
            <div className="text-gray-600 font-medium">Total Certifications</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length}</div>
            <div className="text-gray-600 font-medium">Categories</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {certifications.filter(cert => cert.level === 'Expert').length}
            </div>
            <div className="text-gray-600 font-medium">Expert Level</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">2024</div>
            <div className="text-gray-600 font-medium">Latest Year</div>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer opacity-0 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'forwards'
              }}
              onClick={() => setSelectedCert(cert)}
            >
              {/* Certificate Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(cert.level)}`}>
                    {cert.level}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(cert.category)}`}>
                    {cert.category}
                  </span>
                </div>
              </div>

              {/* Certificate Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-gray-600 font-medium mb-3">{cert.issuer}</p>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{cert.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {cert.date}
                  </div>
                  <ExternalLink className="w-5 h-5 text-pink-500 group-hover:text-pink-600 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Certificate Details */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              {/* Modal Header */}
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(selectedCert.category)}`}>
                      {selectedCert.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(selectedCert.level)}`}>
                      {selectedCert.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCert.title}</h2>
                <p className="text-xl text-gray-600 mb-4">{selectedCert.issuer}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Issue Date</div>
                    <div className="font-semibold text-gray-900">{selectedCert.date}</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Credential ID</div>
                    <div className="font-semibold text-gray-900">{selectedCert.credentialId}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedCert.description}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Acquired</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium flex items-center"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    View Certificate
                  </button>
                  <button className="flex-1 border-2 border-pink-500 text-pink-600 py-3 px-6 rounded-full font-semibold hover:bg-pink-50 transition-all duration-300">
                    Verify Credential
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          animation: fade-in 0.6s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CertificationsShowcase;