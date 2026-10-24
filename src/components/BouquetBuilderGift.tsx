import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, RotateCcw, Sparkles, Check } from 'lucide-react';
import { FlowerOption } from '../types';

export const BouquetBuilderGift: React.FC = () => {
  const [step, setStep] = useState<'SELECT' | 'ASSEMBLED'>('SELECT');
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>(['roses', 'tulips']);

  const flowerOptions: FlowerOption[] = [
    {
      id: 'roses',
      name: 'Red Roses',
      colorName: 'Crimson',
      emoji: '🌹',
      svgColor: '#BE123C',
      accentColor: '#801336',
      symbolism: 'Eternal Passion & Love',
    },
    {
      id: 'tulips',
      name: 'Pink Tulips',
      colorName: 'Blush Pink',
      emoji: '🌷',
      svgColor: '#F49CB4',
      accentColor: '#F8BBD0',
      symbolism: 'Sweet Affection & Care',
    },
    {
      id: 'lilies',
      name: 'White Lilies',
      colorName: 'Pure White',
      emoji: '🪷',
      svgColor: '#FFFDF9',
      accentColor: '#E2E8F0',
      symbolism: 'Grace, Elegance & Devotion',
    },
    {
      id: 'sunflowers',
      name: 'Sunflowers',
      colorName: 'Golden Amber',
      emoji: '🌻',
      svgColor: '#FBBF24',
      accentColor: '#F59E0B',
      symbolism: 'Radiant Joy & Warmth',
    },
    {
      id: 'babysbreath',
      name: "Baby's Breath",
      colorName: 'Cloud White',
      emoji: '🌾',
      svgColor: '#F8FAFC',
      accentColor: '#CBD5E1',
      symbolism: 'Everlasting Gentle Care',
    },
    {
      id: 'lavender',
      name: 'Purple Lavender',
      colorName: 'Soft Violet',
      emoji: '🪻',
      svgColor: '#A855F7',
      accentColor: '#C084FC',
      symbolism: 'Peace, Calm & Serenity',
    },
    {
      id: 'peonies',
      name: 'Pink Peonies',
      colorName: 'Rose Petal',
      emoji: '🌸',
      svgColor: '#FB7185',
      accentColor: '#FDA4AF',
      symbolism: 'Prosperity & Sweet Romance',
    },
    {
      id: 'orchids',
      name: 'White Orchids',
      colorName: 'Ivory Cream',
      emoji: '🌺',
      svgColor: '#F1F5F9',
      accentColor: '#E2E8F0',
      symbolism: 'Rare & Exquisite Beauty',
    },
  ];

  const toggleFlower = (id: string) => {
    if (selectedFlowers.includes(id)) {
      if (selectedFlowers.length > 1) {
        setSelectedFlowers(selectedFlowers.filter((f) => f !== id));
      }
    } else {
      setSelectedFlowers([...selectedFlowers, id]);
    }
  };

  const selectedFlowerNames = selectedFlowers
    .map((id) => flowerOptions.find((f) => f.id === id)?.name)
    .filter(Boolean)
    .join(' + ');

  const compliments = [
    "You're my favorite notification",
    'My Cutest Hello',
    'My happiest place',
    'Forever my girl',
    'You make every day brighter',
    'Lucky to know you',
    "Not just on B'day",
  ];

  return (
    <div className="w-full flex flex-col items-center py-6 select-none">
      {/* Step 1: Flower Selection Grid */}
      {step === 'SELECT' ? (
        <motion.div
          key="step-select"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="w-full max-w-4xl flex flex-col items-center"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <span className="font-dancing text-2xl text-[#801336] block mb-1">
              Gift 2 of 3
            </span>
            <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#801336] tracking-tight">
              Build Your Bouquet 🌸
            </h1>
            <p className="font-dancing text-xl text-[#801336]/80 mt-1">
              "Choose your favourite bouquets, Hebziba"
            </p>
          </div>

          {/* 2x4 Grid of 8 Selectable Flower Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {flowerOptions.map((flower) => {
              const isSelected = selectedFlowers.includes(flower.id);
              return (
                <motion.div
                  key={flower.id}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleFlower(flower.id)}
                  className={`rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between cursor-pointer border transition-all duration-200 shadow-sm relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#F8BBD0] border-[#801336] shadow-md ring-2 ring-[#801336]/20'
                      : 'bg-white/80 hover:bg-white border-rose-100 hover:border-rose-300'
                  }`}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#801336] text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Big Flower Emoji / Graphic */}
                  <span className="text-4xl sm:text-5xl my-2 filter drop-shadow-sm">
                    {flower.emoji}
                  </span>

                  {/* Title & Symbolism */}
                  <div className="text-center mt-2">
                    <h3 className="font-playfair text-base sm:text-lg font-bold text-[#801336] leading-tight">
                      {flower.name}
                    </h3>
                    <p className="text-[11px] font-dancing text-[#801336]/80 font-bold mt-1">
                      {flower.symbolism}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Next Pill Button */}
          <div className="mt-10 flex flex-col items-center">
            <button
              onClick={() => setStep('ASSEMBLED')}
              disabled={selectedFlowers.length === 0}
              className={`px-10 py-3.5 rounded-full font-playfair font-bold text-base tracking-wider transition-all duration-200 flex items-center gap-2.5 shadow-pill-maroon ${
                selectedFlowers.length >= 1
                  ? 'bg-[#801336] text-[#FAF6F0] hover:bg-[#9E1B43] hover:scale-105 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Next • Assemble Bouquet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#801336]/70 mt-2 font-dancing">
              {selectedFlowers.length} bloom types selected for Hebziba
            </span>
          </div>
        </motion.div>
      ) : (
        /* Step 2: Assembled Bouquet View */
        <motion.div
          key="step-assembled"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl flex flex-col items-center"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-dancing text-2xl text-[#801336] block mb-1">
              Your Customized Arrangement
            </span>
            <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#801336] tracking-tight">
              Flowers for My Sweetheart!
            </h1>
          </div>

          {/* 3-Column Layout: Left Panda, Center Large Bouquet, Right 7 Floating Compliments */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 w-full items-center justify-center">
            {/* Left: Cute Panda with Caption (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center text-center order-2 lg:order-1 bg-white/70 rounded-3xl p-6 shadow-sm border border-rose-100">
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
                  {/* Flower in paw */}
                  <line x1="120" y1="125" x2="135" y2="105" stroke="#4A6B53" strokeWidth="2.5" />
                  <circle cx="136" cy="103" r="10" fill="#F49CB4" />
                  <circle cx="136" cy="103" r="4" fill="#801336" />
                </svg>
              </div>
              <h4 className="font-playfair text-lg font-bold text-[#801336]">
                Only the Best
              </h4>
              <p className="font-dancing text-xl text-[#F49CB4] font-bold mt-1">
                "Flowers for my sweetheart, Hebziba!"
              </p>
            </div>

            {/* Center: Large Combined Bouquet Illustration with Label (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center bg-white rounded-3xl p-8 shadow-scrapbook-card border border-rose-100 order-1 lg:order-2">
              <div className="relative w-64 sm:w-72 h-64 sm:h-72 flex items-center justify-center">
                <svg viewBox="0 0 280 280" className="w-full h-full drop-shadow-xl overflow-visible">
                  {/* Brown Craft Paper Wrap */}
                  <polygon points="70,120 210,120 140,250" fill="#E8D8C8" stroke="#D4B996" strokeWidth="2" />
                  <polygon points="80,120 140,245 130,120" fill="#D4B996" opacity="0.35" />

                  {/* Tied Satin Ribbon in Burgundy */}
                  <rect x="120" y="180" width="40" height="12" rx="3" fill="#801336" />
                  {/* Ribbon tails */}
                  <path d="M125 192 Q105 220 95 235 M155 192 Q175 220 185 235" stroke="#801336" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="140" cy="186" r="6" fill="#F49CB4" />

                  {/* Leaves Fan */}
                  <g fill="#4A6B53">
                    <path d="M60 90 Q30 50 70 60 Q80 85 60 90 Z" />
                    <path d="M220 90 Q250 50 210 60 Q200 85 220 90 Z" />
                    <path d="M140 50 Q140 10 160 30 Q150 50 140 50 Z" />
                    <path d="M100 60 Q90 20 120 40 Q110 60 100 60 Z" />
                  </g>

                  {/* Dynamic Flowers assembled based on selection */}
                  {/* Central Crimson Rose */}
                  <g transform="translate(140, 85)">
                    <circle cx="0" cy="0" r="26" fill="#801336" />
                    <circle cx="0" cy="0" r="18" fill="#9E1B43" />
                    <circle cx="0" cy="0" r="10" fill="#F49CB4" />
                    <circle cx="0" cy="0" r="4" fill="#FFFFFF" opacity="0.6" />
                  </g>

                  {/* Left Blossom: Pink Tulip / Peony */}
                  <g transform="translate(95, 95)">
                    <circle cx="0" cy="0" r="22" fill="#F49CB4" />
                    <path d="M-10 -15 C-25 5 0 25 15 10 C20 -5 5 -20 -10 -15 Z" fill="#FCE4EC" />
                    <circle cx="0" cy="0" r="6" fill="#801336" />
                  </g>

                  {/* Right Blossom: Golden Sunflower / Orchid */}
                  <g transform="translate(185, 95)">
                    <circle cx="0" cy="0" r="22" fill="#FBBF24" />
                    <circle cx="0" cy="0" r="12" fill="#78350F" />
                    <circle cx="0" cy="0" r="5" fill="#F59E0B" />
                  </g>

                  {/* Top Blossom: White Lily */}
                  <g transform="translate(140, 45)">
                    <circle cx="0" cy="0" r="20" fill="#FFFDF9" stroke="#E2E8F0" strokeWidth="1" />
                    <path d="M-15 0 L15 0 M0 -15 L0 15" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="4" fill="#F59E0B" />
                  </g>

                  {/* Accent Violet Lavender Spikes */}
                  <g fill="#A855F7">
                    <circle cx="70" cy="65" r="4" />
                    <circle cx="74" cy="55" r="3.5" />
                    <circle cx="72" cy="45" r="3" />
                    <circle cx="210" cy="65" r="4" />
                    <circle cx="206" cy="55" r="3.5" />
                    <circle cx="208" cy="45" r="3" />
                  </g>

                  {/* White Baby's Breath Accents */}
                  <g fill="#FFFFFF" opacity="0.95">
                    <circle cx="110" cy="55" r="3" />
                    <circle cx="170" cy="55" r="3" />
                    <circle cx="125" cy="115" r="3" />
                    <circle cx="155" cy="115" r="3" />
                  </g>
                </svg>
              </div>

              {/* Label underneath bouquet */}
              <div className="mt-4 text-center">
                <span className="font-playfair text-lg sm:text-xl font-bold text-[#801336] block">
                  {selectedFlowerNames || 'Handpicked Blooms'}
                </span>
                <span className="font-dancing text-base text-[#F49CB4] font-bold">
                  Wrapped with endless love
                </span>
              </div>
            </div>

            {/* Right: 7 Staggered Floating Compliment Pills (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-2.5 order-3">
              {compliments.map((compliment, idx) => (
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

          {/* Edit Bouquet Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setStep('SELECT')}
              className="px-6 py-2.5 rounded-full bg-white text-[#801336] border border-[#801336]/30 font-playfair font-semibold text-xs tracking-wider shadow-sm hover:bg-rose-50 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Customize Bouquet Again</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
