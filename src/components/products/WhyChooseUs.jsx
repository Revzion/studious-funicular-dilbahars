'use client';

import { motion } from 'framer-motion';
import {
  Candy, Leaf, Box, ShoppingBag, Users, ThumbsUp
} from 'lucide-react';

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: <Leaf size={28} className="text-green-600" />,
      title: 'Natural Ingredients',
      description: 'Tasty treats made from traditional herbs and fruits.',
    },
    {
      icon: <Candy size={28} className="text-blue-600" />,
      title: 'Diverse Range',
      description: 'From candies to mukhwas, churans to combos — all in one place.',
    },
    {
      icon: <Users size={28} className="text-green-600" />,
      title: 'For All Age Groups',
      description: 'Loved by kids, adults, and seniors alike.',
    },
    {
      icon: <ShoppingBag size={28} className="text-blue-600" />,
      title: 'Easy Ordering',
      description: 'Smooth and quick shopping experience.',
    },
    {
      icon: <Box size={28} className="text-green-600" />,
      title: 'Secure Packaging',
      description: 'Delivered fresh with utmost care.',
    },
    {
      icon: <ThumbsUp size={28} className="text-blue-600" />,
      title: 'Trusted Brand',
      description: 'Known for hygiene, flavor, and satisfaction.',
    },
  ];

  return (
    <div className="py-16 ">
      <motion.div
        className="max-w-7xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-indigo-900"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Why People Love Dilbahar's?
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-xl border border-blue-100 hover:border-green-200 hover:shadow-2xl transition-transform"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-4 flex justify-center items-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-xl text-green-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}