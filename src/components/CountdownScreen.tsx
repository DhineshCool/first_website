import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface CountdownScreenProps {
  onComplete: () => void;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number>(5);

  useEffect(() => {
    if (count > 1) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finishTimer);
    }
  }, [count, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center select-none py-12">
      {/* Decorative Washi Tape */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        className="mb-8 px-6 py-2 bg-[#FFF8E7] rounded shadow-sm border border-amber-200/60 inline-flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-[#801336]" />
        <span className="font-dancing text-xl font-bold text-[#801336]">
          The Celebration Is Starting!
        </span>
        <Heart className="w-3.5 h-3.5 fill-[#F49CB4] text-[#801336]" />
      </motion.div>

      {/* Italic Serif Subtitle */}
      <p className="font-playfair italic text-2xl sm:text-3xl text-[#801336]/80 mb-4 tracking-wide">
        Get ready...
      </p>

      {/* Large Bold Serif Numeral */}
      <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center my-4">
        {/* Pulsing decorative circular halo */}
        <div className="absolute inset-0 rounded-full bg-[#F49CB4]/25 animate-ping opacity-60" />
        <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#801336]/30 animate-spin-slow" />

        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ opacity: 0, scale: 0.4, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.4, y: -20 }}
            transition={{ type: 'spring', damping: 15, stiffness: 280 }}
            className="font-playfair text-8xl sm:text-9xl font-bold text-[#801336] drop-shadow-sm"
          >
            {count}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="font-dancing text-2xl text-[#801336] mt-6">
        ✨ A magical moment awaits Hebziba ✨
      </p>
    </div>
  );
};
