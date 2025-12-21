"use client";

import React, { useEffect, useRef } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { AppWindow } from "lucide-react";

const timelineItems = [
  {
    title: "1964 - THE HUMBLE BEGINNING",
    desc: "In 1964, with an initial investment of Rs. 80, the journey of Dilbahar’s began. Manufacturing commenced in the family kitchen, and the products were sold from a small rented shop in Jaipur.",
    date: "1964 ",
    bg: "#EFFFFA",
    arrow: "#EFFFFA",
    iconBg: "#a6e1e9",
  },
  {
    title: "1980 - TRANSITION AND GROWTH",
    desc: "As demand increased significantly, to meet this demand, Dilbahar’s adopted semi-automatic machines and modernized operations.",
    date: "1980 ",
    bg: "#EFFFFA",
    arrow: "#EFFFFA",
    iconBg: "#7cd8bd",
  },
  {
    title: "1991 - ESTABLISHMENT OF THE FIRST FACTORY ",
    desc: "A pivotal moment arrived in 1991 when Dilbahar’s constructed its first dedicated factory spanning in 500 sq Yards area ",
    date: "1991",
    bg: "#EFFFFA",
    arrow: "#EFFFFA",
    iconBg: "#a6e1e9",
  },
  {
    title: "1995 - MODERN TRADE & E-COM. PIONEER",
    desc: "Digestives & Mukhwas to the modern retail landscape. This pioneering step laid the foundation for future growth and cemented Dilbahar’s as a trailblazer in its category within Modern Trade. Dilbahar’s adapted to the changing",
    date: "1995",
    bg: "#EFFFFA",
    arrow: "#EFFFFA",
    iconBg: "#7cd8bd",
  },
  {
    title: "2001 - NATIONAL AND INTERNATIONAL RECOGNITION",
    desc: "By 2001, the brand grew in popularity not only in India but also in Beyond national limits. International recognition followed. Also, new manufacturing unit were setup.",
    date: "2001",
    bg: "#EFFFFA",
    arrow: "#EFFFFA",
    iconBg: "#a6e1e9",
  },
  {
    title: "2024 - PRIVATE LABELING PARTNERS (DABUR / DS / BIG BASKET)",
    desc: "PRIVATE LABELING PARTNERS (DABUR / DS / BIG BASKET)",
    date: "2024",
    bg: "#EFFFFA",
    arrow: "#EFFFFA",
    iconBg: "#7cd8bd",
  },
  //   {
  //     title: 'Bachelor Degree',
  //     desc: 'Creative Direction, Visual Design',
  //     date: '2002 - 2006',
  //     bg: '#e9f5f9',
  //     arrow: '#e9f5f9',
  //     iconBg: '#92cbdf',
  //   },
];

const Journey = ({ id }) => {
  const elementsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elementsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div id={id} className="py-16 overflow-hidden bg-[#DBFCE7]">
      {" "}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-indigo-900">Our Journey</h2>
        <p className="text-teal-600 text-base sm:text-lg font-medium mt-2">
          Dilbahar's Flovarful legacy spans generation - from sweet suparies to
          digestive churans, <br /> each product is crafted with love,
          tradition, and taste
        </p>
      </div>
      <VerticalTimeline animate={false} lineColor={"#2596be"}>
        {timelineItems.map((item, index) => {
          const position = index % 2 === 0 ? "left" : "right";
          const animationClass =
            position === "left" ? "animate-from-left" : "animate-from-right";

          return (
            <div
              key={index}
              ref={(el) => (elementsRef.current[index] = el)}
              className={`${animationClass}`}
            >
              <VerticalTimelineElement
                className="vertical-timeline-element--work"
                position={position}
                contentStyle={{
                  background: item.bg,
                  // height: '200px',
                  color: "#000",
                  borderTop: "5px solid #165a72",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "20px",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
                contentArrowStyle={{ borderRight: `7px solid ${item.arrow}` }}
                iconStyle={{ background: item.iconBg, color: "#fff" }}
                date={item.date}
                icon={<AppWindow />}
              >
                <h3 className="vertical-timeline-element-title">
                  {item.title}
                </h3>
                {/* <h4 className="vertical-timeline-element-subtitle">{item.subtitle}</h4> */}
                <p>{item.desc}</p>
              </VerticalTimelineElement>
            </div>
          );
        })}
      </VerticalTimeline>
    </div>
  );
};

export default Journey;
