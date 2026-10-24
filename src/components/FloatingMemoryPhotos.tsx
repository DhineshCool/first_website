import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { vaultService } from '../services/vaultService';

interface FloatingPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  rotation: number;
  side: 'left' | 'right';
  offset: number; // percentage from side edge (left or right)
  yOffset: number; // percentage from top
  floatDistance: number;
  duration: number;
  showOnMobile?: boolean;
}

const defaultMemories: FloatingPhoto[] = [
  {
    id: 'mem-1',
    imageUrl: '/images/memories/memory_laughter.jpg',
    caption: 'Pure Laughs ✨',
    rotation: -4,
    side: 'left',
    offset: 1.5,
    yOffset: 15,
    floatDistance: 14,
    duration: 6,
    showOnMobile: true,
  },
  {
    id: 'mem-2',
    imageUrl: '/images/memories/memory_sunset.jpg',
    caption: 'Golden Hour 🌅',
    rotation: 4,
    side: 'right',
    offset: 1.5,
    yOffset: 16,
    floatDistance: -15,
    duration: 7,
    showOnMobile: true,
  },
  {
    id: 'mem-3',
    imageUrl: '/images/memories/memory_cafe.jpg',
    caption: 'Cafe Smiles 🍰',
    rotation: -3,
    side: 'left',
    offset: 1,
    yOffset: 48,
    floatDistance: 13,
    duration: 6.5,
    showOnMobile: false,
  },
  {
    id: 'mem-4',
    imageUrl: '/images/memories/memory_roadtrip.jpg',
    caption: 'Bestie Vibes 🚗',
    rotation: 5,
    side: 'right',
    offset: 1,
    yOffset: 47,
    floatDistance: -14,
    duration: 7.5,
    showOnMobile: false,
  },
  {
    id: 'mem-5',
    imageUrl: '/images/memories/memory_picnic.jpg',
    caption: 'Sunny Days 🍓',
    rotation: -5,
    side: 'left',
    offset: 1.8,
    yOffset: 76,
    floatDistance: 12,
    duration: 8,
    showOnMobile: false,
  },
  {
    id: 'mem-6',
    imageUrl: '/images/memories/memory_stargazing.jpg',
    caption: 'Night Talks 🌌',
    rotation: 3,
    side: 'right',
    offset: 1.8,
    yOffset: 75,
    floatDistance: -13,
    duration: 7.2,
    showOnMobile: false,
  },
];

export const FloatingMemoryPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<FloatingPhoto[]>(defaultMemories);

  // Decrypt vault photos on mount
  useEffect(() => {
    let isMounted = true;

    const loadVaultMemories = async () => {
      try {
        const vaultList = await vaultService.init('2710');
        if (vaultList.length >= 6 && isMounted) {
          // Select 6 photos distributed across the collection
          const indices = [1, 14, 28, 45, 62, 85];
          const selected = indices.map((i) => vaultList[i % vaultList.length]);

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
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {photos.map((item, index) => {
        const sideStyle: React.CSSProperties =
          item.side === 'left'
            ? { left: `${item.offset}%`, top: `${item.yOffset}%` }
            : { right: `${item.offset}%`, top: `${item.yOffset}%` };

        return (
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
              opacity: { duration: 0.8, delay: index * 0.12 },
              scale: { duration: 0.8, delay: index * 0.12 },
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
            {/* Scrapbook Mini Polaroid Card */}
            <div className="bg-white/95 p-1.5 sm:p-2 pb-2 sm:pb-2.5 rounded-xl shadow-md border border-rose-100/90 w-20 sm:w-24 lg:w-28 flex flex-col items-center relative opacity-85 hover:opacity-100 transition-opacity">
              {/* Pink Heart Pin at Top Center */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#F49CB4] border border-white shadow-sm flex items-center justify-center">
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
              <span className="font-dancing text-[11px] sm:text-xs font-bold text-[#801336] text-center mt-1 leading-tight truncate max-w-full px-0.5">
                {item.caption}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
