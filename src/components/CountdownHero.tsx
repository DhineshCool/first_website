import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, ChevronDown, Clock, PartyPopper } from 'lucide-react';
import { CountdownTimeLeft } from '../types';

interface CountdownHeroProps {
  targetDate: string;
  recipientName?: string;
  onEnterExperience?: () => void;
  onScrollToExplore?: () => void;
}

export const CountdownHero: React.FC<CountdownHeroProps> = ({
  targetDate,
  recipientName = 'Hebziba',
  onEnterExperience,
  onScrollToExplore,
}) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  // Controls whether the hero state is unlocked (post-midnight) or counting down
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [overrideUnlocked, setOverrideUnlocked] = useState<boolean | null>(null);
  const confettiTriggeredRef = useRef<boolean>(false);

  // Staggered confetti blast function (3 intervals as specified)
  const triggerStaggeredConfetti = useCallback(() => {
    try {
      // 1st blast: Center radial explosion
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#F43F5E', '#F59E0B', '#EC4899', '#38BDF8', '#FFFFFF'],
      });

      // 2nd blast after 400ms: Left-to-right cascade
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0.15, y: 0.65 },
          colors: ['#F43F5E', '#FB7185', '#FDA4AF'],
        });
      }, 400);

      // 3rd blast after 800ms: Right-to-left cascade
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 0.85, y: 0.65 },
          colors: ['#F59E0B', '#FBBF24', '#FCD34D'],
        });
      }, 800);
    } catch (e) {
      console.error('Confetti trigger error', e);
    }
  }, []);

  // Compute remaining time
  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        const shouldBeUnlocked = overrideUnlocked !== null ? overrideUnlocked : true;
        setIsUnlocked(shouldBeUnlocked);

        if (shouldBeUnlocked && !confettiTriggeredRef.current) {
          confettiTriggeredRef.current = true;
          triggerStaggeredConfetti();
        }
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds, total: difference });
        setIsUnlocked(overrideUnlocked !== null ? overrideUnlocked : false);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate, overrideUnlocked, triggerStaggeredConfetti]);

  const handleManualUnlockToggle = () => {
    const nextState = !isUnlocked;
    setOverrideUnlocked(nextState);
    setIsUnlocked(nextState);

    if (nextState) {
      triggerStaggeredConfetti();
      onEnterExperience?.();
    }
  };

  const handleEnterClick = () => {
    onEnterExperience?.();
    if (!isUnlocked) {
      handleManualUnlockToggle();
    }
    onScrollToExplore?.();
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-12 overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-tr from-accent-primary/15 via-accent-highlight/10 to-accent-secondary/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Target Status / Toggle Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 z-10"
      >
        <button
          onClick={handleManualUnlockToggle}
          className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-white/10 hover:border-accent-primary/50 text-xs text-tmuted hover:text-tprimary transition-all shadow-sm"
          title="Click to toggle between Countdown state and Birthday celebration state"
        >
          {isUnlocked ? (
            <>
              <PartyPopper className="w-3.5 h-3.5 text-accent-secondary animate-bounce" />
              <span className="text-amber-300 font-medium">Birthday Unlocked Mode</span>
              <span className="opacity-50 text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                Toggle Countdown
              </span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-accent-primary animate-pulse" />
              <span>Awaiting Midnight Arrival</span>
              <span className="opacity-60 text-[10px] bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full group-hover:bg-accent-primary group-hover:text-white transition-colors">
                Instant Preview
              </span>
            </>
          )}
        </button>
      </motion.div>

      {/* Primary Dynamic Headline */}
      <div className="relative z-10 max-w-3xl mx-auto mb-8">
        <AnimatePresence mode="wait">
          {isUnlocked ? (
            /* Post-Midnight Celebration Headline with Spring Transition */
            <motion.div
              key="celebration-headline"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-accent-secondary" />
                The Stars Align For You
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-rose-200 via-white to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
                Happy Birthday, <br />
                <span className="bg-gradient-to-r from-accent-primary via-accent-highlight to-accent-secondary bg-clip-text text-transparent underline decoration-accent-primary/30 decoration-wavy">
                  {recipientName}!
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Another orbit around the sun illuminated by your grace, warmth, and laughter. Welcome to your personal celestial tribute.
              </p>
            </motion.div>
          ) : (
            /* Pre-Midnight Entry Headline */
            <motion.div
              key="countdown-headline"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-tmuted text-xs font-semibold tracking-wider uppercase">
                <Heart className="w-3.5 h-3.5 text-accent-primary animate-pulse" />
                The Grand Anticipation
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-tprimary">
                A Milestone Moment <br />
                <span className="bg-gradient-to-r from-accent-primary via-accent-highlight to-accent-secondary bg-clip-text text-transparent">
                  Is Almost Here
                </span>
              </h1>

              <p className="text-base sm:text-lg text-tmuted max-w-xl mx-auto">
                Counting down every heartbeat until midnight strikes for {recipientName}’s special celebration.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pre-Midnight Numerical Cards (Updating Every Second with Pulsing Border) */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            key="countdown-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-xl mx-auto mb-10 z-10"
          >
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Minutes', val: timeLeft.minutes },
              { label: 'Seconds', val: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={unit.label}
                className="relative rounded-2xl p-4 sm:p-5 glass-card border border-rose-500/30 animate-pulse-subtle flex flex-col items-center justify-center shadow-lg"
                style={{ animationDelay: `${idx * 0.4}s` }}
              >
                <span className="font-heading text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent tabular-nums">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-accent-primary mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 z-10"
      >
        <button
          onClick={handleEnterClick}
          className="group relative px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-accent-primary via-rose-500 to-accent-highlight hover:from-rose-600 hover:to-pink-600 shadow-glow-rose transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span>{isUnlocked ? 'Enter Celebration' : 'Unlock & Celebrate Now'}</span>
        </button>

        {isUnlocked && onScrollToExplore && (
          <button
            onClick={onScrollToExplore}
            className="px-6 py-3.5 rounded-full font-medium text-slate-300 hover:text-white glass-panel border border-white/10 hover:border-white/25 transition-all text-sm flex items-center gap-2"
          >
            <span>Explore Milestones</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        )}
      </motion.div>

      {/* Zero Gravity Physics Layer Notice / Prompt */}
      <div className="mt-14 z-10 flex items-center gap-2 text-xs text-tmuted/80">
        <span className="w-2 h-2 rounded-full bg-accent-secondary animate-ping" />
        <span>Notice: Floating objects in the background obey zero-gravity physics. Try dragging them!</span>
      </div>
    </section>
  );
};
