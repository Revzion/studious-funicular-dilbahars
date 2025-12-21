"use client";
import React from "react";

const logos = [
  "/certificates/fssc22000.png",
  "/certificates/gmp.png",
  "/certificates/Haccp.png",
  "/certificates/Halal (2).png",
  "/certificates/iso.png",
  "/certificates/iso14001 (2).png",
  "/certificates/iso22000 (2).png",
  "/certificates/iso45001 (2).png",
  "/certificates/kosher.png",
  // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsjxk8I6Cb8Q3J-OIyMs_GB7K3VqJj7y3brA&s",
];

const CertificateCarousel = ({ id }) => {
  return (
    <div id={id} className="w-full overflow-hidden py-6">
      {" "}
      <h2 className="text-center text-3xl text-teal-700">Our Certifications</h2>
      <div className="flex w-[200%] certificate-scroll cursor-pointer">
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`logo-${index}`}
            className="w-[20vw] max-w-[100px] sm:w-[14vw] md:w-[10vw] lg:w-[8vw] mx-4 aspect-[1/2] md:aspect-[1/2] object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default CertificateCarousel;
