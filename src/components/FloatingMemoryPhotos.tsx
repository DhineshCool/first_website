import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Camera, X, Image as ImageIcon } from 'lucide-react';
import { vaultService } from '../services/vaultService';

interface FloatingPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  rotation: number;
  // Positioning percentage for desktop/tablet
  xOffset: number; // percentage from left
  yOffset: number; // percentage from top
  floatDistance: number;
  duration: number;
}

const defaultMemories: FloatingPhoto[] = [
  {
    id: 'mem-1',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Pure Laughs ✨',
    rotation: -4,
    xOffset: 1,
    yOffset: 14,
    floatDistance: 15,
    duration: 6,
  },
  {
    id: 'mem-2',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Golden Hour 🌅',
    rotation: 5,
    xOffset: 90,
    yOffset: 16,
    floatDistance: -16,
    duration: 7,
  },
  {
    id: 'mem-3',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Cafe Hangouts 🍰',
    rotation: -3,
    xOffset: 1.5,
    yOffset: 50,
    floatDistance: 14,
    duration: 6.5,
  },
  {
    id: 'mem-4',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Road Trip Vibes 🚗',
    rotation: 6,
    xOffset: 89.5,
    yOffset: 48,
    floatDistance: -15,
    duration: 7.5,
  },
  {
    id: 'mem-5',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Sunny Picnics 🍓',
    rotation: -5,
    xOffset: 2,
    yOffset: 76,
    floatDistance: 12,
    duration: 8,
  },
  {
    id: 'mem-6',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Late Night Talks 🌌',
    rotation: 4,
    xOffset: 90,
    yOffset: 75,
    floatDistance: -14,
    duration: 7.2,
  },
];

export const FloatingMemoryPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<FloatingPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('hebziba_custom_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return defaultMemories;
  });

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [customCaption, setCustomCaption] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Persist custom photos
  useEffect(() => {
    try {
      localStorage.setItem('hebziba_custom_photos', JSON.stringify(photos));
    } catch {
      // Safe fallback
    }
  }, [photos]);

  // Load and decrypt real vault photos for background polaroids
  useEffect(() => {
    const loadVaultMemories = async () => {
      const vaultList = await vaultService.init('2710');
      if (vaultList.length >= 6) {
        const indices = [2, 18, 35, 52, 70, 95];
        const selected = indices.map((i) => vaultList[i % vaultList.length]);

        const decryptedUrls = await Promise.all(
          selected.map((item) => vaultService.getDecryptedUrl(item.file).catch(() => ''))
        );

        setPhotos((prev) => {
          return prev.map((item, idx) => {
            if (decryptedUrls[idx]) {
              return {
                ...item,
                imageUrl: decryptedUrls[idx],
              };
            }
            return item;
          });
        });
      }
    };

    loadVaultMemories();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomPhoto = () => {
    if (!previewUrl) return;

    // Pick random side positions so they frame the screen
    const isLeft = Math.random() > 0.5;
    const xOffset = isLeft ? Math.floor(Math.random() * 8 + 2) : Math.floor(Math.random() * 8 + 82);
    const yOffset = Math.floor(Math.random() * 70 + 15);

    const newPhoto: FloatingPhoto = {
      id: 'custom-' + Date.now(),
      imageUrl: previewUrl,
      caption: customCaption.trim() || 'Bestie Memory 💖',
      rotation: Math.floor(Math.random() * 12 - 6),
      xOffset,
      yOffset,
      floatDistance: Math.random() > 0.5 ? 18 : -18,
      duration: Math.random() * 2 + 6,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setPreviewUrl('');
    setCustomCaption('');
    setShowUploadModal(false);
  };

  const handleResetToDefault = () => {
    setPhotos(defaultMemories);
    localStorage.removeItem('hebziba_custom_photos');
    setShowUploadModal(false);
  };

  return (
    <>
      {/* ================= AMBIENT FLOATING POLAROIDS LAYER ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {photos.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, item.floatDistance, 0],
              rotate: [item.rotation, item.rotation + 2, item.rotation],
            }}
            transition={{
              opacity: { duration: 0.8, delay: index * 0.15 },
              scale: { duration: 0.8, delay: index * 0.15 },
              y: {
                repeat: Infinity,
                duration: item.duration,
                ease: 'easeInOut',
              },
              rotate: {
                repeat: Infinity,
                duration: item.duration * 1.2,
                ease: 'easeInOut',
              },
            }}
            style={{
              position: 'absolute',
              left: `${item.xOffset}%`,
              top: `${item.yOffset}%`,
            }}
            className="hidden xl:flex pointer-events-none"
          >
            {/* Scrapbook Mini Polaroid Card */}
            <div className="bg-white/95 p-2 pb-2.5 rounded-xl shadow-md border border-rose-100/90 w-24 lg:w-28 flex flex-col items-center relative opacity-80 transition-opacity">
              {/* Pink Heart Pin at Top Center */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full bg-[#F49CB4] border border-white shadow-sm flex items-center justify-center">
                <Heart className="w-2 h-2 fill-[#801336] text-[#801336]" />
              </div>

              {/* Square Photo Frame */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-rose-50/50 shadow-inner">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption */}
              <span className="font-dancing text-xs font-bold text-[#801336] text-center mt-1 leading-tight truncate max-w-full px-0.5">
                {item.caption}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= FLOATING "+ ADD MEMORIES" PILL BUTTON (Bottom Right) ================= */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-sm text-[#801336] border border-[#801336]/30 shadow-md hover:bg-rose-50 flex items-center gap-1.5 font-playfair text-xs font-bold transition-all"
          title="Add custom photos to float in the background"
        >
          <Camera className="w-3.5 h-3.5 text-[#801336]" />
          <span>Add Photos</span>
          <span className="px-1.5 py-0.2 bg-rose-100 rounded-full text-[10px] text-[#801336]">
            {photos.length}
          </span>
        </motion.button>
      </div>

      {/* ================= CUSTOM PHOTO UPLOAD MODAL ================= */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-200 relative text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setPreviewUrl('');
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-[#801336] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-[#801336] flex items-center justify-center mb-3">
                <Camera className="w-6 h-6" />
              </div>

              <h3 className="font-playfair text-2xl font-bold text-[#801336] mb-1">
                Background Memory Photos
              </h3>
              <p className="font-dancing text-base text-[#801336]/80 mb-5">
                "Add special real photos to float gently in the scrapbook background!"
              </p>

              {/* File input / Preview area */}
              <div className="mb-4">
                {previewUrl ? (
                  <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-rose-300 shadow-md mb-3">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPreviewUrl('')}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-rose-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50/50 transition-colors">
                    <ImageIcon className="w-8 h-8 text-[#801336]/60 mb-2" />
                    <span className="font-playfair text-xs font-bold text-[#801336]">
                      Click to choose a photo from device
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Caption input */}
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Caption (e.g. Bestie Laughs, Coffee Date ✨)"
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-rose-200 text-sm font-dancing text-lg focus:outline-none focus:ring-2 focus:ring-[#801336]/30 text-center"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  disabled={!previewUrl}
                  onClick={handleAddCustomPhoto}
                  className={`w-full py-3 rounded-full font-playfair font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md ${
                    previewUrl
                      ? 'bg-[#801336] text-white hover:bg-[#9E1B43]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Floating Memories</span>
                </button>

                <button
                  onClick={handleResetToDefault}
                  className="text-xs font-dancing text-[#801336]/70 hover:text-[#801336] underline mt-1"
                >
                  Reset to Curated Default Memories
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingMemoryPhotos;
