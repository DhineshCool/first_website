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
    <div className="w-full flex flex-col items-center py-6 select-none">
      <AnimatePresence mode="wait">
        {step === 'GALLERY' ? (
          /* ================= VIEW 1: 6 CURATED BOUQUETS MENU ================= */
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl flex flex-col items-center text-center"
          >
            {/* Washi Tape Header Badge */}
            <div className="mb-4 px-6 py-1.5 bg-[#FFF8E7] rounded shadow-sm border border-amber-200/60 inline-flex items-center gap-2 transform -rotate-1">
              <Sparkles className="w-4 h-4 text-[#801336]" />
              <span className="font-dancing text-xl sm:text-2xl font-bold text-[#801336]">
                Hebziba's 22nd Birthday • Fresh Florist Collection 💐
              </span>
              <Heart className="w-4 h-4 fill-[#F49CB4] text-[#801336]" />
            </div>

            {/* Title */}
            <h2 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#801336] tracking-tight mb-2">
              Pick a Bouquet for My Bestie
            </h2>
            <p className="font-dancing text-xl sm:text-2xl text-[#801336]/80 max-w-2xl mb-8">
              "6 hand-arranged florist bouquets, each carrying a special message and meaning for you"
            </p>

            {/* 6 Bouquets Responsive Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full px-2">
              {curatedBouquets.map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => handleSelectBouquet(b)}
                  className="bg-white rounded-3xl p-5 shadow-scrapbook-card border border-rose-100 flex flex-col items-center text-center cursor-pointer group relative overflow-hidden transition-all hover:border-[#801336]/40 hover:shadow-xl"
                >
                  {/* Tape decoration at top */}
                  <div className="absolute top-3 left-4 transform -rotate-6 bg-[#FFF8E7] px-3 py-1 rounded shadow-sm border border-amber-200/50 text-[10px] font-dancing font-bold text-[#801336] z-10">
                    hand-tied ✨
                  </div>

                  {/* Photo Container */}
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-rose-50/50 mb-4 relative shadow-inner">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    {/* Tag badge overlay */}
                    <div
                      className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-playfair font-bold shadow-md border"
                      style={{ backgroundColor: b.bgBadge, color: b.accentColor, borderColor: b.accentColor + '30' }}
                    >
                      {b.tag}
                    </div>
                  </div>

                  {/* Bouquet Title */}
                  <h3 className="font-playfair text-xl font-bold text-[#801336] mb-1 group-hover:text-[#9E1B43] transition-colors">
                    {b.title}
                  </h3>

                  {/* Flowers list */}
                  <p className="text-xs font-semibold text-[#801336]/75 mb-2 line-clamp-1">
                    {b.flowers}
                  </p>

                  {/* Meaning */}
                  <p className="font-dancing text-base sm:text-lg text-slate-700 leading-snug line-clamp-2 mb-4 flex-grow">
                    "{b.meaning}"
                  </p>

                  {/* Select CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectBouquet(b);
                    }}
                    className="w-full py-2.5 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-xs tracking-wider shadow-pill-maroon hover:bg-[#9E1B43] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Flower2 className="w-3.5 h-3.5 text-[#F49CB4]" />
                    <span>Present to Hebziba 💖</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ================= VIEW 2: PRESENTED SPOTLIGHT VIEW ================= */
          <motion.div
            key="presented"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl flex flex-col items-center"
          >
            {/* Header Title */}
            <div className="text-center mb-6">
              <span className="font-dancing text-2xl sm:text-3xl text-[#801336] block mb-1">
                A Floral Tribute for My Best Friend
              </span>
              <h2 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#801336] tracking-tight">
                Gifted to Hebziba with Love!
              </h2>
            </div>

            {/* 3-Column Display: Left Panda, Center Chosen Bouquet, Right 7 Bestie Compliments */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 w-full items-center justify-center">
              {/* Left Column: Cute Bestie Panda (3 cols) */}
              <div className="lg:col-span-3 flex flex-col items-center text-center order-2 lg:order-1 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-rose-100">
                <div className="w-36 h-36 relative mb-2">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow">
                    <circle cx="100" cy="100" r="70" fill="#FCE4EC" opacity="0.6" />
                    <circle cx="65" cy="55" r="16" fill="#2E1C0C" />
                    <circle cx="135" cy="55" r="16" fill="#2E1C0C" />
                    <ellipse cx="100" cy="135" rx="42" ry="38" fill="#2E1C0C" />
                    <ellipse cx="100" cy="140" rx="26" ry="28" fill="#FFFDF9" />
                    <ellipse cx="100" cy="90" rx="40" ry="32" fill="#FFFDF9" stroke="#E2E8F0" strokeWidth="1.5" />
                    <ellipse cx="82" cy="88" rx="10" ry="14" transform="rotate(-15 82 88)" fill="#2E1C0C" />
                    <ellipse cx="118" cy="88" rx="10" ry="14" transform="rotate(15 118 88)" fill="#2E1C0C" />
                    <circle cx="83" cy="87" r="3" fill="#FFFFFF" />
                    <circle cx="117" cy="87" r="3" fill="#FFFFFF" />
                    <polygon points="100,98 97,101 103,101" fill="#F49CB4" />
                    <ellipse cx="70" cy="95" rx="6" ry="4" fill="#F49CB4" />
                    <ellipse cx="130" cy="95" rx="6" ry="4" fill="#F49CB4" />
                    <line x1="120" y1="125" x2="135" y2="105" stroke="#4A6B53" strokeWidth="2.5" />
                    <circle cx="136" cy="103" r="10" fill="#F49CB4" />
                    <circle cx="136" cy="103" r="4" fill="#801336" />
                  </svg>
                </div>
                <h4 className="font-playfair text-lg font-bold text-[#801336]">
                  Forever Besties
                </h4>
                <p className="font-dancing text-xl text-[#801336] font-bold mt-1">
                  "Only the finest blooms for Hebziba!"
                </p>
                <div className="mt-3 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-[#801336] inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivered to Bestie</span>
                </div>
              </div>

              {/* Center Column: Large Selected Bouquet Polaroid (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook-card border border-rose-100 order-1 lg:order-2">
                {/* Polaroid Frame */}
                <div className="relative p-3 bg-white rounded-2xl shadow-md border border-rose-100 w-full max-w-[340px]">
                  {/* Decorative Washi Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFF8E7] px-4 py-1 rounded shadow-sm border border-amber-200/50 text-[11px] font-dancing font-bold text-[#801336] z-10">
                    Handpicked with Love 💖
                  </div>

                  <div className="overflow-hidden rounded-xl aspect-square bg-rose-50/50 shadow-inner">
                    <img
                      src={selectedBouquet.image}
                      alt={selectedBouquet.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title & Tag */}
                  <div className="pt-3 text-center">
                    <span
                      className="inline-block px-3 py-0.5 rounded-full text-[11px] font-playfair font-bold shadow-sm mb-1.5"
                      style={{ backgroundColor: selectedBouquet.bgBadge, color: selectedBouquet.accentColor }}
                    >
                      {selectedBouquet.tag}
                    </span>
                    <h3 className="font-playfair text-2xl font-extrabold text-[#801336]">
                      {selectedBouquet.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#801336]/80 mt-1">
                      {selectedBouquet.flowers}
                    </p>
                  </div>
                </div>

                {/* Bouquet Dedication Plaque */}
                <div className="mt-5 text-center px-4 py-3 bg-[#FAF6F0] rounded-2xl border border-[#801336]/15 w-full">
                  <p className="font-dancing text-lg sm:text-xl text-slate-800 leading-snug">
                    "{selectedBouquet.meaning}"
                  </p>
                  <span className="font-dancing text-base text-[#801336] font-bold block mt-2">
                    Hand-tied with love for my bestie • Celebrating her 22nd Birthday ✨
                  </span>
                </div>
              </div>

              {/* Right Column: 7 Floating Bestie Compliment Pills (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-2.5 order-3">
                {bestieCompliments.map((compliment, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#801336] shadow-sm border border-rose-200/80 font-dancing text-lg sm:text-xl font-bold cursor-default hover:bg-[#FCE4EC] transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#801336] text-[#801336] flex-shrink-0" />
                    <span className="leading-tight">{compliment}</span>
                    <Sparkles className="w-3 h-3 text-[#F59E0B] ml-auto flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Back to 6 Bouquets Gallery Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setStep('GALLERY')}
                className="px-8 py-3 rounded-full bg-white text-[#801336] border border-[#801336]/40 font-playfair font-bold text-sm tracking-wider shadow-sm hover:bg-rose-50 active:scale-95 flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
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
