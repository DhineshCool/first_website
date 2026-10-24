import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface ScrapbookLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

// Subtle magical drifting particles for ambient fairy-tale warmth
const PARTICLE_TYPES = ['✨', '💖', '🌸', '✦', '⭐', '💫', '🧁'];

export const ScrapbookLayout: React.FC<ScrapbookLayoutProps> = ({
  children,
  showBackButton = false,
  onBack,
}) => {
  // Pre-generate stable positions for 18 ambient floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      icon: PARTICLE_TYPES[i % PARTICLE_TYPES.length],
      left: `${(i * 5.6 + (i % 3) * 2.5) % 96 + 2}%`,
      delay: (i * 0.9) % 10,
      duration: 14 + (i % 5) * 2.5,
      scale: 0.6 + (i % 4) * 0.18,
      opacity: 0.25 + (i % 3) * 0.15,
      driftX: (i % 2 === 0 ? 1 : -1) * (15 + (i % 4) * 5),
    }));
  }, []);

  return (
    <div className="relative min-h-screen w-full scrapbook-grid overflow-x-hidden flex flex-col justify-between selection:bg-[#F49CB4] selection:text-[#801336]">
      {/* ================= AMBIENT DRIFTING PARTICLES ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: '105vh', x: 0, opacity: 0 }}
            animate={{
              y: '-8vh',
              x: [0, p.driftX, -p.driftX / 2, 0],
              opacity: [0, p.opacity, p.opacity, 0],
              rotate: [0, p.driftX * 3, -p.driftX * 2, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: p.left,
              fontSize: `${p.scale * 1.1}rem`,
            }}
            className="absolute drop-shadow-sm filter"
          >
            {p.icon}
          </motion.div>
        ))}
      </div>

      {/* ================= FIXED CORNER DECORATIONS WITH SUBTLE BREATHING ================= */}

      {/* TOP-LEFT: Torn Pink Paper Wave + Taped Label "sweet" (Subtle background accent) */}
      <motion.div
        animate={{ y: [0, -3, 0], rotate: [0, 0.8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed top-0 left-0 pointer-events-none z-0 select-none"
      >
        <svg
          viewBox="0 0 220 180"
          className="w-24 sm:w-32 h-auto drop-shadow-sm overflow-visible opacity-75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Layered torn paper background */}
          <path
            d="M-10 -10 H180 Q160 50 190 90 T120 150 Q70 140 20 170 L-10 170 Z"
            fill="#FCE4EC"
            opacity="0.9"
          />
          <path
            d="M-10 -10 H160 Q140 45 170 80 T100 135 Q50 120 0 150 L-10 150 Z"
            fill="#F49CB4"
            opacity="0.85"
          />
          {/* Torn deckle edge dashes */}
          <path
            d="M0 150 Q60 130 110 140 T175 80"
            stroke="#801336"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.3"
          />

          {/* Washi Masking Tape with "sweet" label */}
          <g transform="translate(50, 35) rotate(-14) scale(0.8)">
            <rect
              x="-40"
              y="-14"
              width="90"
              height="28"
              rx="3"
              fill="#FFF8E7"
              stroke="#D4B996"
              strokeWidth="0.8"
              opacity="0.95"
            />
            {/* Tape serrated edges */}
            <line x1="-40" y1="-14" x2="-40" y2="14" stroke="#D4B996" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="50" y1="-14" x2="50" y2="14" stroke="#D4B996" strokeWidth="1" strokeDasharray="2 2" />
            <text
              x="5"
              y="5"
              textAnchor="middle"
              className="font-dancing text-lg font-bold fill-[#801336]"
            >
              sweet ✨
            </text>
          </g>
        </svg>
      </motion.div>

      {/* TOP-RIGHT: Sketched Maroon Stars, Outline Hearts + Taped Label "always" */}
      <motion.div
        animate={{ y: [0, -3, 0], rotate: [0, -0.8, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="fixed top-0 right-0 pointer-events-none z-0 select-none"
      >
        <svg
          viewBox="0 0 220 180"
          className="w-24 sm:w-32 h-auto drop-shadow-sm overflow-visible opacity-75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sketched stars and doodle hearts */}
          <g stroke="#801336" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Star 1 */}
            <path d="M180 30 L184 42 L196 44 L187 53 L189 65 L178 59 L167 65 L169 53 L160 44 L172 42 Z" opacity="0.75" />
            {/* Doodle heart 1 */}
            <path d="M140 35 C135 25 120 25 115 35 C110 45 120 60 140 75 C160 60 170 45 165 35 C160 25 145 25 140 35 Z" opacity="0.6" />
            {/* Mini sparkle star */}
            <path d="M125 90 L125 106 M117 98 L133 98" opacity="0.7" />
            <path d="M195 95 L195 105 M190 100 L200 100" opacity="0.7" />
          </g>

          {/* Washi Masking Tape with "always" label */}
          <g transform="translate(130, 60) rotate(12) scale(0.8)">
            <rect
              x="-45"
              y="-14"
              width="95"
              height="28"
              rx="3"
              fill="#FFF8E7"
              stroke="#D4B996"
              strokeWidth="0.8"
              opacity="0.95"
            />
            <line x1="-45" y1="-14" x2="-45" y2="14" stroke="#D4B996" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="50" y1="-14" x2="50" y2="14" stroke="#D4B996" strokeWidth="1" strokeDasharray="2 2" />
            <text
              x="2"
              y="5"
              textAnchor="middle"
              className="font-dancing text-lg font-bold fill-[#801336]"
            >
              always 💖
            </text>
          </g>
        </svg>
      </motion.div>

      {/* BOTTOM-LEFT: Maroon & Pink Hibiscus Flower Cluster */}
      <motion.div
        animate={{ y: [0, 3, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="fixed bottom-0 left-0 pointer-events-none z-0 select-none"
      >
        <svg
          viewBox="0 0 240 220"
          className="w-28 sm:w-36 h-auto drop-shadow-sm overflow-visible opacity-75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Leaves */}
          <path d="M20 220 Q40 160 85 150 Q110 180 80 220 Z" fill="#4A6B53" opacity="0.8" />
          <path d="M70 220 Q120 180 150 190 Q140 220 100 220 Z" fill="#60896C" opacity="0.75" />

          {/* Main Maroon Hibiscus */}
          <g transform="translate(70, 160)">
            {/* Petals */}
            <path d="M0 0 C-40 -40 -60 10 -30 40 C-10 60 0 0 0 0 Z" fill="#801336" />
            <path d="M0 0 C-30 -60 20 -70 40 -30 C50 -10 0 0 0 0 Z" fill="#9E1B43" />
            <path d="M0 0 C20 -60 70 -30 60 15 C50 40 0 0 0 0 Z" fill="#801336" />
            <path d="M0 0 C50 10 50 60 10 65 C-20 70 0 0 0 0 Z" fill="#9E1B43" />
            <path d="M0 0 C-20 50 -60 40 -50 0 C-40 -20 0 0 0 0 Z" fill="#801336" />
            {/* Center pistil & stamen */}
            <circle cx="0" cy="0" r="14" fill="#F49CB4" />
            <path d="M0 0 Q15 -25 35 -35" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="35" cy="-35" r="4" fill="#F59E0B" />
          </g>

          {/* Smaller Accent Pink Blossom */}
          <g transform="translate(130, 185) scale(0.65)">
            <path d="M0 0 C-30 -30 -40 20 -15 35 C0 40 0 0 0 0 Z" fill="#F49CB4" />
            <path d="M0 0 C-20 -40 30 -40 30 -15 C30 0 0 0 0 0 Z" fill="#FCE4EC" />
            <path d="M0 0 C30 -20 40 20 20 35 C10 40 0 0 0 0 Z" fill="#F49CB4" />
            <circle cx="0" cy="0" r="10" fill="#801336" />
          </g>
        </svg>
      </motion.div>

      {/* BOTTOM-RIGHT: Maroon & Pink Hibiscus Flower Cluster */}
      <motion.div
        animate={{ y: [0, 3, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="fixed bottom-0 right-0 pointer-events-none z-0 select-none"
      >
        <svg
          viewBox="0 0 240 220"
          className="w-28 sm:w-36 h-auto drop-shadow-sm overflow-visible opacity-75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Leaves */}
          <path d="M220 220 Q200 160 155 150 Q130 180 160 220 Z" fill="#4A6B53" opacity="0.8" />
          <path d="M170 220 Q120 180 90 190 Q100 220 140 220 Z" fill="#60896C" opacity="0.75" />

          {/* Main Maroon Hibiscus */}
          <g transform="translate(170, 160) scale(-1, 1)">
            <path d="M0 0 C-40 -40 -60 10 -30 40 C-10 60 0 0 0 0 Z" fill="#801336" />
            <path d="M0 0 C-30 -60 20 -70 40 -30 C50 -10 0 0 0 0 Z" fill="#9E1B43" />
            <path d="M0 0 C20 -60 70 -30 60 15 C50 40 0 0 0 0 Z" fill="#801336" />
            <path d="M0 0 C50 10 50 60 10 65 C-20 70 0 0 0 0 Z" fill="#9E1B43" />
            <path d="M0 0 C-20 50 -60 40 -50 0 C-40 -20 0 0 0 0 Z" fill="#801336" />
            <circle cx="0" cy="0" r="14" fill="#F49CB4" />
            <path d="M0 0 Q15 -25 35 -35" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="35" cy="-35" r="4" fill="#F59E0B" />
          </g>

          {/* Secondary Pink Blossom */}
          <g transform="translate(100, 185) scale(-0.65, 0.65)">
            <path d="M0 0 C-30 -30 -40 20 -15 35 C0 40 0 0 0 0 Z" fill="#F49CB4" />
            <path d="M0 0 C-20 -40 30 -40 30 -15 C30 0 0 0 0 0 Z" fill="#FCE4EC" />
            <path d="M0 0 C30 -20 40 20 20 35 C10 40 0 0 0 0 Z" fill="#F49CB4" />
            <circle cx="0" cy="0" r="10" fill="#801336" />
          </g>
        </svg>
      </motion.div>

      {/* ================= TOP NAVIGATION PILL: "← Back" ================= */}
      {showBackButton && onBack && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed top-3 left-3 sm:top-4 sm:left-4 z-40"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-[#801336] text-[#FAF6F0] font-jakarta font-semibold text-xs tracking-wide shadow-pill-maroon hover:bg-[#9E1B43] active:scale-95 transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </motion.div>
      )}

      {/* ================= PAGE CONTENT ================= */}
      <div className="relative z-10 w-full flex-grow flex flex-col items-center justify-center px-3 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-6 max-w-5xl mx-auto my-auto">
        {children}
      </div>
    </div>
  );
};
