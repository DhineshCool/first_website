import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  BookOpen,
  Shuffle,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
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
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const decryptedUrlsRef = useRef<Record<string, string>>({});
  const loadingMapRef = useRef<Record<string, boolean>>({});

  // Decrypt single photo on demand
  const loadPhoto = useCallback(async (photo: VaultPhoto): Promise<string> => {
    if (decryptedUrlsRef.current[photo.file]) {
      return decryptedUrlsRef.current[photo.file];
    }
    if (loadingMapRef.current[photo.file]) {
      return '';
    }

    loadingMapRef.current[photo.file] = true;
    setLoadingMap((prev) => ({ ...prev, [photo.file]: true }));

    try {
      const url = await vaultService.getDecryptedUrl(photo.file);
      decryptedUrlsRef.current[photo.file] = url;
      setDecryptedUrls((prev) => ({ ...prev, [photo.file]: url }));
      return url;
    } catch (e) {
      console.error('Failed to decrypt photo', photo.file, e);
      return '';
    } finally {
      loadingMapRef.current[photo.file] = false;
      setLoadingMap((prev) => ({ ...prev, [photo.file]: false }));
    }
  }, []);

  // Initialize and load photo manifest, preloading first batch immediately
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadManifest = async () => {
      try {
        const list = await vaultService.init('2710');
        if (!isMounted) return;
        setPhotos(list);

        // Preload the first 24 photos so the top 6 rows load instantly without waiting
        const initialBatch = list.slice(0, 24);
        initialBatch.forEach((item) => loadPhoto(item));
      } catch (err) {
        console.warn('Scrapbook vault init error:', err);
      }
    };

    loadManifest();

    return () => {
      isMounted = false;
    };
  }, [isOpen, loadPhoto]);

  // Open spotlight on click
  const handleOpenSpotlight = useCallback(
    (index: number) => {
      setActivePhotoIndex(index);
      setIsZoomed(false);
      const photo = photos[index];
      if (photo) {
        loadPhoto(photo);
        // Preload next & previous
        if (index + 1 < photos.length) loadPhoto(photos[index + 1]);
        if (index - 1 >= 0) loadPhoto(photos[index - 1]);
      }
    },
    [photos, loadPhoto]
  );

  const handleNext = useCallback(() => {
    if (activePhotoIndex === null || photos.length === 0) return;
    const nextIdx = (activePhotoIndex + 1) % photos.length;
    setActivePhotoIndex(nextIdx);
    setIsZoomed(false);
    loadPhoto(photos[nextIdx]);
    if (nextIdx + 1 < photos.length) loadPhoto(photos[nextIdx + 1]);
  }, [activePhotoIndex, photos, loadPhoto]);

  const handlePrev = useCallback(() => {
    if (activePhotoIndex === null || photos.length === 0) return;
    const prevIdx = (activePhotoIndex - 1 + photos.length) % photos.length;
    setActivePhotoIndex(prevIdx);
    setIsZoomed(false);
    loadPhoto(photos[prevIdx]);
    if (prevIdx - 1 >= 0) loadPhoto(photos[prevIdx - 1]);
  }, [activePhotoIndex, photos, loadPhoto]);

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
  }, [isOpen, activePhotoIndex, handleNext, handlePrev, onClose]);

  const handleShuffle = () => {
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    setPhotos(shuffled);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Scrapbook Album Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl h-[92vh] bg-[#FAF6F0] rounded-3xl shadow-2xl border-4 border-[#801336]/20 flex flex-col overflow-hidden z-10"
          style={{
            backgroundImage: `radial-gradient(rgba(139, 30, 63, 0.08) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-rose-200/80 flex items-center justify-between shrink-0 shadow-sm relative z-20">
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
                <p className="font-dancing text-xs sm:text-sm text-[#801336]/80 hidden sm:block">
                  "Every photo is a treasure with my bestie, Hebziba" — End-to-end encrypted in vault
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

          {/* Album Grid Content: 4 Photos Per Row on Desktop/Laptop */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-7">
            {photos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Sparkles className="w-10 h-10 text-[#801336] animate-spin mb-3" />
                <p className="font-playfair text-xl text-[#801336]">Decrypting Vault Photos...</p>
                <p className="font-dancing text-sm text-[#801336]/70 mt-1">
                  Using your Birthday Passcode (2710)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                      onClick={() => handleOpenSpotlight(index)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="bg-[#FAF6F0] px-4 sm:px-6 py-2.5 border-t border-rose-200/60 flex items-center justify-between text-xs text-[#801336]/70 font-sans">
            <span className="flex items-center gap-1.5 font-dancing text-sm text-[#801336] font-bold">
              <Heart className="w-3.5 h-3.5 text-[#801336] fill-[#801336]" />
              Tap any photo to expand into high resolution!
            </span>
            <span className="font-mono text-[10px] hidden sm:inline text-[#801336]/60">
              🔒 AES-256-GCM Zero-Knowledge Vault
            </span>
          </div>
        </motion.div>

        {/* ================= FULLSCREEN SPOTLIGHT EXPAND MODAL ================= */}
        <AnimatePresence>
          {activePhotoIndex !== null && photos[activePhotoIndex] && (
            <motion.div
              key="spotlight-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
              onClick={() => setActivePhotoIndex(null)}
            >
              {/* Top Bar Controls */}
              <div className="absolute top-4 right-4 z-[110] flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed((prev) => !prev);
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                  title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                >
                  {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm"
                title="Previous Photo (←)"
              >
                <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm"
                title="Next Photo (→)"
              >
                <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>

              {/* Polaroid Expanded Spotlight Card */}
              <motion.div
                key={activePhotoIndex}
                initial={{ scale: 0.88, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-3.5 sm:p-5 pb-5 sm:pb-6 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl max-h-[92vh] flex flex-col items-center relative border-2 border-white ring-1 ring-black/10 z-[105]"
              >
                {/* Pink Heart Pin at Top Center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full bg-[#F49CB4] border-2 border-white shadow-md flex items-center justify-center">
                  <Heart className="w-3 h-3 fill-[#801336] text-[#801336]" />
                </div>

                {/* Tape Header Label */}
                <div className="mb-2 bg-[#FFF8E7] px-3.5 py-1 rounded shadow-sm border border-amber-200/60 text-xs font-dancing font-bold text-[#801336] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                  <span>
                    Memory {activePhotoIndex + 1} of {photos.length}
                  </span>
                  <Heart className="w-2.5 h-2.5 fill-[#F49CB4] text-[#801336]" />
                </div>

                {/* Expanded Photo Container */}
                <div
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className={`w-full overflow-hidden rounded-xl bg-rose-50/50 flex items-center justify-center transition-all duration-300 ${
                    isZoomed ? 'cursor-zoom-out max-h-[75vh]' : 'cursor-zoom-in max-h-[62vh] sm:max-h-[66vh]'
                  }`}
                >
                  {decryptedUrls[photos[activePhotoIndex].file] ? (
                    <motion.img
                      src={decryptedUrls[photos[activePhotoIndex].file]}
                      alt={photos[activePhotoIndex].caption || `Memory ${activePhotoIndex + 1}`}
                      animate={{ scale: isZoomed ? 1.5 : 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                      className="max-h-[62vh] sm:max-h-[66vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-12 min-h-[300px] justify-center">
                      <Sparkles className="w-10 h-10 text-[#801336] animate-spin" />
                      <span className="font-dancing text-base text-[#801336] font-bold">
                        Decrypting Vault Memory...
                      </span>
                    </div>
                  )}
                </div>

                {/* Caption & Date Footer */}
                <div className="mt-3 text-center w-full">
                  <h3 className="font-dancing text-xl sm:text-2xl text-[#801336] font-bold block leading-snug">
                    {photos[activePhotoIndex].caption || 'Unforgettable Times with Hebziba 💖'}
                  </h3>
                  <p className="text-xs text-[#801336]/60 font-jakarta mt-0.5">
                    Hebziba & Dhinesh • Celebrating 22 Wonderful Years ✨
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
      { rootMargin: '250px' }
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
      whileHover={{ scale: 1.05, y: -4, rotate: 0, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ rotate: rot }}
      className="bg-white p-2.5 pb-3.5 rounded-xl shadow-polaroid-scrap border border-rose-100 flex flex-col items-center cursor-pointer transition-shadow hover:shadow-xl relative group"
    >
      {/* Heart pin */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full bg-[#F49CB4] border border-white shadow-sm flex items-center justify-center">
        <Heart className="w-2.5 h-2.5 fill-[#801336] text-[#801336]" />
      </div>

      {/* Hover Expand Badge */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white p-1 rounded-full shadow-sm z-20">
        <Maximize2 className="w-3 h-3" />
      </div>

      {/* Image frame */}
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-rose-50 flex items-center justify-center relative shadow-inner border border-rose-100">
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
