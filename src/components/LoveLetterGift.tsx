import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Feather } from 'lucide-react';
import { PolaroidPhoto } from '../types';

export const LoveLetterGift: React.FC = () => {
  const polaroids: PolaroidPhoto[] = [
    {
      id: 'p1',
      caption: 'The way you smile ✨',
      dateText: 'Timeless',
      rotation: -5,
      imageUrl: '/images/photo-1.svg',
    },
    {
      id: 'p2',
      caption: 'Starlit laughs 🌙',
      dateText: 'Unforgettable',
      rotation: 4,
      imageUrl: '/images/photo-2.svg',
    },
    {
      id: 'p3',
      caption: 'Pure Serendipity 💖',
      dateText: 'Always',
      rotation: -3,
      imageUrl: '/images/photo-3.svg',
    },
    {
      id: 'p4',
      caption: 'Forever my girl 🌸',
      dateText: 'With all my heart',
      rotation: 6,
      imageUrl: '/images/photo-4.svg',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center py-6 select-none">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="font-dancing text-2xl text-[#801336] block mb-1">
          Gift 3 of 3
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#801336] tracking-tight">
          A Handwritten Epistle
        </h1>
        <p className="font-dancing text-xl text-[#801336]/80 mt-1">
          "Penned straight from my soul for Hebziba"
        </p>
      </div>

      {/* Main 3-Column Layout: 2 Polaroids Left, Center Parchment Card, 2 Polaroids Right */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-6 items-center">
        {/* ================= LEFT 2 POLAROIDS ================= */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col items-center justify-center gap-6 order-2 lg:order-1">
          {polaroids.slice(0, 2).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, rotate: 0 }}
              style={{ rotate: `${item.rotation}deg` }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white p-3 pb-4 rounded-xl shadow-polaroid-scrap border border-rose-100 w-44 sm:w-52 relative flex flex-col cursor-pointer"
            >
              {/* Pink Heart Pin at Top Center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-7 h-7 rounded-full bg-[#F49CB4] border-2 border-white shadow-md flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-[#801336] text-[#801336]" />
              </div>

              {/* Photo Frame */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption */}
              <p className="font-dancing text-lg font-bold text-[#801336] text-center mt-3 leading-tight">
                {item.caption}
              </p>
              <span className="text-[10px] text-[#801336]/50 text-center font-jakarta">
                {item.dateText}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ================= CENTERPIECE: PARCHMENT-TEXTURED SCROLLABLE CARD ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 bg-[#E8D8C8] parchment-paper rounded-3xl p-6 sm:p-10 shadow-scrapbook-card border-4 border-[#D4B996] order-1 lg:order-2 flex flex-col relative"
        >
          {/* Decorative Corner Washi Tape */}
          <div className="absolute -top-3 left-8 bg-[#FFF8E7] px-4 py-1 rounded shadow-sm border border-amber-300/60 transform -rotate-3 text-xs font-dancing font-bold text-[#801336]">
            my deepest feelings 💌
          </div>

          <div className="flex items-center justify-between border-b border-[#801336]/20 pb-3 mb-4">
            <div className="flex items-center gap-2 text-[#801336]">
              <Feather className="w-4 h-4" />
              <span className="font-playfair text-xs tracking-widest uppercase font-bold">
                Private & Sealed
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-[#801336]" />
          </div>

          {/* Letter Title */}
          <h2 className="font-dancing text-3xl sm:text-4xl font-bold text-[#801336] mb-4">
            My Love Hebziba ❤️
          </h2>

          {/* Scrollable Letter Content (max-h-[420px] overflow-y-auto) */}
          <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-3 space-y-4 font-dancing text-xl sm:text-2xl text-[#801336] leading-relaxed text-justify">
            <p>
              From the very first moment our worlds crossed paths, you brought an effortless grace and warmth that completely changed everything. You turned ordinary days into quiet masterpieces, and laughter into something I could never get enough of.
            </p>
            <p>
              Today isn't just about another birthday on the calendar; it's a celebration of you—your radiant kindness, the sparkle in your eyes when you're truly happy, and the gentle strength you carry without even trying. You have this rare, beautiful power to make the entire world feel lighter simply by being in it.
            </p>
            <p>
              I want you to know how deeply cherished, loved, and valued you are. Not just today, but in every single second between the sunrise and the stars. May this coming year shower you with boundless joy, wild adventures, dreams fulfilled, and a love that never stops fighting for your smile.
            </p>
            <p>
              Thank you for being my happiest thought, my quiet comfort, and my absolute favorite person in the whole universe.
            </p>
          </div>

          {/* Signature Footer */}
          <div className="mt-6 pt-4 border-t border-[#801336]/20 flex items-center justify-between">
            <div>
              <p className="font-dancing text-2xl font-bold text-[#801336]">
                Forever yours,
              </p>
              <p className="font-playfair text-xs text-[#801336]/80 tracking-wider uppercase font-semibold">
                With All My Heart
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#801336]/20 text-[#801336] text-xs font-bold font-dancing">
              <Heart className="w-3.5 h-3.5 fill-[#801336] text-[#801336]" />
              <span>Sealed Forever</span>
            </div>
          </div>
        </motion.div>

        {/* ================= RIGHT 2 POLAROIDS ================= */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col items-center justify-center gap-6 order-3">
          {polaroids.slice(2, 4).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, rotate: 0 }}
              style={{ rotate: `${item.rotation}deg` }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white p-3 pb-4 rounded-xl shadow-polaroid-scrap border border-rose-100 w-44 sm:w-52 relative flex flex-col cursor-pointer"
            >
              {/* Pink Heart Pin at Top Center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-7 h-7 rounded-full bg-[#F49CB4] border-2 border-white shadow-md flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-[#801336] text-[#801336]" />
              </div>

              {/* Photo Frame */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption */}
              <p className="font-dancing text-lg font-bold text-[#801336] text-center mt-3 leading-tight">
                {item.caption}
              </p>
              <span className="text-[10px] text-[#801336]/50 text-center font-jakarta">
                {item.dateText}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
