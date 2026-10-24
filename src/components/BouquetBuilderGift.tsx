import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Check, ArrowLeft, Flower2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CuratedBouquet {
  id: string;
  title: string;
  tag: string;
  flowers: string;
  meaning: string;
  description: string;
  image: string;
  accentColor: string;
  bgBadge: string;
}

const curatedBouquets: CuratedBouquet[] = [
  {
    id: 'grand-22',
    title: 'The Grand 22 Celebration',
    tag: 'Birthday Special 🎂',
    flowers: 'Velvet Roses, Sunflowers, White Lilies & Baby’s Breath',
    meaning: 'A grand celebration for 22 wonderful years of life, laughter, and unbreakable friendship.',
    description: 'The ultimate luxury mixed florist showstopper hand-crafted specially for Hebziba’s 22nd milestone!',
    image: '/images/flowers/bouquet_grand_celebration.jpg',
    accentColor: '#801336',
    bgBadge: '#FCE4EC',
  },
  {
    id: 'velvet-roses',
    title: 'The Classic Velvet Roses',
    tag: 'Unmatched Loyalty 🌹',
    flowers: 'Deep Crimson Velvet Roses & Silver Dollar Eucalyptus',
    meaning: 'Unwavering support, deep loyalty, and always having each other’s back through thick and thin.',
    description: 'Rich red roses wrapped in Korean rustic kraft paper and tied with a satin maroon ribbon.',
    image: '/images/flowers/bouquet_red_roses.jpg',
    accentColor: '#801336',
    bgBadge: '#FFE4E6',
  },
  {
    id: 'sunshine-smiles',
    title: 'Golden Sunshine & Smiles',
    tag: 'Pure Joy & Laughter 🌻',
    flowers: 'Fresh Golden Sunflowers, Chamomile Daisies & Gypsophila',
    meaning: 'Radiant energy, contagious laughs, and always making the gloomiest days feel sunny and warm.',
    description: 'Bright golden blooms capturing the unstoppable sunshine and spontaneous laughter you bring.',
    image: '/images/flowers/bouquet_sunflowers.jpg',
    accentColor: '#B45309',
    bgBadge: '#FEF3C7',
  },
  {
    id: 'blush-peonies',
    title: 'Blush Sweetheart Peonies',
    tag: 'Sweetest Friendship 🌸',
    flowers: 'Fluffy Pink Peonies, French Blush Tulips & Waxflowers',
    meaning: 'Soft comfort, endless inside jokes, and the warmest, tightest bestie hugs whenever needed.',
    description: 'Dreamy pastel blooms wrapped in Korean layered blush pink paper with a delicate rose silk bow.',
    image: '/images/flowers/bouquet_pink_peonies.jpg',
    accentColor: '#BE185D',
    bgBadge: '#FDF2F8',
  },
  {
    id: 'white-lilies',
    title: 'Elegance & Pure Serenity',
    tag: 'Grace & Truth 🪷',
    flowers: 'Royal White Oriental Lilies, Baby’s Breath & Salal Greenery',
    meaning: 'Unfiltered honesty, peace of mind, and a trusted friendship that lasts forever.',
    description: 'Pristine white blooms wrapped in frosted ivory linen paper with a shimmering white silk bow.',
    image: '/images/flowers/bouquet_white_lilies.jpg',
    accentColor: '#334155',
    bgBadge: '#F1F5F9',
  },
  {
    id: 'french-lavender',
    title: 'French Lavender Dreams',
    tag: 'Calm & Cozy Vibes 🪻',
    flowers: 'Purple Provence Lavender, Hydrangeas & Wild Chamomile',
    meaning: 'Late night heart-to-hearts, gentle peace, and soothing soul talks over warm coffee.',
    description: 'Fragrant purple sprigs wrapped in soft dusty lilac paper with vintage lavender satin ribbon.',
    image: '/images/flowers/bouquet_lavender.jpg',
    accentColor: '#7E22CE',
    bgBadge: '#F3E8FF',
  },
];

export const BouquetBuilderGift: React.FC = () => {
  const [selectedBouquet, setSelectedBouquet] = useState<CuratedBouquet>(curatedBouquets[0]);
  const [step, setStep] = useState<'GALLERY' | 'PRESENTED'>('GALLERY');

  const handleSelectBouquet = (b: CuratedBouquet) => {
    setSelectedBouquet(b);
    setStep('PRESENTED');

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#801336', '#F49CB4', '#F59E0B', '#FFFDF9'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const bestieCompliments = [
    "You're my favorite notification",
    'Partner in crime forever',
    'My happiest place',
    'Forever my bestie',
    'You make every day brighter',
    'Lucky to have you in my life',
    'Best friend today & always',
  ];

  return (
    <div className="w-full flex flex-col items-center py-2 sm:py-3 select-none relative z-20">
      <AnimatePresence mode="wait">
        {step === 'GALLERY' ? (
          /* ================= VIEW 1: 6 CURATED BOUQUETS MENU ================= */
          <motion.div
            key="gallery"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(5px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(5px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl flex flex-col items-center text-center"
          >
            {/* Washi Tape Header Badge */}
            <div className="mb-2 px-4 py-1 bg-[#FFF8E7] rounded shadow-sm border border-amber-200/60 inline-flex items-center gap-2 transform -rotate-1">
              <Sparkles className="w-3.5 h-3.5 text-[#801336]" />
              <span className="font-dancing text-base sm:text-lg font-bold text-[#801336]">
                Hebziba's 22nd Birthday • Fresh Florist Collection 💐
              </span>
              <Heart className="w-3.5 h-3.5 fill-[#F49CB4] text-[#801336]" />
            </div>

            {/* Title */}
            <h2 className="font-playfair text-2xl sm:text-4xl font-extrabold text-[#801336] tracking-tight mb-1">
              Pick a Bouquet for My Bestie
            </h2>
            <p className="font-dancing text-xs sm:text-sm text-[#801336]/80 max-w-2xl mb-4">
              "6 hand-arranged florist bouquets, each carrying a special message and meaning for you"
            </p>

            {/* 6 Bouquets Responsive Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5 w-full px-2 items-stretch">
              {curatedBouquets.map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => handleSelectBouquet(b)}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 shadow-xl border-2 border-white ring-1 ring-rose-200/80 flex flex-col items-center justify-between text-center cursor-pointer group relative overflow-hidden transition-all hover:border-[#801336]/40 hover:shadow-2xl h-full"
                >
                  {/* Tape decoration at top */}
                  <div className="absolute top-2.5 left-3 transform -rotate-6 bg-[#FFF8E7] px-2.5 py-0.5 rounded shadow-sm border border-amber-200/50 text-[9px] font-dancing font-bold text-[#801336] z-10">
                    hand-tied ✨
                  </div>

                  {/* Photo Container */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-rose-50/50 mb-2 relative shadow-inner">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    {/* Tag badge overlay */}
                    <div
                      className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-playfair font-bold shadow-md border"
                      style={{ backgroundColor: b.bgBadge, color: b.accentColor, borderColor: b.accentColor + '30' }}
                    >
                      {b.tag}
                    </div>
                  </div>

                  {/* Bouquet Title */}
                  <div className="min-h-[24px] flex items-center justify-center mb-0.5 w-full">
                    <h3 className="font-playfair text-base sm:text-lg font-bold text-[#801336] group-hover:text-[#9E1B43] transition-colors leading-tight">
                      {b.title}
                    </h3>
                  </div>

                  {/* Flowers list */}
                  <div className="min-h-[18px] flex items-center justify-center mb-1 w-full">
                    <p className="text-[11px] font-semibold text-[#801336]/75 line-clamp-1">
                      {b.flowers}
                    </p>
                  </div>

                  {/* Meaning */}
                  <div className="min-h-[38px] flex items-center justify-center mb-2 w-full">
                    <p className="font-dancing text-xs sm:text-sm text-slate-700 leading-snug line-clamp-2">
                      "{b.meaning}"
                    </p>
                  </div>

                  {/* Select CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectBouquet(b);
                    }}
                    className="animate-shimmer w-full py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#801336] via-[#9E1B43] to-[#801336] text-[#FAF6F0] font-playfair font-bold text-[11px] sm:text-xs tracking-wider shadow-pill-maroon hover:shadow-lg transition-all flex items-center justify-center gap-1 mt-auto border border-rose-300/30 cursor-pointer"
                  >
                    <Flower2 className="w-3 h-3 text-[#F49CB4] animate-spin-slow" />
                    <span>Present to Hebziba 💖</span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ================= VIEW 2: PRESENTED SPOTLIGHT VIEW ================= */
          <motion.div
            key="presented"
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl flex flex-col items-center"
          >
            {/* Header Title */}
            <div className="text-center mb-3">
              <span className="font-dancing text-lg sm:text-xl text-[#801336] block mb-0.5">
                A Floral Tribute for My Best Friend
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#801336] tracking-tight">
                Gifted to Hebziba with Love!
              </h2>
            </div>

            {/* 3-Column Display: Left Panda, Center Chosen Bouquet, Right 7 Bestie Compliments */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 w-full items-center justify-center">
              {/* Left Column: Dhinesh Delivering Blooms Photo Card (3 cols) */}
              <div className="lg:col-span-3 flex flex-col items-center text-center order-2 lg:order-1 bg-white/95 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 shadow-xl border-2 border-white ring-1 ring-rose-200/80">
                <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden shadow-md border-2 border-rose-100 bg-rose-50/50 mb-2 group">
                  <img
                    src="/images/custom/dhinesh_plushie.jpg"
                    alt="Dhinesh holding cute plushie"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                  {/* Subtle cute sticker overlay */}
                  <div className="absolute top-1.5 right-1.5 bg-[#FFF8E7] px-1.5 py-0.5 rounded shadow text-[9px] font-dancing font-bold text-[#801336] border border-amber-200/50">
                    bestie 💖
                  </div>
                </div>
                <h4 className="font-playfair text-base font-bold text-[#801336]">
                  Forever Besties
                </h4>
                <p className="font-dancing text-base text-[#801336] font-bold mt-0.5">
                  "Handpicked by Dhinesh for Hebziba!"
                </p>
                <div className="mt-2 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-semibold text-[#801336] inline-flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Delivered by Dhinesh ✨</span>
                </div>
              </div>

              {/* Center Column: Large Selected Bouquet Polaroid (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-white ring-1 ring-rose-200/80 order-1 lg:order-2">
                {/* Polaroid Frame */}
                <div className="relative p-2.5 bg-white rounded-xl shadow-md border border-rose-100 w-full max-w-[270px]">
                  {/* Decorative Washi Tape */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FFF8E7] px-3 py-0.5 rounded shadow-sm border border-amber-200/50 text-[10px] font-dancing font-bold text-[#801336] z-10">
                    Handpicked with Love 💖
                  </div>

                  <div className="overflow-hidden rounded-lg aspect-square bg-rose-50/50 shadow-inner">
                    <img
                      src={selectedBouquet.image}
                      alt={selectedBouquet.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title & Tag */}
                  <div className="pt-2 text-center">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-playfair font-bold shadow-sm mb-1"
                      style={{ backgroundColor: selectedBouquet.bgBadge, color: selectedBouquet.accentColor }}
                    >
                      {selectedBouquet.tag}
                    </span>
                    <h3 className="font-playfair text-lg sm:text-xl font-extrabold text-[#801336]">
                      {selectedBouquet.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#801336]/80 mt-0.5">
                      {selectedBouquet.flowers}
                    </p>
                  </div>
                </div>

                {/* Bouquet Dedication Plaque */}
                <div className="mt-3 text-center px-3 py-2 bg-[#FAF6F0] rounded-xl border border-[#801336]/15 w-full">
                  <p className="font-dancing text-xs sm:text-sm text-slate-800 leading-snug">
                    "{selectedBouquet.meaning}"
                  </p>
                  <span className="font-dancing text-xs text-[#801336] font-bold block mt-1">
                    Hand-tied with love for my bestie • Celebrating her 22nd Birthday ✨
                  </span>
                </div>
              </div>

              {/* Right Column: 7 Floating Bestie Compliment Pills (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-1.5 order-3">
                {bestieCompliments.map((compliment, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[#801336] shadow-md border-2 border-white ring-1 ring-rose-200/80 font-dancing text-xs sm:text-sm font-bold cursor-default hover:bg-[#FCE4EC] transition-colors"
                  >
                    <Heart className="w-3 h-3 fill-[#801336] text-[#801336] flex-shrink-0" />
                    <span className="leading-tight">{compliment}</span>
                    <Sparkles className="w-2.5 h-2.5 text-[#F59E0B] ml-auto flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Back to 6 Bouquets Gallery Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setStep('GALLERY')}
                className="px-6 py-2 rounded-full bg-white text-[#801336] border border-[#801336]/40 font-playfair font-bold text-xs tracking-wider shadow-sm hover:bg-rose-50 active:scale-95 flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Browse All 6 Bouquets</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BouquetBuilderGift;
