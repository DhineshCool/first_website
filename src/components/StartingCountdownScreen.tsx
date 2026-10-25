import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Heart, Gift, PartyPopper, X, Hourglass } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);

  // Live countdown to target date
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

  const isCelebrationToday = timeLeft.isPassed;

  // Values shown on the 4 countdown cards
  const displayDays = isCelebrationToday ? 0 : timeLeft.days;
  const displayHours = isCelebrationToday ? 0 : timeLeft.hours;
  const displayMinutes = isCelebrationToday ? 0 : timeLeft.minutes;
  const displaySeconds = isCelebrationToday ? 0 : timeLeft.seconds;

  // Trigger celebration confetti when countdown completes
  useEffect(() => {
    if (isCelebrationToday) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#801336', '#F49CB4', '#FFD700', '#FFFDF9'],
        });
      } catch {
        // safe
      }
    }
  }, [isCelebrationToday]);

  const handleUnlockClick = () => {
    if (isCelebrationToday) {
      // Countdown ended! Proceed smoothly to passcode screen
      onEnterPasscode();
    } else {
      // Countdown still active: show locked notice with countdown info
      setShowLockedModal(true);
    }
  };

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
          {isCelebrationToday
            ? "✨ The wait is over! It's your 22nd Birthday today! ✨"
            : '"Counting every second until 22 arrives for my favorite human"'}
        </p>
      </motion.div>

      {/* Floating Celebration Balloons flanking the title */}
      <div className="absolute left-2 sm:left-8 top-16 pointer-events-none hidden md:block">
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [-4, 3, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center opacity-85"
        >
          <div className="w-9 h-11 rounded-full bg-gradient-to-tr from-[#F49CB4] to-[#FCE4EC] shadow-md border border-rose-200 relative flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#801336]">22</span>
            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#801336] rounded-xs" />
          </div>
          <div className="w-0.5 h-12 bg-[#801336]/40" />
        </motion.div>
      </div>

      <div className="absolute right-2 sm:right-8 top-16 pointer-events-none hidden md:block">
        <motion.div
          animate={{ y: [0, -16, 0], rotate: [4, -3, 4] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="flex flex-col items-center opacity-85"
        >
          <div className="w-9 h-11 rounded-full bg-gradient-to-tr from-[#801336] to-[#9E1B43] shadow-md border border-rose-300 relative flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 fill-[#FAF6F0] text-[#FAF6F0]" />
            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#801336] rounded-xs" />
          </div>
          <div className="w-0.5 h-12 bg-[#801336]/40" />
        </motion.div>
      </div>

      {/* 4 Polaroid-Style Countdown Cards */}
      <div className="w-full max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-2">
        {[
          { label: 'DAYS', value: displayDays, rotation: -1.5 },
          { label: 'HOURS', value: displayHours, rotation: 1.5 },
          { label: 'MINUTES', value: displayMinutes, rotation: -1.5 },
          { label: 'SECONDS', value: displaySeconds, rotation: 1.5 },
        ].map((unit, idx) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            style={{ rotate: `${unit.rotation}deg` }}
            className={`rounded-2xl p-3 sm:p-3.5 shadow-scrapbook-card border flex flex-col items-center justify-center relative cursor-default h-22 sm:h-24 overflow-hidden transition-all ${
              isCelebrationToday
                ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FDE8EF] border-[#F49CB4]'
                : 'bg-white border-rose-100'
            }`}
          >
            {/* Pink Heart Pin at Top Center */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#F49CB4] border border-white shadow-sm flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 fill-[#801336] text-[#801336]" />
            </div>

            {/* Numerical Digit with Tick Bounce */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`${unit.label}-${unit.value}`}
                initial={{ scale: 1.18, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#801336] tabular-nums mt-0.5 leading-tight"
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>

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
            className="my-2.5 px-4 py-1.5 rounded-full bg-rose-100 border border-[#801336]/30 text-[#801336] font-dancing text-base sm:text-lg font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PartyPopper className="w-4 h-4 text-[#801336] animate-bounce" />
            <span>IT'S HEBZIBA'S 22ND BIRTHDAY TODAY! HAPPY 22ND! 🎉</span>
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary CTA: Unlock Bestie's Surprise (Passcode) */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUnlockClick}
          className={`px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-playfair font-bold text-sm sm:text-base tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
            isCelebrationToday
              ? 'animate-shimmer bg-gradient-to-r from-[#801336] via-[#9E1B43] to-[#801336] text-[#FAF6F0] shadow-pill-maroon hover:shadow-xl border-rose-300/40 ring-2 ring-amber-300/50'
              : 'bg-white/95 text-[#801336] border-rose-300/80 shadow-md hover:bg-rose-50/80'
          }`}
        >
          {isCelebrationToday ? (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>Unlock Bestie's Surprise 💌</span>
              <Gift className="w-4 h-4 text-amber-300 animate-bounce" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-[#801336] animate-pulse" />
              <span>Unlock Bestie's Surprise 🔒</span>
              <span className="text-[10px] font-dancing bg-rose-100 text-[#801336] px-2 py-0.5 rounded-full font-bold">
                Unlocks Oct 27
              </span>
            </>
          )}
        </motion.button>

        <p className="font-dancing text-xs sm:text-sm text-[#801336]/80 font-bold">
          {isCelebrationToday
            ? "🎉 Countdown complete! Tap to enter the passcode and open your gifts 💖"
            : "⏳ Surprise is locked until the countdown ends on October 27 at 00:00:00"}
        </p>
      </div>

      {/* Locked Countdown Notice Modal */}
      <AnimatePresence>
        {showLockedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-rose-200 text-center relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLockedModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-50 text-[#801336] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-rose-100 text-[#801336] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Hourglass className="w-8 h-8 text-[#801336] animate-pulse" />
              </div>

              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#801336] mb-1">
                Patience, Bestie! 💖
              </h3>

              <p className="font-dancing text-base sm:text-lg text-[#801336] font-semibold mb-3">
                "Special surprises are worth waiting for..."
              </p>

              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-rose-200/60 my-3 text-left">
                <p className="font-jakarta text-xs sm:text-sm text-slate-700 leading-relaxed">
                  This birthday tribute for <strong>Hebziba</strong> is time-locked until the stroke of midnight on <strong>October 27</strong>.
                </p>
                <p className="font-dancing text-sm sm:text-base text-[#801336] font-bold mt-2">
                  ⏳ Time remaining: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </p>
                <p className="font-jakarta text-[11px] text-[#801336]/80 mt-1">
                  The moment this countdown reaches 00:00:00, this button will automatically unlock the surprise! ✨
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setShowLockedModal(false)}
                  className="w-full py-2.5 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-xs tracking-wider shadow-md hover:bg-[#9E1B43] transition-all cursor-pointer"
                >
                  I'll Wait for the Big Day! ⏳
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StartingCountdownScreen;
