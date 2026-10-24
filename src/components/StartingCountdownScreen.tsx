import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Heart, Gift, PartyPopper } from 'lucide-react';

interface StartingCountdownScreenProps {
  onEnterPasscode: () => void;
  targetDate?: string;
  recipientName?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export const StartingCountdownScreen: React.FC<StartingCountdownScreenProps> = ({
  onEnterPasscode,
  targetDate = '2026-10-27T00:00:00',
  recipientName = 'Hebziba',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  const [overrideArrival, setOverrideArrival] = useState<boolean | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPassed: true,
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isPassed: false,
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isCelebrationToday = overrideArrival !== null ? overrideArrival : timeLeft.isPassed;

  return (
    <div className="w-full flex flex-col items-center py-2 sm:py-3 select-none text-center">
      {/* Decorative Washi Tape Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        className="mb-3 px-4 py-1 bg-[#FFF8E7] rounded shadow-sm border border-amber-200/60 inline-flex items-center gap-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#801336]" />
        <span className="font-dancing text-base sm:text-lg font-bold text-[#801336]">
          Hebziba's 22nd Birthday • October 27 💖
        </span>
        <Heart className="w-3.5 h-3.5 fill-[#F49CB4] text-[#801336]" />
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mb-3 sm:mb-4"
      >
        <span className="font-dancing text-lg sm:text-xl text-[#801336] block mb-0.5">
          A special milestone for my best friend
        </span>
        <h1 className="font-playfair text-2xl sm:text-4xl font-extrabold text-[#801336] tracking-tight">
          Counting Down to <br />
          <span className="bg-gradient-to-r from-[#801336] via-[#9E1B43] to-[#F49CB4] bg-clip-text text-transparent underline decoration-[#F49CB4]/40 decoration-wavy">
            {recipientName} Turning 22!
          </span>
        </h1>
        <p className="font-dancing text-xs sm:text-sm text-[#801336]/80 mt-1">
          "Counting every second until 22 arrives for my favorite human"
        </p>
      </motion.div>

      {/* 4 Polaroid-Style Countdown Cards */}
      <div className="w-full max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-2">
        {[
          { label: 'DAYS', value: timeLeft.days, rotation: -1.5 },
          { label: 'HOURS', value: timeLeft.hours, rotation: 1.5 },
          { label: 'MINUTES', value: timeLeft.minutes, rotation: -1.5 },
          { label: 'SECONDS', value: timeLeft.seconds, rotation: 1.5 },
        ].map((unit, idx) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            style={{ rotate: `${unit.rotation}deg` }}
            className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-scrapbook-card border border-rose-100 flex flex-col items-center justify-center relative cursor-default h-22 sm:h-24"
          >
            {/* Pink Heart Pin at Top Center */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#F49CB4] border border-white shadow-sm flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 fill-[#801336] text-[#801336]" />
            </div>

            {/* Numerical Digit */}
            <span className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#801336] tabular-nums mt-0.5 leading-tight">
              {String(unit.value).padStart(2, '0')}
            </span>

            {/* Label */}
            <span className="font-playfair text-[9px] sm:text-[10px] font-bold tracking-widest text-[#801336]/70 uppercase mt-1">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Birthday Status Notice */}
      <AnimatePresence>
        {isCelebrationToday && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-2.5 px-4 py-1.5 rounded-full bg-rose-100 border border-[#801336]/30 text-[#801336] font-dancing text-base sm:text-lg font-bold flex items-center gap-1.5"
          >
            <PartyPopper className="w-4 h-4 text-[#801336] animate-bounce" />
            <span>IT'S HEBZIBA'S 22ND BIRTHDAY TODAY! HAPPY 22ND! 🎉</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary CTA: Unlock Bestie's Surprise (Passcode) */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnterPasscode}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-sm sm:text-base tracking-wider shadow-pill-maroon hover:bg-[#9E1B43] transition-all flex items-center gap-2"
        >
          <Lock className="w-4 h-4 text-[#F49CB4]" />
          <span>Unlock Bestie's Surprise 💌</span>
          <Gift className="w-4 h-4 text-amber-300" />
        </motion.button>

        <p className="font-dancing text-xs sm:text-sm text-[#801336]/70">
          "Tap to enter the secret passcode and reveal your gifts"
        </p>

        {/* Quick Preview Toggle */}
        <div className="mt-1">
          <button
            onClick={() => setOverrideArrival(!isCelebrationToday)}
            className="text-[10px] font-dancing text-[#801336]/60 hover:text-[#801336] underline"
          >
            {isCelebrationToday ? 'Show Live Countdown Mode' : 'Preview Birthday Arrival Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
