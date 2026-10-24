import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Calendar, MapPin, X, ZoomIn, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryLaneProps {
  memories: MemoryItem[];
}

export const MemoryLane: React.FC<MemoryLaneProps> = ({ memories }) => {
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeMemory) return;
    const currentIndex = memories.findIndex((m) => m.id === activeMemory.id);
    const nextIndex = (currentIndex + 1) % memories.length;
    setActiveMemory(memories[nextIndex]);
  };

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeMemory) return;
    const currentIndex = memories.findIndex((m) => m.id === activeMemory.id);
    const prevIndex = (currentIndex - 1 + memories.length) % memories.length;
    setActiveMemory(memories[prevIndex]);
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto py-16 px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-highlight/10 border border-accent-highlight/20 text-accent-highlight text-xs font-semibold uppercase tracking-wider mb-3"
        >
          <Camera className="w-3.5 h-3.5" />
          Treasured Milestones
        </motion.div>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-tprimary tracking-tight">
          Memory Lane Scrapbook
        </h2>
        <p className="mt-3 text-tmuted text-sm sm:text-base max-w-lg mx-auto">
          Snapshots of our favorite chapters together. Tap any polaroid to zoom into the full memory.
        </p>
      </div>

      {/* Responsive Layout:
          - Mobile: Horizontal snap-scrolling rail
          - Desktop (sm+): 2 and 3 column responsive grid
      */}
      <div className="relative">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto sm:overflow-visible pb-8 sm:pb-0 px-2 sm:px-0 snap-x snap-mandatory hide-scrollbar">
          {memories.map((item, index) => {
            const hasError = imageErrors[item.id];
            const imgSrc = hasError ? `/images/photo-${(index % 6) + 1}.svg` : item.imageUrl;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[290px] sm:w-auto snap-center group"
              >
                {/* Polaroid Card Wrapper with hover scale and reset rotation */}
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    zIndex: 20,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  style={{
                    rotate: `${item.rotationDeg}deg`,
                  }}
                  onClick={() => setActiveMemory(item)}
                  className="bg-[#FAFAFA] rounded-xl p-3 sm:p-4 shadow-polaroid hover:shadow-2xl cursor-pointer border border-white/20 transition-all duration-300 flex flex-col"
                >
                  {/* Photo Frame */}
                  <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-slate-900 group-hover:brightness-105 transition-all">
                    <img
                      src={imgSrc}
                      alt={item.title}
                      loading="lazy"
                      onError={() => handleImageError(item.id)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Lens reflection shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Click zoom hint badge */}
                    <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Polaroid Bottom Border Caption Area (with Caveat handwriting font) */}
                  <div className="pt-4 pb-2 px-1 flex flex-col justify-between flex-grow text-slate-800">
                    <p className="font-handwriting text-xl sm:text-2xl font-bold leading-snug line-clamp-2 text-slate-900">
                      {item.caption}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-sans">
                      <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                        {item.title}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-accent-primary" />
                        {item.dateText}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-center gap-2 mt-2 text-xs text-tmuted">
          <Sparkles className="w-3 h-3 text-accent-secondary" />
          <span>Swipe sideways to explore all milestones</span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-xl">
            {/* Backdrop click closes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMemory(null)}
              className="absolute inset-0 cursor-pointer"
            />

            {/* Lightbox Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button Top Right */}
              <button
                onClick={() => setActiveMemory(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors backdrop-blur-sm"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next navigation buttons on desktop */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextLightbox}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors md:hidden"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* High-res Image section */}
              <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative min-h-[260px] md:min-h-full">
                <img
                  src={
                    imageErrors[activeMemory.id]
                      ? `/images/photo-${(memories.findIndex((m) => m.id === activeMemory.id) % 6) + 1}.svg`
                      : activeMemory.imageUrl
                  }
                  alt={activeMemory.title}
                  className="w-full h-full object-cover max-h-[50vh] md:max-h-[85vh]"
                />
              </div>

              {/* Detail & Story section */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-surface/95">
                <div>
                  <div className="flex items-center gap-3 text-xs text-accent-secondary font-semibold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {activeMemory.dateText}
                    </span>
                    {activeMemory.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-accent-primary" />
                        {activeMemory.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-tprimary mb-3">
                    {activeMemory.title}
                  </h3>

                  <p className="font-handwriting text-2xl sm:text-3xl text-accent-highlight mb-4 leading-snug">
                    "{activeMemory.caption}"
                  </p>

                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {activeMemory.story ||
                      'An unforgettable memory marked by heartfelt conversations, spontaneous joy, and unconditional camaraderie.'}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-tmuted">
                    Milestone {memories.findIndex((m) => m.id === activeMemory.id) + 1} of{' '}
                    {memories.length}
                  </span>

                  <button
                    onClick={handleNextLightbox}
                    className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-accent-primary hover:text-rose-400 transition-colors"
                  >
                    <span>Next Memory</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
