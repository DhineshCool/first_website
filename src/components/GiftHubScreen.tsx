import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Flower2, Mail, Sparkles, Heart, BookOpen, Images } from 'lucide-react';
import { MemoryAlbumModal } from './MemoryAlbumModal';

interface GiftHubScreenProps {
  onSelectMusic: () => void;
  onSelectBouquet: () => void;
  onSelectLetter: () => void;
}

export const GiftHubScreen: React.FC<GiftHubScreenProps> = ({
  onSelectMusic,
  onSelectBouquet,
  onSelectLetter,
}) => {
  const [showAlbum, setShowAlbum] = useState(false);
  const gifts = [
    {
      id: 'music',
      title: 'Our Melody',
      subtitle: 'A sweet song dedicated to you',
      icon: Music,
      action: onSelectMusic,
      tag: 'tap to listen 🎵',
      renderGraphic: () => (
        /* Pink Envelope with Heart Seal SVG */
        <svg viewBox="0 0 160 140" className="w-28 sm:w-32 h-auto drop-shadow-md">
          {/* Back flap */}
          <rect x="15" y="30" width="130" height="90" rx="8" fill="#FCE4EC" stroke="#F49CB4" strokeWidth="2" />
          {/* Envelope fold shadows */}
          <polygon points="15,120 80,75 145,120" fill="#F8BBD0" opacity="0.9" />
          <polygon points="15,30 80,85 15,120" fill="#F49CB4" opacity="0.8" />
          <polygon points="145,30 80,85 145,120" fill="#F49CB4" opacity="0.85" />
          {/* Top Flap */}
          <polygon points="15,30 80,80 145,30" fill="#FCE4EC" stroke="#F49CB4" strokeWidth="1.5" />
          {/* Crimson Heart Seal */}
          <g transform="translate(80, 80) scale(0.9)">
            <path
              d="M0 -12 C-15 -30 -35 -10 -35 10 C-35 30 0 50 0 60 C0 50 35 30 35 10 C35 -10 15 -30 0 -12 Z"
              fill="#801336"
              className="filter drop-shadow-sm"
            />
            <Music className="w-3.5 h-3.5 text-white" x="-7" y="10" />
          </g>
        </svg>
      ),
    },
    {
      id: 'bouquet',
      title: 'Floral Bloom',
      subtitle: 'Hand-picked flowers for Hebziba',
      icon: Flower2,
      action: onSelectBouquet,
      tag: 'pick your blooms 🌸',
      renderGraphic: () => (
        /* Rose Bouquet Illustration SVG */
        <svg viewBox="0 0 160 140" className="w-28 sm:w-32 h-auto drop-shadow-md">
          {/* Paper Wrap Cone */}
          <polygon points="40,65 120,65 80,130" fill="#E8D8C8" stroke="#D4B996" strokeWidth="1.5" />
          <polygon points="45,65 80,128 75,65" fill="#D4B996" opacity="0.4" />
          {/* Maroon Ribbon Tie */}
          <rect x="70" y="95" width="20" height="6" rx="2" fill="#801336" />
          <path d="M72 101 Q62 115 58 122 M88 101 Q98 115 102 122" stroke="#801336" strokeWidth="2.5" strokeLinecap="round" />

          {/* Greenery / Leaves */}
          <path d="M40 50 Q30 30 50 35 Q55 50 40 50 Z" fill="#4A6B53" />
          <path d="M120 50 Q130 30 110 35 Q105 50 120 50 Z" fill="#4A6B53" />

          {/* Roses Cluster */}
          {/* Left Rose */}
          <circle cx="55" cy="45" r="15" fill="#F49CB4" />
          <path d="M55 35 C50 40 50 50 60 50 C65 45 65 35 55 35 Z" fill="#801336" />
          {/* Center Main Rose */}
          <circle cx="80" cy="38" r="18" fill="#801336" />
          <circle cx="80" cy="38" r="12" fill="#9E1B43" />
          <circle cx="80" cy="38" r="6" fill="#F49CB4" />
          {/* Right Rose */}
          <circle cx="105" cy="45" r="15" fill="#F49CB4" />
          <path d="M105 35 C110 40 110 50 100 50 C95 45 95 35 105 35 Z" fill="#801336" />
          {/* Baby's breath sprinkles */}
          <circle cx="70" cy="22" r="3" fill="#FFFDF9" />
          <circle cx="90" cy="20" r="3" fill="#FFFDF9" />
          <circle cx="42" cy="38" r="2.5" fill="#FFFDF9" />
          <circle cx="118" cy="38" r="2.5" fill="#FFFDF9" />
        </svg>
      ),
    },
    {
      id: 'letter',
      title: 'Bestie Epistle',
      subtitle: 'Memories and heartfelt words for my bestie',
      icon: Mail,
      action: onSelectLetter,
      tag: 'read my letter 💌',
      renderGraphic: () => (
        /* Pink Gift Box with Yellow Ribbon SVG */
        <svg viewBox="0 0 160 140" className="w-28 sm:w-32 h-auto drop-shadow-md">
          {/* Box Body */}
          <rect x="35" y="55" width="90" height="65" rx="6" fill="#F49CB4" stroke="#801336" strokeWidth="2" />
          {/* Box Lid */}
          <rect x="30" y="45" width="100" height="15" rx="4" fill="#FCE4EC" stroke="#801336" strokeWidth="2" />

          {/* Yellow Golden Ribbon Vertical */}
          <rect x="74" y="45" width="12" height="75" fill="#FBBF24" />
          {/* Yellow Golden Ribbon Horizontal */}
          <rect x="35" y="80" width="90" height="10" fill="#FBBF24" />

          {/* Yellow Ribbon Bow on Top */}
          <g transform="translate(80, 44)">
            {/* Left Bow Loop */}
            <path d="M0 0 C-20 -20 -30 -5 -5 0 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            {/* Right Bow Loop */}
            <path d="M0 0 C20 -20 30 -5 5 0 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            {/* Center knot */}
            <circle cx="0" cy="0" r="5" fill="#FCD34D" />
            {/* Ribbon Tails */}
            <path d="M-3 3 L-12 18 L-5 16 L-2 18 Z" fill="#F59E0B" />
            <path d="M3 3 L12 18 L5 16 L2 18 Z" fill="#F59E0B" />
          </g>

          {/* Sparkles around gift */}
          <circle cx="28" cy="40" r="2" fill="#F59E0B" />
          <circle cx="132" cy="42" r="2.5" fill="#F59E0B" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col items-center py-8 select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="font-dancing text-2xl text-[#801336] block mb-1">
          Special surprises prepared for my best friend
        </span>
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#801336] tracking-tight">
          Choose Your Gifts!
        </h1>
        <p className="font-dancing text-xl text-[#801336]/80 mt-2">
          "Celebrating our laughter, inside jokes, and bond as besties"
        </p>
      </motion.div>

      {/* 3 Interactive Gift Cards in Horizontal Row with hover bounce */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl relative z-20 items-stretch">
        {gifts.map((gift, idx) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={gift.action}
            className="bg-white rounded-3xl p-6 sm:p-7 shadow-scrapbook-card border border-rose-100 flex flex-col items-center justify-between cursor-pointer group hover:border-[#801336]/40 transition-all duration-300 relative z-20 overflow-hidden h-full"
          >
            {/* Taped label on top corner */}
            <div className="absolute top-3 right-3 bg-[#FFF8E7] px-2.5 py-0.5 rounded shadow-sm border border-amber-200/50 text-[10px] font-dancing font-bold text-[#801336]">
              {gift.tag}
            </div>

            {/* Illustration Container with pulse/hover wiggle */}
            <div className="w-full h-36 flex items-center justify-center my-2 group-hover:scale-108 transition-transform duration-300">
              {gift.renderGraphic()}
            </div>

            {/* Text Information */}
            <div className="text-center w-full my-2">
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#801336] group-hover:text-[#9E1B43] transition-colors">
                {gift.title}
              </h3>
              <div className="min-h-[38px] flex items-center justify-center mt-1">
                <p className="font-jakarta text-xs text-[#801336]/75 line-clamp-2">
                  {gift.subtitle}
                </p>
              </div>
            </div>

            {/* Bottom Open Pill */}
            <div className="mt-4 w-full">
              <div className="w-full py-2.5 rounded-full bg-[#FAF6F0] group-hover:bg-[#801336] text-[#801336] group-hover:text-[#FAF6F0] border border-[#801336]/20 font-playfair font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPEN GIFT</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special Scrapbook Memory Album Banner */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setShowAlbum(true)}
        className="mt-8 w-full max-w-4xl bg-gradient-to-r from-[#FFF8E7] via-white to-[#FDE8EF] rounded-3xl p-5 sm:p-6 shadow-scrapbook-card border-2 border-[#801336]/20 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-[#801336]/50 hover:shadow-xl transition-all duration-300 relative z-20 overflow-hidden group text-center sm:text-left"
      >
        {/* Taped label */}
        <div className="absolute top-2.5 right-4 bg-[#F49CB4] text-[#801336] px-3 py-0.5 rounded-full text-[11px] font-dancing font-bold shadow-sm">
          ✨ 110 Memories Vault
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-[#801336] text-white flex items-center justify-center shrink-0 shadow-md group-hover:rotate-6 transition-transform">
            <Images className="w-7 h-7 text-[#F49CB4]" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#801336]">
                Our Bestie Memory Album 📖
              </h3>
            </div>
            <p className="font-dancing text-base sm:text-lg text-[#801336]/80 mt-0.5">
              Flip through all 110 unforgettable moments & laughs with Hebziba
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-xs tracking-wider shadow-sm group-hover:bg-[#9E1B43] transition-colors">
          <BookOpen className="w-4 h-4 text-[#F49CB4]" />
          <span>OPEN SCRAPBOOK</span>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center gap-2 text-xs text-[#801336]/70">
        <Heart className="w-3.5 h-3.5 fill-[#801336] text-[#801336]" />
        <span>Explore your gifts and relive every memory!</span>
      </div>

      {/* Memory Album Modal */}
      <MemoryAlbumModal isOpen={showAlbum} onClose={() => setShowAlbum(false)} />
    </div>
  );
};
