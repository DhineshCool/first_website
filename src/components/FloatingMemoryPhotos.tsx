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

// 22 Carefully positioned ambient background slots forming a dreamy scrapbook memory wallpaper
const initialSlots: BackgroundPhoto[] = [
  // ================= OUTER LEFT COLUMN (Edge framing) =================
  {
    id: 'bg-ol-1',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Laughter ✨',
    rotation: -4,
    anchor: 'left',
    xPercent: 1.2,
    yPercent: 8,
    size: 'md',
    opacity: 0.55,
    floatDistance: 12,
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
    opacity: 0.55,
    floatDistance: -10,
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
    size: 'md',
    opacity: 0.55,
    floatDistance: 14,
    duration: 8,
    showOnMobile: false,
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
    opacity: 0.55,
    floatDistance: -12,
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
    size: 'md',
    opacity: 0.55,
    floatDistance: 11,
    duration: 7.5,
    showOnMobile: true,
  },

  // ================= OUTER RIGHT COLUMN (Edge framing) =================
  {
    id: 'bg-or-1',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Golden Hour 🌅',
    rotation: 4,
    anchor: 'right',
    xPercent: 1.2,
    yPercent: 7,
    size: 'md',
    opacity: 0.55,
    floatDistance: -12,
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
    opacity: 0.55,
    floatDistance: 11,
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
    size: 'md',
    opacity: 0.55,
    floatDistance: -13,
    duration: 8.2,
    showOnMobile: false,
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
    opacity: 0.55,
    floatDistance: 10,
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
    size: 'md',
    opacity: 0.55,
    floatDistance: -11,
    duration: 6.9,
    showOnMobile: true,
  },

  // ================= MID-BACKGROUND LEFT (Subtle wallpaper layer) =================
  {
    id: 'bg-ml-1',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Always ✨',
    rotation: -5,
    anchor: 'left',
    xPercent: 8.5,
    yPercent: 18,
    size: 'sm',
    opacity: 0.38,
    floatDistance: 9,
    duration: 8.5,
    showOnMobile: false,
  },
  {
    id: 'bg-ml-2',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Precious 🍰',
    rotation: 2,
    anchor: 'left',
    xPercent: 9,
    yPercent: 38,
    size: 'sm',
    opacity: 0.38,
    floatDistance: -10,
    duration: 9.1,
    showOnMobile: false,
  },
  {
    id: 'bg-ml-3',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Moments 🍓',
    rotation: -3,
    anchor: 'left',
    xPercent: 8,
    yPercent: 58,
    size: 'sm',
    opacity: 0.38,
    floatDistance: 10,
    duration: 7.8,
    showOnMobile: false,
  },
  {
    id: 'bg-ml-4',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Forever 🌸',
    rotation: 4,
    anchor: 'left',
    xPercent: 8.5,
    yPercent: 78,
    size: 'sm',
    opacity: 0.38,
    floatDistance: -9,
    duration: 8.7,
    showOnMobile: false,
  },

  // ================= MID-BACKGROUND RIGHT (Subtle wallpaper layer) =================
  {
    id: 'bg-mr-1',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Pure Joy ☀️',
    rotation: 3,
    anchor: 'right',
    xPercent: 8.5,
    yPercent: 17,
    size: 'sm',
    opacity: 0.38,
    floatDistance: -9,
    duration: 8.3,
    showOnMobile: false,
  },
  {
    id: 'bg-mr-2',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Smiles 🌙',
    rotation: -3,
    anchor: 'right',
    xPercent: 9,
    yPercent: 37,
    size: 'sm',
    opacity: 0.38,
    floatDistance: 11,
    duration: 7.6,
    showOnMobile: false,
  },
  {
    id: 'bg-mr-3',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Laughter 🚗',
    rotation: 4,
    anchor: 'right',
    xPercent: 8,
    yPercent: 57,
    size: 'sm',
    opacity: 0.38,
    floatDistance: -10,
    duration: 8.9,
    showOnMobile: false,
  },
  {
    id: 'bg-mr-4',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Best Duo 💖',
    rotation: -2,
    anchor: 'right',
    xPercent: 8.5,
    yPercent: 77,
    size: 'sm',
    opacity: 0.38,
    floatDistance: 9,
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
    xPercent: 24,
    yPercent: 3,
    size: 'sm',
    opacity: 0.35,
    floatDistance: 8,
    duration: 9.5,
    showOnMobile: false,
  },
  {
    id: 'bg-tb-2',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Sweet 🍰',
    rotation: 3,
    anchor: 'right',
    xPercent: 24,
    yPercent: 3,
    size: 'sm',
    opacity: 0.35,
    floatDistance: -8,
    duration: 9.8,
    showOnMobile: false,
  },
  {
    id: 'bg-tb-3',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Cherished 🌸',
    rotation: 2,
    anchor: 'left',
    xPercent: 22,
    yPercent: 91,
    size: 'sm',
    opacity: 0.35,
    floatDistance: 7,
    duration: 9.2,
    showOnMobile: false,
  },
  {
    id: 'bg-tb-4',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Hebziba & Dhinesh 💫',
    rotation: -3,
    anchor: 'right',
    xPercent: 22,
    yPercent: 91,
    size: 'sm',
    opacity: 0.35,
    floatDistance: -7,
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
    // STRICT BACKGROUND LAYER: z-0, pointer-events-none, never blocks clicks
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {photos.map((item, index) => {
        const sideStyle: React.CSSProperties =
          item.anchor === 'left'
            ? { left: `${item.xPercent}%`, top: `${item.yPercent}%` }
            : { right: `${item.xPercent}%`, top: `${item.yPercent}%` };

        // Card width based on slot size
        const sizeClasses =
          item.size === 'sm'
            ? 'w-16 sm:w-20'
            : 'w-20 sm:w-24 lg:w-26';

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
              opacity: { duration: 1, delay: (index % 6) * 0.1 },
              scale: { duration: 1, delay: (index % 6) * 0.1 },
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
            {/* Scrapbook Mini Polaroid Card with Authentic Warm Parchment Feel */}
            <div
              className={`bg-white/90 p-1.5 pb-2 rounded-xl shadow-sm border border-rose-100/70 flex flex-col items-center relative transition-opacity ${sizeClasses}`}
            >
              {/* Pink Heart Pin at Top Center */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F49CB4] border border-white shadow-xs flex items-center justify-center">
                <Heart className="w-1.5 h-1.5 sm:w-2 sm:h-2 fill-[#801336] text-[#801336]" />
              </div>

              {/* Square Photo Frame */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-rose-50/40 shadow-inner">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Handwritten Scrapbook Caption */}
              <span className="font-dancing text-[10px] sm:text-[11px] font-bold text-[#801336]/80 text-center mt-0.5 leading-tight truncate max-w-full px-0.5">
                {item.caption}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
