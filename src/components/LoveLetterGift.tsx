import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Feather,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { PolaroidPhoto } from '../types';
import { vaultService } from '../services/vaultService';

export const LoveLetterGift: React.FC = () => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    '/images/photo-1.svg',
    '/images/photo-2.svg',
    '/images/photo-3.svg',
    '/images/photo-4.svg',
  ]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadVaultPhotos = async () => {
      const photos = await vaultService.init('2710');
      if (photos.length >= 4) {
        const filesToDecrypt = [
          photos[0].file,
          photos[Math.min(5, photos.length - 1)].file,
          photos[Math.min(12, photos.length - 1)].file,
          photos[Math.min(20, photos.length - 1)].file,
        ];
        const urls = await Promise.all(
          filesToDecrypt.map((f) => vaultService.getDecryptedUrl(f).catch(() => ''))
        );
        setPhotoUrls((prev) => urls.map((u, i) => u || prev[i]));
      }
    };
    loadVaultPhotos();
  }, []);

  const polaroids: PolaroidPhoto[] = [
    {
      id: 'p1',
      caption: 'The way you smile ✨',
      dateText: 'Timeless',
      rotation: -5,
      imageUrl: photoUrls[0],
    },
    {
      id: 'p2',
      caption: 'Starlit laughs 🌙',
      dateText: 'Unforgettable',
      rotation: 4,
      imageUrl: photoUrls[1],
    },
    {
      id: 'p3',
      caption: 'Pure Serendipity 💖',
      dateText: 'Always',
      rotation: -3,
      imageUrl: photoUrls[2],
    },
    {
      id: 'p4',
      caption: 'Forever my bestie 🌸',
      dateText: 'Through everything',
      rotation: 6,
      imageUrl: photoUrls[3],
    },
  ];

  const handleNext = useCallback(() => {
    if (expandedIndex === null) return;
    setExpandedIndex((prev) => ((prev ?? 0) + 1) % polaroids.length);
  }, [expandedIndex, polaroids.length]);

  const handlePrev = useCallback(() => {
    if (expandedIndex === null) return;
    setExpandedIndex((prev) => ((prev ?? 0) - 1 + polaroids.length) % polaroids.length);
  }, [expandedIndex, polaroids.length]);

  // Keyboard navigation for expanded photo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedIndex === null) return;
      if (e.key === 'Escape') {
        setExpandedIndex(null);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedIndex, handleNext, handlePrev]);

  return (
    <div className="w-full flex flex-col items-center py-1 sm:py-2 select-none">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-3">
        <span className="font-dancing text-lg sm:text-xl text-[#801336] block mb-0.5">
          Gift 3 of 3
        </span>
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#801336] tracking-tight">
          A Letter to My Bestie
        </h1>
        <p className="font-dancing text-xs sm:text-sm text-[#801336]/80 mt-0.5">
          "Penned straight from the soul for my bestie, Hebziba"
        </p>
      </div>

      {/* Main 3-Column Layout: 2 Polaroids Left, Center Parchment Card, 2 Polaroids Right */}
      <div className="w-full max-w-4xl p-2.5 sm:p-4 rounded-3xl backdrop-blur-md bg-[#FAF6F0]/65 border border-rose-100/60 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center relative z-20">
        {/* ================= LEFT 2 POLAROIDS ================= */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col items-center justify-around h-full gap-2.5 sm:gap-3 order-2 lg:order-1 py-1">
          {polaroids.slice(0, 2).map((item, idx) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.06, rotate: 0 }}
              style={{ rotate: `${item.rotation}deg` }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={() => setExpandedIndex(idx)}
              className="bg-white p-2 pb-2.5 sm:p-2.5 sm:pb-3 rounded-xl shadow-2xl border-2 border-white ring-2 ring-rose-300/80 w-26 sm:w-30 relative flex flex-col cursor-pointer z-20 transform transition-shadow hover:shadow-rose-200/80 group"
              title="Click to expand"
            >
              {/* Pink Heart Pin at Top Center */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 w-5.5 h-5.5 rounded-full bg-[#F49CB4] border-2 border-white shadow-md flex items-center justify-center">
                <Heart className="w-3 h-3 fill-[#801336] text-[#801336]" />
              </div>

              {/* Hover Expand Icon */}
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-0.5 rounded-full shadow-sm z-20">
                <Maximize2 className="w-2.5 h-2.5" />
              </div>

              {/* Photo Frame */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-100 shadow-inner">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Caption */}
              <p className="font-dancing text-xs sm:text-sm font-bold text-[#801336] text-center mt-1.5 leading-tight">
                {item.caption}
              </p>
              <span className="text-[9px] text-[#801336]/50 text-center font-jakarta">
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
          className="lg:col-span-6 bg-[#E8D8C8]/95 parchment-paper rounded-2xl p-4 sm:p-5 shadow-2xl border-3 border-[#D4B996] order-1 lg:order-2 flex flex-col relative z-20 backdrop-blur-sm"
        >
          {/* Decorative Corner Washi Tape */}
          <div className="absolute -top-2.5 left-6 bg-[#FFF8E7] px-3 py-0.5 rounded shadow-sm border border-amber-300/60 transform -rotate-3 text-[10px] font-dancing font-bold text-[#801336]">
            my deepest feelings 💌
          </div>

          <div className="flex items-center justify-between border-b border-[#801336]/20 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 text-[#801336]">
              <Feather className="w-3.5 h-3.5" />
              <span className="font-playfair text-[10px] sm:text-xs tracking-widest uppercase font-bold">
                Private & Sealed
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#801336]" />
          </div>

          {/* Letter Title */}
          <h2 className="font-dancing text-xl sm:text-2xl font-bold text-[#801336] mb-2">
            My Bestie Hebziba ❤️
          </h2>

          {/* Scrollable Letter Content */}
          <div className="max-h-[180px] sm:max-h-[220px] overflow-y-auto pr-2 space-y-2.5 font-dancing text-base sm:text-lg text-[#801336] leading-relaxed text-left">
            <p>
              To the person who knows my wildest stories, laughs at my dumbest jokes, and always stands by me no matter what—Happy 22nd Birthday!
            </p>
            <p>
              Having you as my best friend has been one of the greatest blessings. From random spontaneous late-night conversations to all the unfiltered laughs that hurt our stomachs, every memory with you is pure gold. You have this rare gift of making even the most boring days feel fun and full of life.
            </p>
            <p>
              As you step into 22, you bring so much light, humor, and genuine joy into this world. I hope being 22 brings you everything your heart desires—massive success, endless happiness, incredible adventures, and all the sweet moments you truly deserve.
            </p>
            <p>
              No matter where life takes us or how crazy things get, know that I’ll always have your back. Cheers to another year of inside jokes, surviving chaos together, and being the best duo ever!
            </p>
          </div>

          {/* Signature Footer */}
          <div className="mt-3 pt-2 border-t border-[#801336]/20 flex items-center justify-between">
            <div>
              <p className="font-dancing text-lg sm:text-xl font-bold text-[#801336]">
                Best Friends Forever,
              </p>
              <p className="font-playfair text-[10px] sm:text-xs text-[#801336]/80 tracking-wider uppercase font-semibold">
                Your Partner in Crime, Dhinesh ✨
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 border border-[#801336]/20 text-[#801336] text-[11px] font-bold font-dancing">
              <Heart className="w-3 h-3 fill-[#801336] text-[#801336]" />
              <span>Forever Besties</span>
            </div>
          </div>
        </motion.div>

        {/* ================= RIGHT 2 POLAROIDS ================= */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col items-center justify-around h-full gap-2.5 sm:gap-3 order-3 py-1">
          {polaroids.slice(2, 4).map((item, idx) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.06, rotate: 0 }}
              style={{ rotate: `${item.rotation}deg` }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={() => setExpandedIndex(idx + 2)}
              className="bg-white p-2 pb-2.5 sm:p-2.5 sm:pb-3 rounded-xl shadow-2xl border-2 border-white ring-2 ring-rose-300/80 w-26 sm:w-30 relative flex flex-col cursor-pointer z-20 transform transition-shadow hover:shadow-rose-200/80 group"
              title="Click to expand"
            >
              {/* Pink Heart Pin at Top Center */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 w-5.5 h-5.5 rounded-full bg-[#F49CB4] border-2 border-white shadow-md flex items-center justify-center">
                <Heart className="w-3 h-3 fill-[#801336] text-[#801336]" />
              </div>

              {/* Hover Expand Icon */}
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-0.5 rounded-full shadow-sm z-20">
                <Maximize2 className="w-2.5 h-2.5" />
              </div>

              {/* Photo Frame */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-100 shadow-inner">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Caption */}
              <p className="font-dancing text-xs sm:text-sm font-bold text-[#801336] text-center mt-1.5 leading-tight">
                {item.caption}
              </p>
              <span className="text-[9px] text-[#801336]/50 text-center font-jakarta">
                {item.dateText}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= FULLSCREEN SPOTLIGHT EXPAND MODAL ================= */}
      <AnimatePresence>
        {expandedIndex !== null && polaroids[expandedIndex] && (
          <motion.div
            key="letter-spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
            onClick={() => setExpandedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setExpandedIndex(null)}
              className="absolute top-4 right-4 z-[110] w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
              title="Previous Photo (←)"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
              title="Next Photo (→)"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Large Polaroid Card */}
            <motion.div
              key={expandedIndex}
              initial={{ scale: 0.88, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 sm:p-5 pb-6 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col items-center relative border-2 border-white"
            >
              {/* Pink Heart Pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full bg-[#F49CB4] border-2 border-white shadow-md flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-[#801336] text-[#801336]" />
              </div>

              {/* Tape Header Label */}
              <div className="mb-2 bg-[#FFF8E7] px-3.5 py-1 rounded shadow-sm border border-amber-200/60 text-xs font-dancing font-bold text-[#801336] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                <span>
                  Photo {expandedIndex + 1} of {polaroids.length}
                </span>
                <Heart className="w-2.5 h-2.5 fill-[#F49CB4] text-[#801336]" />
              </div>

              {/* Photo Display */}
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner flex items-center justify-center">
                <img
                  src={polaroids[expandedIndex].imageUrl}
                  alt={polaroids[expandedIndex].caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption */}
              <div className="mt-3 text-center">
                <h3 className="font-dancing text-xl sm:text-2xl font-bold text-[#801336]">
                  {polaroids[expandedIndex].caption}
                </h3>
                <span className="text-xs text-[#801336]/60 font-jakarta mt-0.5 block">
                  {polaroids[expandedIndex].dateText} • Forever Besties
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
