import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles, BookOpen, Shuffle } from 'lucide-react';
import { vaultService, VaultPhoto } from '../services/vaultService';

interface MemoryAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryAlbumModal: React.FC<MemoryAlbumModalProps> = ({ isOpen, onClose }) => {
  const [photos, setPhotos] = useState<VaultPhoto[]>([]);
  const [decryptedUrls, setDecryptedUrls] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Initialize and load photo manifest
  useEffect(() => {
    if (!isOpen) return;

    const loadManifest = async () => {
      const list = await vaultService.init('2710');
      setPhotos(list);
    };

    loadManifest();
  }, [isOpen]);

  // Decrypt single photo on demand
  const loadPhoto = useCallback(async (photo: VaultPhoto) => {
    if (decryptedUrls[photo.file]) return;
    if (loadingMap[photo.file]) return;

    setLoadingMap((prev) => ({ ...prev, [photo.file]: true }));
    try {
      const url = await vaultService.getDecryptedUrl(photo.file);
      setDecryptedUrls((prev) => ({ ...prev, [photo.file]: url }));
    } catch (e) {
      console.error('Failed to decrypt photo', photo.file, e);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [photo.file]: false }));
    }
  }, [decryptedUrls, loadingMap]);

  // Keyboard navigation for spotlight modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (activePhotoIndex !== null) {
          setActivePhotoIndex(null);
        } else {
          onClose();
        }
      } else if (activePhotoIndex !== null) {
        if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activePhotoIndex, photos.length]);

  const handleNext = () => {
    if (activePhotoIndex === null || photos.length === 0) return;
    const nextIdx = (activePhotoIndex + 1) % photos.length;
    setActivePhotoIndex(nextIdx);
    loadPhoto(photos[nextIdx]);
  };

  const handlePrev = () => {
    if (activePhotoIndex === null || photos.length === 0) return;
    const prevIdx = (activePhotoIndex - 1 + photos.length) % photos.length;
    setActivePhotoIndex(prevIdx);
    loadPhoto(photos[prevIdx]);
  };

  const handleShuffle = () => {
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    setPhotos(shuffled);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Scrapbook Album Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl h-[90vh] bg-[#FAF6F0] rounded-3xl shadow-2xl border-4 border-[#801336]/20 flex flex-col overflow-hidden z-10"
          style={{
            backgroundImage: `radial-gradient(rgba(139, 30, 63, 0.08) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-rose-200/80 flex items-center justify-between shrink-0 shadow-sm relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#801336] text-white flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-[#F49CB4]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#801336]">
                    Our Scrapbook of Memories
                  </h2>
                  <span className="bg-[#F49CB4]/30 text-[#801336] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#801336]/20">
                    {photos.length} Memories
                  </span>
                </div>
                <p className="font-dancing text-sm text-[#801336]/80 hidden sm:block">
                  "Every photo is a treasure with my bestie, Hebziba" — End-to-end encrypted & decrypted in your browser
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                title="Shuffle Photos"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-[#801336] border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-rose-100 hover:bg-rose-200 text-[#801336] flex items-center justify-center transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Album Grid Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            {photos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Sparkles className="w-10 h-10 text-[#801336] animate-spin mb-3" />
                <p className="font-playfair text-xl text-[#801336]">Decrypting Vault Photos...</p>
                <p className="font-dancing text-sm text-[#801336]/70 mt-1">
                  Using your Birthday Passcode (2710)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {photos.map((item, index) => {
                  const url = decryptedUrls[item.file];
                  const isLoading = loadingMap[item.file];

                  return (
                    <PolaroidItem
                      key={item.id}
                      item={item}
                      index={index}
                      url={url}
                      isLoading={isLoading}
                      onVisible={() => loadPhoto(item)}
                      onClick={() => {
                        setActivePhotoIndex(index);
                        loadPhoto(item);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="bg-[#FAF6F0] px-6 py-2.5 border-t border-rose-200/60 flex items-center justify-between text-xs text-[#801336]/70 font-sans">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#801336] fill-[#801336]" />
              Tap any Polaroid to expand in full view
            </span>
            <span className="font-mono text-[10px] hidden sm:inline">
              🔒 AES-256-GCM Zero-Knowledge Vault
            </span>
          </div>
        </motion.div>

        {/* ================= FULLSCREEN SPOTLIGHT MODAL ================= */}
        {activePhotoIndex !== null && photos[activePhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-4 right-4 z-70 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-70 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-70 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Polaroid Large Card */}
            <motion.div
              key={activePhotoIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 pb-6 rounded-2xl shadow-2xl max-w-xl max-h-[88vh] flex flex-col items-center relative border border-white/50"
            >
              {/* Taped label */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFF8E7] px-4 py-1 rounded shadow-sm border border-amber-200 text-xs font-dancing font-bold text-[#801336]">
                Memory {activePhotoIndex + 1} of {photos.length}
              </div>

              {/* Photo Display */}
              <div className="w-full flex-1 min-h-[300px] max-h-[68vh] rounded-lg overflow-hidden bg-rose-50/50 flex items-center justify-center">
                {decryptedUrls[photos[activePhotoIndex].file] ? (
                  <img
                    src={decryptedUrls[photos[activePhotoIndex].file]}
                    alt={`Memory ${activePhotoIndex + 1}`}
                    className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-8">
                    <Sparkles className="w-8 h-8 text-[#801336] animate-spin" />
                    <span className="font-dancing text-sm text-[#801336]">Decrypting photo...</span>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="mt-3 text-center">
                <span className="font-dancing text-2xl text-[#801336] font-bold block">
                  Hebziba & Dhinesh ✨
                </span>
                <span className="text-xs text-rose-900/60 font-sans">
                  October 27 • 22nd Birthday Celebration
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

// ================= INDIVIDUAL POLAROID ITEM =================
interface PolaroidItemProps {
  item: VaultPhoto;
  index: number;
  url?: string;
  isLoading?: boolean;
  onVisible: () => void;
  onClick: () => void;
}

const PolaroidItem: React.FC<PolaroidItemProps> = ({
  item,
  index,
  url,
  isLoading,
  onVisible,
  onClick,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Trigger lazy decryption when card enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  // Subtle natural scrapbook rotations
  const rotations = [-2, 1.5, -1, 2, -2.5, 1];
  const rot = rotations[index % rotations.length];

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ rotate: rot }}
      className="bg-white p-2.5 pb-3.5 rounded-xl shadow-polaroid-scrap border border-rose-100 flex flex-col items-center cursor-pointer transition-shadow hover:shadow-xl relative group"
    >
      {/* Heart pin */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full bg-[#F49CB4] border border-white shadow-sm flex items-center justify-center">
        <Heart className="w-2.5 h-2.5 fill-[#801336] text-[#801336]" />
      </div>

      {/* Image frame */}
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-rose-50 flex items-center justify-center relative">
        {url ? (
          <img
            src={url}
            alt={`Memory #${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 p-2">
            <Sparkles className="w-5 h-5 text-[#801336]/40 animate-pulse" />
            <span className="text-[10px] text-[#801336]/50 font-sans">
              {isLoading ? 'Decrypting...' : `#${index + 1}`}
            </span>
          </div>
        )}
      </div>

      {/* Caption */}
      <span className="font-dancing text-xs font-bold text-[#801336] mt-2 text-center truncate max-w-full">
        {item.caption || `Memory #${index + 1}`}
      </span>
    </motion.div>
  );
};
