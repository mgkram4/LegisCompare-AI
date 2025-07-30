
import { motion } from 'framer-motion';
import React from 'react';

const LoadingAnimation: React.FC = () => {
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%'],
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        className="w-32 h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
        variants={shimmerVariants}
        animate="animate"
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Processing your bills...</p>
    </div>
  );
};

export default LoadingAnimation; 