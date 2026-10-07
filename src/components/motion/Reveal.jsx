import React from 'react';
import { motion } from 'framer-motion';
import { useMotionStore } from '../../store/motionStore';

// Fades its children up the first time they scroll into view.
export default function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  return (
    <motion.div
      initial={motionEnabled ? { opacity: 0, y } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
