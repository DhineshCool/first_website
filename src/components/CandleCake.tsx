import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Wind, RotateCcw, Heart } from 'lucide-react';

interface CandleCakeProps {
  onBlowOut?: () => void;
}

export const CandleCake: React.FC<CandleCakeProps> = ({ onBlowOut }) => {
  const [isLit, setIsLit] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [smokePuffs, setSmokePuffs] = useState<number[]>([]);

  const handleBlowCandle = () => {
    if (!isLit) return;

    setIsLit(false);
    setSmokePuffs([1, 2, 3, 4]);
    setShowToast(true);
    onBlowOut?.();

    // Trigger radiant celebration confetti
    try {
      // Cake celebration burst
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#F43F5E', '#F59E0B', '#EC4899', '#38BDF8', '#FCD34D'],
        ticks: 250,
        gravity: 0.8,
        scalar: 1.1,
      });

      // Side fireworks burst
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#F43F5E', '#FB7185', '#FDA4AF'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#F59E0B', '#FBBF24', '#FDE68A'],
        });
      }, 250);
    } catch (e) {
      console.error(e);
    }

    // Auto fade toast after a while
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  const handleRelight = () => {
    setIsLit(true);
    setSmokePuffs([]);
    setShowToast(false);
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto py-16 px-4 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-xs font-semibold uppercase tracking-wider mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" />
          The Birthday Wish Climax
        </motion.div>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-tprimary tracking-tight">
          Make a Secret Birthday Wish
        </h2>
        <p className="mt-3 text-tmuted text-sm sm:text-base max-w-lg mx-auto">
          Close your eyes, think of the wildest, sweetest dream for this coming year, and blow out the candles.
        </p>
      </div>

      {/* Interactive Birthday Cake Container */}
      <div className="relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl glass-card border border-white/10 w-full max-w-lg shadow-2xl">
        {/* Glow halo behind cake */}
        <div
          className={`absolute w-72 h-72 rounded-full blur-3xl transition-opacity duration-1000 pointer-events-none ${
            isLit ? 'bg-amber-500/20 opacity-100' : 'bg-rose-500/10 opacity-40'
          }`}
        />

        {/* SVG Interactive Cake Illustration */}
        <div
          onClick={handleBlowCandle}
          className={`relative cursor-pointer transition-transform duration-300 select-none ${
            isLit ? 'hover:scale-[1.02] active:scale-95' : ''
          }`}
          title={isLit ? 'Tap candle flame to blow it out!' : 'Candles extinguished'}
        >
          <svg
            viewBox="0 0 360 320"
            className="w-64 sm:w-80 h-auto filter drop-shadow-xl overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Candle Flames with Dynamic Flicker */}
            {isLit ? (
              <g className="transition-opacity duration-300">
                {/* Left Flame */}
                <motion.g
                  animate={{
                    scale: [1, 1.15, 0.95, 1.05, 1],
                    y: [0, -2, 1, -1, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  style={{ transformOrigin: '140px 75px' }}
                >
                  <circle cx="140" cy="72" r="14" fill="#F59E0B" opacity="0.3" filter="blur(4px)" />
                  <path
                    d="M140 50C135 62 131 69 131 75C131 80 135 84 140 84C145 84 149 80 149 75C149 69 145 62 140 50Z"
                    fill="url(#flameGradientLeft)"
                  />
                  <ellipse cx="140" cy="76" rx="4" ry="6" fill="#FEF08A" />
                </motion.g>

                {/* Center Main Flame */}
                <motion.g
                  animate={{
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    y: [0, -3, 2, -1, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                  style={{ transformOrigin: '180px 65px' }}
                >
                  <circle cx="180" cy="62" r="18" fill="#F43F5E" opacity="0.35" filter="blur(6px)" />
                  <path
                    d="M180 38C173 52 168 62 168 70C168 77 173 82 180 82C187 82 192 77 192 70C192 62 187 52 180 38Z"
                    fill="url(#flameGradientCenter)"
                  />
                  <ellipse cx="180" cy="71" rx="5" ry="7" fill="#FEF9C3" />
                </motion.g>

                {/* Right Flame */}
                <motion.g
                  animate={{
                    scale: [1, 1.1, 0.96, 1.18, 1],
                    y: [0, -2, 2, -1, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.35, ease: 'easeInOut', delay: 0.4 }}
                  style={{ transformOrigin: '220px 75px' }}
                >
                  <circle cx="220" cy="72" r="14" fill="#F59E0B" opacity="0.3" filter="blur(4px)" />
                  <path
                    d="M220 50C215 62 211 69 211 75C211 80 215 84 220 84C225 84 229 80 229 75C229 69 225 62 220 50Z"
                    fill="url(#flameGradientRight)"
                  />
                  <ellipse cx="220" cy="76" rx="4" ry="6" fill="#FEF08A" />
                </motion.g>
              </g>
            ) : (
              /* Smoke Drift Particles when Extinguished */
              <g className="smoke-group pointer-events-none">
                {smokePuffs.map((puff, idx) => (
                  <motion.g
                    key={puff}
                    initial={{ opacity: 0.8, y: 0, x: 0, scale: 0.5 }}
                    animate={{
                      opacity: [0.8, 0.4, 0],
                      y: -50 - idx * 20,
                      x: (idx % 2 === 0 ? -1 : 1) * (15 + idx * 8),
                      scale: 1.6 + idx * 0.3,
                    }}
                    transition={{ duration: 2 + idx * 0.3, ease: 'easeOut' }}
                  >
                    <path
                      d="M175 60 C170 50, 185 45, 180 35 C175 25, 190 20, 185 10"
                      stroke="#94A3B8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.6"
                    />
                    <circle cx={180 + (idx % 2 ? 10 : -10)} cy={40 - idx * 10} r="6" fill="#94A3B8" opacity="0.3" />
                  </motion.g>
                ))}
              </g>
            )}

            {/* Candle Wicks */}
            <line x1="140" y1="84" x2="140" y2="92" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="180" y1="82" x2="180" y2="90" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="220" y1="84" x2="220" y2="92" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

            {/* Candle Cylinders */}
            <rect x="134" y="92" width="12" height="38" rx="3" fill="#F43F5E" />
            <rect x="174" y="90" width="12" height="42" rx="3" fill="#EC4899" />
            <rect x="214" y="92" width="12" height="38" rx="3" fill="#F59E0B" />

            {/* Candle Stripes */}
            <line x1="134" y1="102" x2="146" y2="98" stroke="#FFE4E6" strokeWidth="2" opacity="0.7" />
            <line x1="134" y1="116" x2="146" y2="112" stroke="#FFE4E6" strokeWidth="2" opacity="0.7" />
            <line x1="174" y1="102" x2="186" y2="98" stroke="#FCE7F3" strokeWidth="2" opacity="0.7" />
            <line x1="174" y1="118" x2="186" y2="114" stroke="#FCE7F3" strokeWidth="2" opacity="0.7" />
            <line x1="214" y1="102" x2="226" y2="98" stroke="#FEF3C7" strokeWidth="2" opacity="0.7" />
            <line x1="214" y1="116" x2="226" y2="112" stroke="#FEF3C7" strokeWidth="2" opacity="0.7" />

            {/* Top Cake Tier (Frosting + Body) */}
            <g id="top-tier">
              <path
                d="M100 130 H260 V180 C260 185 255 190 250 190 H110 C105 190 100 185 100 180 Z"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* Cream Layer */}
              <rect x="100" y="156" width="160" height="8" fill="#F43F5E" opacity="0.8" />
              {/* Top Frosting Scallop */}
              <path
                d="M100 130 C110 138 120 128 130 136 C140 144 150 132 160 138 C170 144 180 130 190 138 C200 146 210 132 220 138 C230 144 240 130 250 138 C255 142 258 134 260 130 H100 Z"
                fill="#F8FAFC"
              />
              {/* Decorative Pearls */}
              <circle cx="120" cy="148" r="3" fill="#EC4899" />
              <circle cx="150" cy="148" r="3" fill="#F59E0B" />
              <circle cx="180" cy="148" r="3" fill="#F43F5E" />
              <circle cx="210" cy="148" r="3" fill="#F59E0B" />
              <circle cx="240" cy="148" r="3" fill="#EC4899" />
            </g>

            {/* Bottom Cake Tier */}
            <g id="bottom-tier">
              <path
                d="M70 190 H290 V260 C290 268 284 274 276 274 H84 C76 274 70 268 70 260 Z"
                fill="#0F172A"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* Cream Layer Bottom */}
              <rect x="70" y="228" width="220" height="10" fill="#F43F5E" opacity="0.65" />
              {/* Frosting Scallops */}
              <path
                d="M70 190 C85 200 100 188 115 198 C130 208 145 192 160 202 C175 212 190 194 205 204 C220 214 235 196 250 206 C265 216 280 198 290 194 V190 H70 Z"
                fill="#F8FAFC"
              />
              {/* Sugar Sprinkles */}
              <circle cx="95" cy="216" r="3" fill="#FBBF24" />
              <circle cx="130" cy="216" r="3" fill="#F43F5E" />
              <circle cx="165" cy="216" r="3" fill="#38BDF8" />
              <circle cx="200" cy="216" r="3" fill="#A855F7" />
              <circle cx="235" cy="216" r="3" fill="#34D399" />
              <circle cx="270" cy="216" r="3" fill="#F59E0B" />

              <circle cx="110" cy="248" r="3" fill="#EC4899" />
              <circle cx="150" cy="248" r="3" fill="#FBBF24" />
              <circle cx="185" cy="248" r="3" fill="#34D399" />
              <circle cx="225" cy="248" r="3" fill="#38BDF8" />
              <circle cx="260" cy="248" r="3" fill="#F43F5E" />
            </g>

            {/* Serving Cake Stand / Platter */}
            <g id="stand">
              <ellipse cx="180" cy="274" rx="130" ry="14" fill="#334155" />
              <ellipse cx="180" cy="272" rx="126" ry="12" fill="#E2E8F0" />
              <path d="M150 284 L140 310 H220 L210 284 Z" fill="#334155" />
              <rect x="130" y="306" width="100" height="8" rx="4" fill="#1E293B" />
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="flameGradientLeft" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FEF08A" />
              </linearGradient>
              <linearGradient id="flameGradientCenter" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#BE123C" />
                <stop offset="50%" stopColor="#F43F5E" />
                <stop offset="85%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#FEF9C3" />
              </linearGradient>
              <linearGradient id="flameGradientRight" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FEF08A" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 z-10">
          {isLit ? (
            <button
              onClick={handleBlowCandle}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-accent-primary to-accent-highlight hover:from-rose-600 hover:to-pink-600 shadow-glow-rose transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Wind className="w-5 h-5 animate-pulse" />
              <span>Blow Out the Candles</span>
            </button>
          ) : (
            <button
              onClick={handleRelight}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 shadow-glow-amber transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Relight & Wish Again</span>
            </button>
          )}
        </div>

        {/* Status prompt */}
        <p className="mt-4 text-xs text-tmuted tracking-wide text-center">
          {isLit ? 'Tip: You can also tap directly on the candle flames!' : '✨ May every spark of your wish come true! ✨'}
        </p>
      </div>

      {/* Celebratory Banner Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md p-5 rounded-2xl glass-panel border border-accent-secondary/40 shadow-glow-amber text-center"
          >
            <div className="flex items-center justify-center gap-2 text-accent-secondary font-heading font-semibold text-base mb-1">
              <Heart className="w-4 h-4 text-accent-primary fill-accent-primary animate-bounce" />
              <span>Wish Sent to the Heavens!</span>
              <Sparkles className="w-4 h-4 text-accent-secondary" />
            </div>
            <p className="text-sm text-slate-200 font-light">
              May the universe conspire to bring you boundless laughter, wild triumphs, and radiant peace throughout this new year.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
