import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Heart, Music, Volume2, VolumeX } from 'lucide-react';
import { happyBirthdayAudio } from '../services/happyBirthdayAudio';
import { FireworksCanvas } from './FireworksCanvas';

interface CakeCalendarScreenProps {
  onContinue: () => void;
  targetDay?: number;
  monthName?: string;
  onCandlesBlown?: () => void;
  alreadyBlown?: boolean;
}

export const CakeCalendarScreen: React.FC<CakeCalendarScreenProps> = ({
  onContinue,
  targetDay = 27,
  monthName = 'October',
  onCandlesBlown,
  alreadyBlown = false,
}) => {
  const [candlesLit, setCandlesLit] = useState<boolean>(!alreadyBlown);
  const [smokeActive, setSmokeActive] = useState<boolean>(false);
  const [fireworksActive, setFireworksActive] = useState<boolean>(alreadyBlown);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(happyBirthdayAudio.getIsMuted());

  // Autoplay Happy Birthday song upon entering the Cake screen (after passcode & countdown)
  useEffect(() => {
    let isMounted = true;

    if (!alreadyBlown) {
      happyBirthdayAudio
        .play()
        .then(() => {
          if (isMounted) setIsMusicPlaying(true);
        })
        .catch(() => {
          // If browser deferred autoplay, listen for the first user click/key on the screen
          const unlockAudio = () => {
            if (isMounted && candlesLit) {
              happyBirthdayAudio.play();
              setIsMusicPlaying(true);
            }
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
          };
          window.addEventListener('click', unlockAudio, { once: true });
          window.addEventListener('keydown', unlockAudio, { once: true });
        });
    }

    return () => {
      isMounted = false;
      // Stop happy birthday song when navigating away from the Cake screen
      happyBirthdayAudio.stop();
    };
  }, [alreadyBlown]);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setSmokeActive(true);
    setFireworksActive(true);

    // Stop Happy Birthday song immediately when user clicks to blow the candles
    happyBirthdayAudio.stop();
    setIsMusicPlaying(false);

    onCandlesBlown?.();

    // Celebratory pastel & maroon confetti blast
    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#801336', '#F49CB4', '#FCE4EC', '#F59E0B', '#FFFDF9'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 65,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.65 },
          colors: ['#F49CB4', '#801336', '#FFD700'],
        });
        confetti({
          particleCount: 65,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.65 },
          colors: ['#F49CB4', '#801336', '#FFD700'],
        });
      }, 200);
    } catch {
      // Confetti fallback safe
    }
  };

  // Calendar dates for October (31 days, standard grid starting on Thursday)
  const daysInMonth = 31;
  const startDayOffset = 4; // 0 = Sun, 1 = Mon ... 4 = Thu
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < startDayOffset; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <div className="w-full flex flex-col items-center py-1 sm:py-2 select-none relative z-20">
      {/* Background Fireworks bursting across the screen once candles are blown */}
      <FireworksCanvas isActive={fireworksActive} />
      {/* Big Bold Maroon Serif Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-3 sm:mb-4 flex flex-col items-center"
      >
        {/* Soft Music Indicator while candles are lit */}
        <AnimatePresence>
          {candlesLit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-rose-200/80 shadow-sm text-xs font-playfair font-semibold text-[#801336]"
            >
              <Music className={`w-3.5 h-3.5 text-[#F49CB4] ${isMusicPlaying && !isMuted ? 'animate-bounce' : 'opacity-70'}`} />
              <span>{isMusicPlaying && !isMuted ? 'Happy Birthday Song Playing 🎶' : 'Happy Birthday Song 🎶'}</span>
              <button
                onClick={() => {
                  const muted = happyBirthdayAudio.toggleMute();
                  setIsMuted(muted);
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-rose-50 text-[#801336]/80 hover:text-[#801336]"
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label={isMuted ? 'Unmute birthday song' : 'Mute birthday song'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#801336]" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="font-dancing text-lg sm:text-xl text-[#801336] block mb-0.5">
          To My Favorite Person & Bestie
        </span>
        <h1 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#801336] tracking-tight">
          Happy 22nd Birthday Hebziba!
        </h1>
        <p className="font-dancing text-sm sm:text-base text-[#801336]/80 mt-1 max-w-xl mx-auto">
          "Wishing my bestie the happiest 22nd birthday filled with wild adventures, endless laughs, and sunshine"
        </p>
      </motion.div>

      {/* Two Column Layout: Left Cake Widget & Right Calendar Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full max-w-3xl items-stretch justify-center">
        {/* ================= LEFT WIDGET: INTERACTIVE CAKE ================= */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl p-4 sm:p-5 shadow-scrapbook-card border border-rose-100 flex flex-col items-center justify-between h-full relative overflow-hidden"
        >
          {/* Subtle paper tape */}
          <div className="absolute top-2.5 left-3 transform -rotate-6 bg-[#FFF8E7] px-2.5 py-0.5 rounded shadow-sm border border-amber-200/50 text-[9px] font-dancing font-bold text-[#801336]">
            make a wish ✨
          </div>

          {/* SVG 2-Tier Pink Frosted Birthday Cake with 4 Candles */}
          <div
            onClick={handleBlowCandles}
            className="cursor-pointer relative w-44 h-44 sm:w-52 sm:h-52 my-auto flex items-center justify-center"
            title={candlesLit ? 'Click to blow out candles!' : 'Candles blown!'}
          >
            <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-lg overflow-visible">
              {/* Serving Platter / Stand */}
              <ellipse cx="160" cy="275" rx="120" ry="12" fill="#E8D8C8" />
              <ellipse cx="160" cy="272" rx="114" ry="10" fill="#FFFDF9" />
              <rect x="140" y="278" width="40" height="14" rx="4" fill="#E8D8C8" />
              <rect x="120" y="290" width="80" height="8" rx="4" fill="#D4B996" />

              {/* Bottom Tier Cake */}
              <g id="bottom-tier">
                <path
                  d="M60 200 H260 V260 C260 268 254 272 246 272 H74 C66 272 60 268 60 260 Z"
                  fill="#FFF0F5"
                  stroke="#F49CB4"
                  strokeWidth="2"
                />
                {/* Maroon accent stripe */}
                <rect x="60" y="235" width="200" height="8" fill="#801336" opacity="0.85" />
                {/* Frosting Drips Bottom */}
                <path
                  d="M60 200 C75 212 90 196 105 208 C120 220 135 200 150 214 C165 224 180 202 195 216 C210 226 225 204 240 218 C250 212 258 206 260 200 Z"
                  fill="#F49CB4"
                />
                {/* Sprinkles on bottom */}
                <circle cx="85" cy="225" r="3" fill="#801336" />
                <circle cx="125" cy="222" r="3" fill="#F59E0B" />
                <circle cx="165" cy="226" r="3" fill="#801336" />
                <circle cx="205" cy="223" r="3" fill="#F59E0B" />
                <circle cx="235" cy="225" r="3" fill="#801336" />
              </g>

              {/* Top Tier Cake */}
              <g id="top-tier">
                <path
                  d="M90 145 H230 V198 C230 202 226 206 220 206 H100 C94 206 90 202 90 198 Z"
                  fill="#FFF8FA"
                  stroke="#F49CB4"
                  strokeWidth="2"
                />
                {/* Top Frosting Scallops */}
                <path
                  d="M90 145 C100 155 110 142 120 152 C130 160 140 144 150 154 C160 162 170 145 180 155 C190 162 200 146 210 156 C220 150 226 148 230 145 Z"
                  fill="#F49CB4"
                />
                {/* Tiny edible sugar pearls */}
                <circle cx="110" cy="172" r="2.5" fill="#801336" />
                <circle cx="140" cy="170" r="2.5" fill="#F59E0B" />
                <circle cx="160" cy="173" r="2.5" fill="#801336" />
                <circle cx="180" cy="170" r="2.5" fill="#F59E0B" />
                <circle cx="210" cy="172" r="2.5" fill="#801336" />
              </g>

              {/* 4 Birthday Candles */}
              {[
                { x: 110, y: 110, color: '#801336' },
                { x: 142, y: 105, color: '#F49CB4' },
                { x: 178, y: 105, color: '#801336' },
                { x: 210, y: 110, color: '#F49CB4' },
              ].map((candle, idx) => (
                <g key={idx}>
                  {/* Candle Wick */}
                  <line x1={candle.x} y1={candle.y} x2={candle.x} y2={candle.y - 7} stroke="#4A2E18" strokeWidth="1.5" />
                  {/* Candle Body */}
                  <rect
                    x={candle.x - 4}
                    y={candle.y}
                    width="8"
                    height="35"
                    rx="2"
                    fill={candle.color}
                  />
                  {/* Candle Stripes */}
                  <line x1={candle.x - 4} y1={candle.y + 10} x2={candle.x + 4} y2={candle.y + 6} stroke="#FFFDF9" strokeWidth="1.5" opacity="0.7" />
                  <line x1={candle.x - 4} y1={candle.y + 22} x2={candle.x + 4} y2={candle.y + 18} stroke="#FFFDF9" strokeWidth="1.5" opacity="0.7" />

                  {/* Candle Flame (Flickering SVG) */}
                  {candlesLit && (
                    <motion.g
                      animate={{
                        scale: [1, 1.15, 0.92, 1.1, 1],
                        y: [0, -2, 1, -1, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.1 + idx * 0.2,
                        ease: 'easeInOut',
                      }}
                      style={{ transformOrigin: `${candle.x}px ${candle.y - 12}px` }}
                    >
                      {/* Glow halo */}
                      <circle cx={candle.x} cy={candle.y - 14} r="10" fill="#F59E0B" opacity="0.3" filter="blur(2px)" />
                      {/* Outer flame */}
                      <path
                        d={`M${candle.x} ${candle.y - 24} C${candle.x - 5} ${candle.y - 16} ${candle.x - 4} ${candle.y - 9} ${candle.x} ${candle.y - 8} C${candle.x + 4} ${candle.y - 9} ${candle.x + 5} ${candle.y - 16} ${candle.x} ${candle.y - 24} Z`}
                        fill="#F59E0B"
                      />
                      {/* Inner warm core */}
                      <path
                        d={`M${candle.x} ${candle.y - 18} C${candle.x - 2.5} ${candle.y - 13} ${candle.x - 2} ${candle.y - 9} ${candle.x} ${candle.y - 9} C${candle.x + 2} ${candle.y - 9} ${candle.x + 2.5} ${candle.y - 13} ${candle.x} ${candle.y - 18} Z`}
                        fill="#FEF08A"
                      />
                    </motion.g>
                  )}

                  {/* Smoke Particles after blowing out */}
                  {smokeActive && !candlesLit && (
                    <motion.g
                      initial={{ opacity: 0.9, y: 0, x: 0, scale: 0.4 }}
                      animate={{
                        opacity: [0.8, 0.4, 0],
                        y: -35 - idx * 8,
                        x: (idx % 2 === 0 ? -1 : 1) * (10 + idx * 4),
                        scale: 1.4,
                      }}
                      transition={{ duration: 1.8 + idx * 0.2, ease: 'easeOut' }}
                    >
                      <path
                        d={`M${candle.x} ${candle.y - 10} Q${candle.x - 5} ${candle.y - 20} ${candle.x + 3} ${candle.y - 30}`}
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.6"
                      />
                    </motion.g>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Action Button: Blow Candles / Continue */}
          <div className="mt-2 w-full flex justify-center min-h-[42px]">
            <AnimatePresence mode="wait">
              {candlesLit ? (
                <motion.button
                  key="blow-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleBlowCandles}
                  className="px-5 py-2.5 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-xs sm:text-sm tracking-wide shadow-pill-maroon hover:bg-[#9E1B43] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Blow the Candles ✨</span>
                </motion.button>
              ) : (
                <motion.button
                  key="continue-btn"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  onClick={onContinue}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#801336] to-[#9E1B43] text-[#FAF6F0] font-playfair font-bold text-sm tracking-wide shadow-pill-maroon hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 animate-bounce"
                >
                  <span>• Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <p className="font-dancing text-xs text-[#801336]/70 mt-1">
            {candlesLit ? 'Tap the button or candles to blow them out!' : '✨ Wish sent to the stars! ✨'}
          </p>
        </motion.div>

        {/* ================= RIGHT WIDGET: CALENDAR CARD ================= */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-4 sm:p-5 shadow-scrapbook-card border border-rose-100 flex flex-col items-center justify-between h-full relative overflow-hidden"
        >
          {/* Calendar Header with month and subtitle */}
          <div className="w-full text-center pb-2 mb-1 border-b border-rose-100">
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#801336]">
              {monthName}
            </h2>
            <p className="font-dancing text-sm sm:text-base text-[#F49CB4] font-semibold">
              ~ birthday month ~
            </p>
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center my-auto py-1">
            {/* 7-Column Day Names */}
            <div className="grid grid-cols-7 gap-1.5 w-full max-w-[280px] text-center text-[10px] sm:text-xs font-bold text-[#801336]/60 uppercase tracking-wider mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <span key={idx}>{day}</span>
              ))}
            </div>

            {/* 7-Column Grid of Calendar Dates */}
            <div className="grid grid-cols-7 gap-1 w-full max-w-[280px] text-center font-playfair text-xs sm:text-sm font-semibold">
              {calendarCells.map((cell, idx) => {
                if (cell === null) {
                  return <div key={`empty-${idx}`} className="h-6 sm:h-7" />;
                }

                const isTargetDay = cell === targetDay;

                return (
                  <div
                    key={`day-${cell}`}
                    className="relative h-6 sm:h-7 flex items-center justify-center"
                  >
                    {isTargetDay ? (
                      /* Encircled by Solid Maroon Heart Badge */
                      <motion.div
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center cursor-pointer"
                        title="Hebziba's Birthday!"
                      >
                        <Heart className="w-full h-full fill-[#801336] text-[#801336] drop-shadow-md" />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-[10px] sm:text-xs">
                          {cell}
                        </span>
                      </motion.div>
                    ) : (
                      <span className="text-[#801336]/80 hover:text-[#801336]">
                        {cell}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bestie Birthday Note footer */}
          <div className="mt-2 pt-2 border-t border-rose-100 w-full flex items-center justify-center gap-1.5">
            <Heart className="w-3 h-3 fill-[#801336] text-[#801336]" />
            <span className="font-dancing text-xs sm:text-sm text-[#801336] font-bold">
              {monthName} {targetDay} — Celebrating my bestie turning 22! ✨
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
