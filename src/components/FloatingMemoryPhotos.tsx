import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { vaultService } from '../services/vaultService';

interface BackgroundPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  rotation: number;
  // Positioning
  anchor: 'left' | 'right';
  xPercent: number; // percentage from side edge
  yPercent: number; // percentage from top edge
  size: 'sm' | 'md' | 'lg';
  opacity: number;
  floatDistance: number;
  duration: number;
  showOnMobile?: boolean;
}

// 22 Distinct ambient background slots with rich, high-visibility opacity and size
const initialSlots: BackgroundPhoto[] = [
  // ================= OUTER LEFT COLUMN (Vibrant side memories) =================
  {
    id: 'bg-ol-1',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Laughter ✨',
    rotation: -4,
    anchor: 'left',
    xPercent: 1.2,
    yPercent: 8,
    size: 'lg',
    opacity: 0.92,
    floatDistance: 14,
    duration: 6.5,
    showOnMobile: true,
  },
  {
    id: 'bg-ol-2',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Bestie Cafe 🍰',
    rotation: 3,
    anchor: 'left',
    xPercent: 1.5,
    yPercent: 28,
    size: 'md',
    opacity: 0.88,
    floatDistance: -12,
    duration: 7.2,
    showOnMobile: false,
  },
  {
    id: 'bg-ol-3',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Sunny Days 🍓',
    rotation: -3,
    anchor: 'left',
    xPercent: 1,
    yPercent: 48,
    size: 'lg',
    opacity: 0.92,
    floatDistance: 14,
    duration: 8,
    showOnMobile: true,
  },
  {
    id: 'bg-ol-4',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Road Trips 🚗',
    rotation: 5,
    anchor: 'left',
    xPercent: 1.8,
    yPercent: 68,
    size: 'md',
    opacity: 0.88,
    floatDistance: -13,
    duration: 6.8,
    showOnMobile: false,
  },
  {
    id: 'bg-ol-5',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Night Talks 🌌',
    rotation: -4,
    anchor: 'left',
    xPercent: 1.2,
    yPercent: 86,
    size: 'lg',
    opacity: 0.92,
    floatDistance: 12,
    duration: 7.5,
    showOnMobile: true,
  },

  // ================= OUTER RIGHT COLUMN (Vibrant side memories) =================
  {
    id: 'bg-or-1',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Golden Hour 🌅',
    rotation: 4,
    anchor: 'right',
    xPercent: 1.2,
    yPercent: 7,
    size: 'lg',
    opacity: 0.92,
    floatDistance: -13,
    duration: 7,
    showOnMobile: true,
  },
  {
    id: 'bg-or-2',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Sweet Vibes 🌸',
    rotation: -3,
    anchor: 'right',
    xPercent: 1.6,
    yPercent: 27,
    size: 'md',
    opacity: 0.88,
    floatDistance: 12,
    duration: 6.6,
    showOnMobile: false,
  },
  {
    id: 'bg-or-3',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Happy Times 💖',
    rotation: 4,
    anchor: 'right',
    xPercent: 1,
    yPercent: 47,
    size: 'lg',
    opacity: 0.92,
    floatDistance: -14,
    duration: 8.2,
    showOnMobile: true,
  },
  {
    id: 'bg-or-4',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Unfiltered 💫',
    rotation: -4,
    anchor: 'right',
    xPercent: 1.8,
    yPercent: 67,
    size: 'md',
    opacity: 0.88,
    floatDistance: 11,
    duration: 7.4,
    showOnMobile: false,
  },
  {
    id: 'bg-or-5',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Memories 🌟',
    rotation: 3,
    anchor: 'right',
    xPercent: 1.2,
    yPercent: 85,
    size: 'lg',
    opacity: 0.92,
    floatDistance: -12,
    duration: 6.9,
    showOnMobile: true,
  },

  // ================= MID-BACKGROUND LEFT (Warm background depth) =================
  {
    id: 'bg-ml-1',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Always ✨',
    rotation: -5,
    anchor: 'left',
    xPercent: 8,
    yPercent: 18,
    size: 'md',
    opacity: 0.78,
    floatDistance: 10,
    duration: 8.5,
    showOnMobile: false,
  },
  {
    id: 'bg-ml-2',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Precious 🍰',
    rotation: 2,
    anchor: 'left',
    xPercent: 8.5,
    yPercent: 38,
    size: 'sm',
    opacity: 0.75,
    floatDistance: -11,
    duration: 9.1,
    showOnMobile: false,
  },
  {
    id: 'bg-ml-3',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Moments 🍓',
    rotation: -3,
    anchor: 'left',
    xPercent: 7.8,
    yPercent: 58,
    size: 'md',
    opacity: 0.78,
    floatDistance: 11,
    duration: 7.8,
    showOnMobile: false,
  },
  {
    id: 'bg-ml-4',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Forever 🌸',
    rotation: 4,
    anchor: 'left',
    xPercent: 8.2,
    yPercent: 78,
    size: 'sm',
    opacity: 0.75,
    floatDistance: -10,
    duration: 8.7,
    showOnMobile: false,
  },

  // ================= MID-BACKGROUND RIGHT (Warm background depth) =================
  {
    id: 'bg-mr-1',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Pure Joy ☀️',
    rotation: 3,
    anchor: 'right',
    xPercent: 8,
    yPercent: 17,
    size: 'md',
    opacity: 0.78,
    floatDistance: -10,
    duration: 8.3,
    showOnMobile: false,
  },
  {
    id: 'bg-mr-2',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Smiles 🌙',
    rotation: -3,
    anchor: 'right',
    xPercent: 8.5,
    yPercent: 37,
    size: 'sm',
    opacity: 0.75,
    floatDistance: 12,
    duration: 7.6,
    showOnMobile: false,
  },
  {
    id: 'bg-mr-3',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Laughter 🚗',
    rotation: 4,
    anchor: 'right',
    xPercent: 7.8,
    yPercent: 57,
    size: 'md',
    opacity: 0.78,
    floatDistance: -11,
    duration: 8.9,
    showOnMobile: false,
  },
  {
    id: 'bg-mr-4',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Best Duo 💖',
    rotation: -2,
    anchor: 'right',
    xPercent: 8.2,
    yPercent: 77,
    size: 'sm',
    opacity: 0.75,
    floatDistance: 10,
    duration: 8.1,
    showOnMobile: false,
  },

  // ================= TOP & BOTTOM AMBIENT DRIFTERS =================
  {
    id: 'bg-tb-1',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Timeless ✨',
    rotation: -2,
    anchor: 'left',
    xPercent: 23,
    yPercent: 3,
    size: 'sm',
    opacity: 0.72,
    floatDistance: 9,
    duration: 9.5,
    showOnMobile: false,
  },
  {
    id: 'bg-tb-2',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Sweet 🍰',
    rotation: 3,
    anchor: 'right',
    xPercent: 23,
    yPercent: 3,
    size: 'sm',
    opacity: 0.72,
    floatDistance: -9,
    duration: 9.8,
    showOnMobile: false,
  },
  {
    id: 'bg-tb-3',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Cherished 🌸',
    rotation: 2,
    anchor: 'left',
    xPercent: 21,
    yPercent: 90,
    size: 'sm',
    opacity: 0.72,
    floatDistance: 8,
    duration: 9.2,
    showOnMobile: false,
  },
  {
    id: 'bg-tb-4',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Hebziba & Dhinesh 💫',
    rotation: -3,
    anchor: 'right',
    xPercent: 21,
    yPercent: 90,
    size: 'sm',
    opacity: 0.72,
    floatDistance: -8,
    duration: 9.6,
    showOnMobile: false,
  },
];

export const FloatingMemoryPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<BackgroundPhoto[]>(initialSlots);

  // Decrypt 22 vault photos on mount
  useEffect(() => {
    let isMounted = true;

    const loadVaultMemories = async () => {
      try {
        const vaultList = await vaultService.init('2710');
        if (vaultList.length > 0 && isMounted) {
          // Select 22 evenly distributed photos across the 110 photos
          const step = Math.max(1, Math.floor(vaultList.length / initialSlots.length));
          const selected = initialSlots.map((_, i) => vaultList[(i * step) % vaultList.length]);

          const decryptedUrls = await Promise.all(
            selected.map((item) =>
              vaultService.getDecryptedUrl(item.file).catch(() => '')
            )
          );

          if (isMounted) {
            setPhotos((prev) =>
              prev.map((item, idx) => ({
                ...item,
                imageUrl: decryptedUrls[idx] || item.imageUrl,
              }))
            );
          }
        }
      } catch (err) {
        console.warn('Vault photo loading in background photos fallback:', err);
      }
    };

    loadVaultMemories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    // STRICT BACKGROUND LAYER: z-0, pointer-events-none, sits behind z-20 content cards
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {photos.map((item, index) => {
        const sideStyle: React.CSSProperties =
          item.anchor === 'left'
            ? { left: `${item.xPercent}%`, top: `${item.yPercent}%` }
            : { right: `${item.xPercent}%`, top: `${item.yPercent}%` };

        // Increased card widths for prominent, clear visibility
        const sizeClasses =
          item.size === 'lg'
            ? 'w-24 sm:w-28 lg:w-32'
            : item.size === 'md'
            ? 'w-22 sm:w-26 lg:w-28'
            : 'w-18 sm:w-22 lg:w-24';

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: item.opacity,
              scale: 1,
              y: [0, item.floatDistance, 0],
              rotate: [item.rotation, item.rotation + 1.5, item.rotation],
            }}
            transition={{
              opacity: { duration: 0.8, delay: (index % 6) * 0.08 },
              scale: { duration: 0.8, delay: (index % 6) * 0.08 },
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
              ...sideStyle,
            }}
            className={`pointer-events-none ${
              item.showOnMobile
                ? 'flex'
                : 'hidden md:flex'
            }`}
          >
            {/* Crisp, beautiful Scrapbook Polaroid Card */}
            <div
              className={`bg-white p-2 pb-2.5 rounded-xl shadow-md border border-rose-200/80 flex flex-col items-center relative transition-transform ${sizeClasses}`}
            >
              {/* Pink Heart Pin at Top Center */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full bg-[#F49CB4] border border-white shadow-xs flex items-center justify-center">
                <Heart className="w-2.5 h-2.5 fill-[#801336] text-[#801336]" />
              </div>

              {/* Square Photo Frame with subtle shadow border */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-rose-50/50 shadow-inner border border-rose-100">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Handwritten Scrapbook Caption */}
              <span className="font-dancing text-xs sm:text-[13px] font-bold text-[#801336] text-center mt-1 leading-tight truncate max-w-full px-0.5">
                {item.caption}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
