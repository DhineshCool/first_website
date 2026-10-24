import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { vaultService, VaultPhoto } from '../services/vaultService';

interface BackgroundPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  rotation: number;
  anchor: 'left' | 'right';
  xPercent: number; // percentage from side edge
  yPercent: number; // percentage from top edge
  size: 'sm' | 'md' | 'lg';
  opacity: number;
  floatDistance: number;
  duration: number;
  showOnMobile?: boolean;
}

const bestieCaptions = [
  'Laughter ✨',
  'Golden Hour 🌅',
  'Bestie Cafe 🍰',
  'Sunny Days 🍓',
  'Road Trips 🚗',
  'Night Talks 🌌',
  'Sweet Vibes 🌸',
  'Happy Times 💖',
  'Unfiltered 💫',
  'Memories 🌟',
  'Pure Joy ☀️',
  'Timeless ✨',
  'Best Duo 💖',
  'Forever Besties 🌸',
  'Inside Jokes 💫',
  'Adventures 🚗',
  'Cherished 🌸',
  'Through Everything 💖',
  'Always Smiling 🍓',
  'Hebziba & Dhinesh 🌟',
  'Precious Days 🌅',
  'Unforgettable 🍰',
];

// 18 Non-overlapping ambient background slots structured in staggered dual side columns + top/bottom framing
const initialSlots: BackgroundPhoto[] = [
  // ================= OUTER LEFT COLUMN (Crisp, fully vivid edge rail) =================
  {
    id: 'bg-ol-1',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Laughter ✨',
    rotation: -3,
    anchor: 'left',
    xPercent: 1.0,
    yPercent: 5,
    size: 'lg',
    opacity: 1.0,
    floatDistance: 10,
    duration: 7.2,
    showOnMobile: true,
  },
  {
    id: 'bg-ol-2',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Bestie Cafe 🍰',
    rotation: 3,
    anchor: 'left',
    xPercent: 1.2,
    yPercent: 31,
    size: 'md',
    opacity: 0.98,
    floatDistance: -9,
    duration: 6.8,
    showOnMobile: false,
  },
  {
    id: 'bg-ol-3',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Sunny Days 🍓',
    rotation: -2,
    anchor: 'left',
    xPercent: 1.0,
    yPercent: 57,
    size: 'lg',
    opacity: 1.0,
    floatDistance: 10,
    duration: 7.5,
    showOnMobile: false,
  },
  {
    id: 'bg-ol-4',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Road Trips 🚗',
    rotation: 4,
    anchor: 'left',
    xPercent: 1.2,
    yPercent: 83,
    size: 'md',
    opacity: 0.98,
    floatDistance: -8,
    duration: 7.0,
    showOnMobile: true,
  },

  // ================= INNER LEFT COLUMN (Stepped inward with zero overlap) =================
  {
    id: 'bg-ml-1',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Always ✨',
    rotation: -4,
    anchor: 'left',
    xPercent: 11.5,
    yPercent: 18,
    size: 'md',
    opacity: 0.94,
    floatDistance: 9,
    duration: 8.2,
    showOnMobile: false,
  },
  {
    id: 'bg-ml-2',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Precious 🍰',
    rotation: 2,
    anchor: 'left',
    xPercent: 11.2,
    yPercent: 44,
    size: 'sm',
    opacity: 0.92,
    floatDistance: -8,
    duration: 8.8,
    showOnMobile: false,
  },
  {
    id: 'bg-ml-3',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Moments 🍓',
    rotation: -3,
    anchor: 'left',
    xPercent: 11.5,
    yPercent: 70,
    size: 'md',
    opacity: 0.94,
    floatDistance: 8,
    duration: 8.0,
    showOnMobile: false,
  },

  // ================= OUTER RIGHT COLUMN (Crisp, fully vivid edge rail) =================
  {
    id: 'bg-or-1',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Golden Hour 🌅',
    rotation: 3,
    anchor: 'right',
    xPercent: 1.0,
    yPercent: 5,
    size: 'lg',
    opacity: 1.0,
    floatDistance: -10,
    duration: 7.0,
    showOnMobile: true,
  },
  {
    id: 'bg-or-2',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Sweet Vibes 🌸',
    rotation: -3,
    anchor: 'right',
    xPercent: 1.2,
    yPercent: 31,
    size: 'md',
    opacity: 0.98,
    floatDistance: 9,
    duration: 6.9,
    showOnMobile: false,
  },
  {
    id: 'bg-or-3',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Happy Times 💖',
    rotation: 2,
    anchor: 'right',
    xPercent: 1.0,
    yPercent: 57,
    size: 'lg',
    opacity: 1.0,
    floatDistance: -10,
    duration: 7.6,
    showOnMobile: false,
  },
  {
    id: 'bg-or-4',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Unfiltered 💫',
    rotation: -4,
    anchor: 'right',
    xPercent: 1.2,
    yPercent: 83,
    size: 'md',
    opacity: 0.98,
    floatDistance: 8,
    duration: 7.1,
    showOnMobile: true,
  },

  // ================= INNER RIGHT COLUMN (Stepped inward with zero overlap) =================
  {
    id: 'bg-mr-1',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Best Duo 💖',
    rotation: 4,
    anchor: 'right',
    xPercent: 11.5,
    yPercent: 18,
    size: 'md',
    opacity: 0.94,
    floatDistance: -9,
    duration: 8.4,
    showOnMobile: false,
  },
  {
    id: 'bg-mr-2',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Smiles 🌙',
    rotation: -2,
    anchor: 'right',
    xPercent: 11.2,
    yPercent: 44,
    size: 'sm',
    opacity: 0.92,
    floatDistance: 8,
    duration: 8.6,
    showOnMobile: false,
  },
  {
    id: 'bg-mr-3',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Forever 🌸',
    rotation: 3,
    anchor: 'right',
    xPercent: 11.5,
    yPercent: 70,
    size: 'md',
    opacity: 0.94,
    floatDistance: -8,
    duration: 7.9,
    showOnMobile: false,
  },

  // ================= TOP & BOTTOM AMBIENT DRIFTERS (Framing top title and bottom cards) =================
  {
    id: 'bg-tb-1',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Timeless ✨',
    rotation: -2,
    anchor: 'left',
    xPercent: 23,
    yPercent: 2.5,
    size: 'sm',
    opacity: 0.90,
    floatDistance: 7,
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
    yPercent: 2.5,
    size: 'sm',
    opacity: 0.90,
    floatDistance: -7,
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
    yPercent: 91,
    size: 'sm',
    opacity: 0.90,
    floatDistance: 6,
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
    yPercent: 91,
    size: 'sm',
    opacity: 0.90,
    floatDistance: -6,
    duration: 9.6,
    showOnMobile: false,
  },
];

interface FloatingMemoryPhotosProps {
  isBlurred?: boolean;
}

export const FloatingMemoryPhotos: React.FC<FloatingMemoryPhotosProps> = ({ isBlurred = false }) => {
  const [photos, setPhotos] = useState<BackgroundPhoto[]>(initialSlots);
  const vaultListRef = useRef<VaultPhoto[]>([]);

  // Function to pick and decrypt a random set of photos from the 110 vault photos
  const randomizePhotos = useCallback(async () => {
    const list = vaultListRef.current;
    if (!list || list.length === 0) return;

    // Pick 22 randomized photos without duplicates
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const selected = initialSlots.map((_, i) => shuffled[i % shuffled.length]);

    const decryptedUrls = await Promise.all(
      selected.map((item) =>
        vaultService.getDecryptedUrl(item.file).catch(() => '')
      )
    );

    setPhotos((prev) =>
      prev.map((item, idx) => ({
        ...item,
        imageUrl: decryptedUrls[idx] || item.imageUrl,
        caption: bestieCaptions[(idx + Math.floor(Math.random() * bestieCaptions.length)) % bestieCaptions.length],
        // Subtle organic angle jitter on each shuffle
        rotation: item.rotation + (Math.random() * 2 - 1),
      }))
    );
  }, []);

  // Initialize vault and cycle random photos every 15 seconds
  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      try {
        const vaultList = await vaultService.init('2710');
        if (isMounted && vaultList && vaultList.length > 0) {
          vaultListRef.current = vaultList;
          await randomizePhotos();
        }
      } catch (err) {
        console.warn('Vault photo setup error:', err);
      }
    };

    setup();

    // 15-second timer to randomize background photos
    const intervalId = setInterval(() => {
      if (isMounted) {
        randomizePhotos();
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [randomizePhotos]);

  return (
    // STRICT BACKGROUND LAYER: z-0, pointer-events-none, sits behind z-20 content cards
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {photos.map((item, index) => {
        const sideStyle: React.CSSProperties =
          item.anchor === 'left'
            ? { left: `${item.xPercent}%`, top: `${item.yPercent}%` }
            : { right: `${item.xPercent}%`, top: `${item.yPercent}%` };

        // Enlarged polaroid widths for prominent, clear visibility without overlapping
        const sizeClasses =
          item.size === 'lg'
            ? 'w-25 sm:w-28 lg:w-30'
            : item.size === 'md'
            ? 'w-21 sm:w-24 lg:w-26'
            : 'w-18 sm:w-20 lg:w-22';

        // Stagger ripple delay based on card position
        const rippleDelay = (index % 8) * 0.07;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isBlurred ? item.opacity * 0.45 : item.opacity,
              scale: 1,
              y: [0, item.floatDistance, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: (index % 6) * 0.08 },
              scale: { duration: 0.8, delay: (index % 6) * 0.08 },
              y: {
                repeat: Infinity,
                duration: item.duration,
                ease: 'easeInOut',
              },
            }}
            style={{
              position: 'absolute',
              ...sideStyle,
            }}
            className={`pointer-events-none ${
              item.showOnMobile ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Crisp, solid white Scrapbook 3D Polaroid Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={item.imageUrl}
                initial={{
                  opacity: 0,
                  scale: 0.88,
                  rotateY: 38,
                  rotateZ: item.rotation - 3,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateY: 0,
                  rotateZ: item.rotation,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.88,
                  rotateY: -38,
                  rotateZ: item.rotation + 3,
                }}
                transition={{
                  type: 'spring',
                  damping: 18,
                  stiffness: 220,
                  delay: rippleDelay,
                }}
                style={{
                  transformPerspective: 900,
                  transformStyle: 'preserve-3d',
                }}
                className={`${
                  isBlurred
                    ? 'bg-white/70 filter blur-[2.5px] sm:blur-[3.5px] border border-rose-200/40 shadow-sm'
                    : 'bg-white filter-none border-2 border-rose-200/90 shadow-lg'
                } p-2.5 pb-3 rounded-2xl flex flex-col items-center relative transition-all duration-500 ${sizeClasses}`}
              >
                {/* Pink Heart Pin with subtle landing bounce */}
                <motion.div
                  initial={{ scale: 0.5, y: -4 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 14,
                    delay: rippleDelay + 0.15,
                  }}
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-[#F49CB4] border-2 border-white shadow-sm flex items-center justify-center"
                >
                  <Heart className="w-2.5 h-2.5 fill-[#801336] text-[#801336]" />
                </motion.div>

                {/* Photo Frame with Vintage Film Exposure Developing Bloom */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-rose-50/50 shadow-inner border border-rose-200/80 relative">
                  <motion.img
                    src={item.imageUrl}
                    alt={item.caption}
                    initial={{
                      filter: 'brightness(1.2) contrast(0.95)',
                      scale: 1.05,
                    }}
                    animate={{
                      filter: 'brightness(1) contrast(1)',
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeOut',
                      delay: rippleDelay + 0.1,
                    }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Handwritten Scrapbook Caption with gentle fade-up */}
                <motion.span
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: rippleDelay + 0.2,
                  }}
                  className="font-dancing text-xs sm:text-sm font-bold text-[#801336] text-center mt-1 leading-tight truncate max-w-full px-0.5"
                >
                  {item.caption}
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
