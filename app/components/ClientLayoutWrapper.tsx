'use client';

import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function ClientLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {children}
      </motion.main>
      <Toaster />
    </>
  );
} 