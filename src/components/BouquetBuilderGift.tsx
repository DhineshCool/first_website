import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Sparkles, Plus, Minus, Scissors, Tag } from 'lucide-react';
import { FlowerOption } from '../types';

type WrapperType = 'kraft' | 'blush' | 'wine' | 'ivory';
type RibbonType = 'maroon' | 'gold' | 'rose';

export const BouquetBuilderGift: React.FC = () => {
  const [step, setStep] = useState<'STUDIO' | 'PRESENTED'>('STUDIO');
  const [viewMode, setViewMode] = useState<'CUSTOM' | 'REAL_PHOTO'>('CUSTOM');

  // Stems count per flower
  const [stems, setStems] = useState<Record<string, number>>({
    roses: 2,
    peonies: 2,
    sunflowers: 1,
    tulips: 2,
    babysbreath: 2,
    lilies: 1,
  });

  const [wrapper, setWrapper] = useState<WrapperType>('kraft');
  const [ribbon, setRibbon] = useState<RibbonType>('maroon');
  const [includeFoliage, setIncludeFoliage] = useState<boolean>(true);

  const flowerOptions: FlowerOption[] = [
    {
      id: 'roses',
      name: 'Red Roses',
      colorName: 'Crimson',
      emoji: '🌹',
      svgColor: '#801336',
      accentColor: '#9E1B43',
      symbolism: 'Warm Joy & Loyalty',
      image: '/images/flowers/rose_red.png',
    },
    {
      id: 'peonies',
      name: 'Pink Roses',
      colorName: 'Rose Petal',
      emoji: '🌸',
      svgColor: '#FB7185',
      accentColor: '#FDA4AF',
      symbolism: 'Big Smiles & Warm Hugs',
      image: '/images/flowers/rose_pink.png',
    },
    {
      id: 'sunflowers',
      name: 'Sunflowers',
      colorName: 'Golden Amber',
      emoji: '🌻',
      svgColor: '#FBBF24',
      accentColor: '#F59E0B',
      symbolism: 'Pure Laughter & Sunshine',
      image: '/images/flowers/sunflower.png',
    },
    {
      id: 'tulips',
      name: 'Spring Tulips',
      colorName: 'Blush Pink',
      emoji: '🌷',
      svgColor: '#F49CB4',
      accentColor: '#FCE4EC',
      symbolism: 'Sweetest Friendship',
      image: '/images/flowers/tulip.png',
    },
    {
      id: 'babysbreath',
      name: "Daisies & Baby's Breath",
      colorName: 'Cloud White',
      emoji: '🌼',
      svgColor: '#FFFFFF',
      accentColor: '#E2E8F0',
      symbolism: 'Gentle Care & Cheer',
      image: '/images/flowers/daisy.png',
    },
    {
      id: 'lilies',
      name: 'White Lilies',
      colorName: 'Pure White',
      emoji: '🪷',
      svgColor: '#FFFDF9',
      accentColor: '#CBD5E1',
      symbolism: 'Devotion & Trust',
      image: '/images/flowers/lily.png',
    },
  ];

  const wrappers: { id: WrapperType; name: string; bg: string; border: string }[] = [
    { id: 'kraft', name: 'Vintage Kraft', bg: '#E8D8C8', border: '#D4B996' },
    { id: 'blush', name: 'Korean Blush', bg: '#FCE4EC', border: '#F49CB4' },
    { id: 'wine', name: 'Deep Burgundy', bg: '#801336', border: '#5C0D26' },
    { id: 'ivory', name: 'Ivory Linen', bg: '#FFFDF9', border: '#E2E8F0' },
  ];

  const ribbons: { id: RibbonType; name: string; color: string }[] = [
    { id: 'maroon', name: 'Maroon Silk', color: '#801336' },
    { id: 'gold', name: 'Champagne Gold', color: '#F59E0B' },
    { id: 'rose', name: 'Rose Dust', color: '#F49CB4' },
  ];

  const totalStems = Object.values(stems).reduce((a, b) => a + b, 0);

  const addStem = (id: string) => {
    if (totalStems < 15) {
      setStems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  const removeStem = (id: string) => {
    if (stems[id] > 0) {
      setStems((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  const getActiveFlowerNames = () => {
    return Object.entries(stems)
      .filter(([, count]) => count > 0)
      .map(([id]) => flowerOptions.find((f) => f.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(' + ');
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

  // Helper to render realistic SVG bouquet based on current configuration
  const renderBouquetIllustration = (isLarge = false) => {
    const activeWrapper = wrappers.find((w) => w.id === wrapper) || wrappers[0];
    const activeRibbon = ribbons.find((r) => r.id === ribbon) || ribbons[0];

    return (
      <svg
        viewBox="0 0 320 320"
        className={`w-full ${isLarge ? 'max-w-[340px]' : 'max-w-[280px]'} h-auto drop-shadow-xl overflow-visible select-none`}
      >
        {/* ================= STEMS INSIDE CONE ================= */}
        <g stroke="#3D5A45" strokeWidth="3" strokeLinecap="round">
          <line x1="140" y1="120" x2="155" y2="255" />
          <line x1="150" y1="120" x2="160" y2="260" />
          <line x1="165" y1="120" x2="165" y2="255" />
          <line x1="175" y1="120" x2="168" y2="250" />
          <line x1="130" y1="125" x2="152" y2="245" />
          <line x1="185" y1="125" x2="170" y2="245" />
        </g>

        {/* ================= FOLIAGE / GREENERY LEAVES ================= */}
        {includeFoliage && (
          <g fill="#4A6B53" opacity="0.95">
            {/* Eucalyptus round leaves left */}
            <circle cx="95" cy="80" r="16" />
            <circle cx="75" cy="95" r="14" />
            <circle cx="65" cy="120" r="13" />
            <path d="M60 120 Q35 75 75 75 Z" />
            {/* Fern fronds right */}
            <circle cx="225" cy="80" r="16" />
            <circle cx="245" cy="95" r="14" />
            <circle cx="255" cy="120" r="13" />
            <path d="M260 120 Q285 75 245 75 Z" />
            {/* Top foliage crown */}
            <ellipse cx="160" cy="50" rx="40" ry="16" fill="#3D5A45" />
          </g>
        )}

        {/* ================= FLORIST WRAPPING PAPER BACK CONE ================= */}
        <g id="wrapper-back">
          <polygon
            points="60,110 260,110 160,265"
            fill={activeWrapper.bg}
            stroke={activeWrapper.border}
            strokeWidth="2"
          />
          {/* Subtle paper fold crease shadow */}
          <polygon
            points="70,110 160,260 150,110"
            fill="black"
            opacity="0.08"
          />
          <polygon
            points="250,110 160,260 170,110"
            fill="black"
            opacity="0.12"
          />
        </g>

        {/* ================= ARRANGED BLOOMS (REAL FLOWERS) ================= */}
        <g id="flower-arrangement">
          {/* Baby's Breath & Daisies sprays */}
          {stems.babysbreath > 0 && (
            <g opacity="0.95">
              <image href="/images/flowers/daisy.png" x="72" y="38" width="48" height="48" />
              <image href="/images/flowers/daisy.png" x="198" y="38" width="48" height="48" />
              <image href="/images/flowers/daisy.png" x="136" y="15" width="48" height="48" />
            </g>
          )}

          {/* White Lilies (Top focal bloom) */}
          {stems.lilies > 0 && (
            <image
              href="/images/flowers/lily.png"
              x="120"
              y="22"
              width="80"
              height="80"
              className="drop-shadow-md"
            />
          )}

          {/* Golden Sunflowers */}
          {stems.sunflowers > 0 && (
            <image
              href="/images/flowers/sunflower.png"
              x="175"
              y="58"
              width="82"
              height="82"
              className="drop-shadow-md"
            />
          )}

          {/* Spring Tulips */}
          {stems.tulips > 0 && (
            <image
              href="/images/flowers/tulip.png"
              x="65"
              y="62"
              width="75"
              height="75"
              className="drop-shadow-md"
            />
          )}

          {/* Pink Roses & Peonies */}
          {stems.peonies > 0 && (
            <image
              href="/images/flowers/rose_pink.png"
              x="95"
              y="60"
              width="78"
              height="78"
              className="drop-shadow-md"
            />
          )}

          {/* Red Velvet Roses (Central Focal Anchor) */}
          {stems.roses > 0 && (
            <>
              {stems.roses > 1 && (
                <image
                  href="/images/flowers/rose_red.png"
                  x="152"
                  y="52"
                  width="66"
                  height="66"
                  className="drop-shadow-md"
                />
              )}
              <image
                href="/images/flowers/rose_red.png"
                x="122"
                y="72"
                width="82"
                height="82"
                className="drop-shadow-lg"
              />
            </>
          )}

          {/* Default placeholder if no stems are selected */}
          {totalStems === 0 && (
            <g opacity="0.35">
              <image href="/images/flowers/rose_pink.png" x="130" y="65" width="60" height="60" />
            </g>
          )}
        </g>

        {/* ================= FRONT WRAPPER OVERLAY FOLD ================= */}
        <g id="wrapper-front">
          <path
            d="M95 140 Q160 170 225 140 L160 265 Z"
            fill={activeWrapper.bg}
            stroke={activeWrapper.border}
            strokeWidth="1.5"
            opacity="0.9"
          />
        </g>

        {/* ================= TIED SILK RIBBON & FLOWING TAILS ================= */}
        <g id="ribbon" transform="translate(160, 205)">
          {/* Main Bow Loops */}
          <ellipse cx="-16" cy="-2" rx="16" ry="8" transform="rotate(-20 -16 -2)" fill={activeRibbon.color} />
          <ellipse cx="16" cy="-2" rx="16" ry="8" transform="rotate(20 16 -2)" fill={activeRibbon.color} />
          {/* Bow knot */}
          <circle cx="0" cy="0" r="7" fill={activeRibbon.color} stroke="#FFFFFF" strokeWidth="1" />
          {/* Flowing Ribbon Tails */}
          <path
            d="M-4 6 Q-25 40 -35 55 M4 6 Q25 40 35 55"
            stroke={activeRibbon.color}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* ================= FLORIST KRAFT TAG ================= */}
        <g id="florist-tag" transform="translate(195, 180) rotate(12)">
          {/* Tag shape */}
          <polygon points="0,0 55,0 65,15 55,30 0,30" fill="#FFFDF9" stroke="#D4B996" strokeWidth="1.2" />
          <circle cx="8" cy="15" r="2.5" fill="#801336" />
          <text x="32" y="14" textAnchor="middle" fill="#801336" className="font-playfair text-[6.5px] font-bold">
            FOR HEBZIBA
          </text>
          <text x="32" y="23" textAnchor="middle" fill="#801336" className="font-dancing text-[7.5px] font-bold">
            Bestie Edition ✨
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div className="w-full flex flex-col items-center py-6 select-none">
      {step === 'STUDIO' ? (
        /* ================= STEP 1: FLORIST WORKBENCH STUDIO ================= */
        <motion.div
          key="studio-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="w-full max-w-5xl flex flex-col items-center"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-dancing text-2xl text-[#801336] block mb-1">
              Gift 2 of 3 • Custom Florist Studio
            </span>
            <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#801336] tracking-tight">
              Build Your Bouquet For Hebziba 🌸
            </h1>
            <p className="font-dancing text-xl text-[#801336]/80 mt-1">
              "Add fresh blooms, choose Korean wrapping paper, and tie with silk ribbon"
            </p>
          </div>

          {/* Two-Column Workbench Layout: Left Controls & Right Live Preview */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* ================= LEFT CONTROLS (7 COLS) ================= */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* 1. Flower Variety & Stem Counters */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-scrapbook-card border border-rose-100">
                <div className="flex items-center justify-between mb-3 border-b border-rose-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-[#801336]" />
                    <h3 className="font-playfair text-base sm:text-lg font-bold text-[#801336]">
                      1. Select Fresh Stems
                    </h3>
                  </div>
                  <span className="text-xs font-bold font-jakarta px-2.5 py-1 rounded-full bg-rose-50 text-[#801336]">
                    {totalStems}/15 Stems Added
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
                  {flowerOptions.map((f) => {
                    const count = stems[f.id] || 0;
                    return (
                      <div
                        key={f.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                          count > 0
                            ? 'bg-rose-50/70 border-[#801336]/40 shadow-sm'
                            : 'bg-white border-rose-100 hover:border-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {f.image ? (
                            <div className="w-10 h-10 rounded-full bg-white/90 p-0.5 border border-rose-100 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                              <img
                                src={f.image}
                                alt={f.name}
                                className="w-full h-full object-contain filter drop-shadow-sm hover:scale-110 transition-transform"
                              />
                            </div>
                          ) : (
                            <span className="text-2xl filter drop-shadow-sm">{f.emoji}</span>
                          )}
                          <div>
                            <div className="font-playfair text-sm font-bold text-[#801336] leading-tight">
                              {f.name}
                            </div>
                            <div className="font-dancing text-xs text-[#801336]/70 leading-none">
                              {f.symbolism}
                            </div>
                          </div>
                        </div>

                        {/* +/- Stem Counters */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeStem(f.id)}
                            disabled={count === 0}
                            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                              count > 0
                                ? 'bg-white text-[#801336] border-[#801336]/30 hover:bg-rose-100'
                                : 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                            }`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-4 text-center font-bold text-sm text-[#801336]">
                            {count}
                          </span>

                          <button
                            onClick={() => addStem(f.id)}
                            disabled={totalStems >= 15}
                            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                              totalStems < 15
                                ? 'bg-[#801336] text-white border-[#801336] hover:bg-[#9E1B43]'
                                : 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Wrapping Paper & Ribbon Selection */}
              <div className="bg-white rounded-3xl p-5 shadow-scrapbook-card border border-rose-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Wrapping style */}
                <div>
                  <h4 className="font-playfair text-xs uppercase tracking-wider font-bold text-[#801336] mb-2">
                    2. Korean Wrapping Paper
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {wrappers.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setWrapper(w.id)}
                        className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-2 transition-all ${
                          wrapper === w.id
                            ? 'border-[#801336] ring-2 ring-[#801336]/20 font-bold text-[#801336]'
                            : 'border-rose-100 hover:border-rose-200 text-slate-700'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border shadow-inner flex-shrink-0"
                          style={{ backgroundColor: w.bg, borderColor: w.border }}
                        />
                        <span className="truncate">{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Silk Ribbon */}
                <div>
                  <h4 className="font-playfair text-xs uppercase tracking-wider font-bold text-[#801336] mb-2">
                    3. Silk Ribbon Tie
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ribbons.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setRibbon(r.id)}
                        className={`p-2 rounded-xl border text-[11px] font-medium text-center flex flex-col items-center gap-1 transition-all ${
                          ribbon === r.id
                            ? 'border-[#801336] ring-2 ring-[#801336]/20 font-bold text-[#801336]'
                            : 'border-rose-100 hover:border-rose-200 text-slate-700'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border shadow-sm"
                          style={{ backgroundColor: r.color }}
                        />
                        <span className="truncate w-full">{r.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Greenery Foliage Option */}
              <div className="bg-white/80 rounded-2xl px-5 py-3 border border-rose-100 flex items-center justify-between">
                <span className="font-jakarta text-xs font-semibold text-[#801336]">
                  🌿 Include Fresh Eucalyptus & Fern Foliage:
                </span>
                <button
                  onClick={() => setIncludeFoliage(!includeFoliage)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    includeFoliage
                      ? 'bg-[#801336] text-white shadow-sm'
                      : 'bg-rose-100 text-[#801336]'
                  }`}
                >
                  {includeFoliage ? 'Included (Lush)' : 'Off (Minimal)'}
                </button>
              </div>
            </div>

            {/* ================= RIGHT LIVE PREVIEW (5 COLS) ================= */}
            <div className="lg:col-span-5 flex flex-col items-center bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook-card border border-rose-100 relative">
              <div className="absolute top-3 left-4 bg-[#FFF8E7] px-3 py-1 rounded shadow-sm border border-amber-200/50 text-[10px] font-dancing font-bold text-[#801336]">
                live arrangement 💐
              </div>

              {/* Dynamic SVG Workbench Preview */}
              <div className="my-2 flex items-center justify-center">
                {renderBouquetIllustration(false)}
              </div>

              {/* Current Arrangement Description */}
              <div className="text-center w-full mt-2 pt-3 border-t border-rose-100">
                <h4 className="font-playfair text-lg font-bold text-[#801336]">
                  {getActiveFlowerNames() || 'Custom Arrangement'}
                </h4>
                <p className="font-dancing text-sm text-[#801336]/80">
                  {totalStems} stems tied with {ribbons.find((r) => r.id === ribbon)?.name}
                </p>
              </div>

              {/* Action Button: Tie & Present to Hebziba */}
              <div className="mt-5 w-full flex justify-center">
                <button
                  onClick={() => setStep('PRESENTED')}
                  disabled={totalStems === 0}
                  className={`w-full py-3.5 rounded-full font-playfair font-bold text-sm tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-pill-maroon ${
                    totalStems >= 1
                      ? 'bg-[#801336] text-white hover:bg-[#9E1B43] hover:scale-105 active:scale-95 animate-pulse'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Tie & Present to Hebziba 🎀</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ================= STEP 2: ASSEMBLED PRESENTATION VIEW ================= */
        <motion.div
          key="presentation-view"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl flex flex-col items-center"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <span className="font-dancing text-2xl text-[#801336] block mb-1">
              Hand-Tied with Sincere Affection
            </span>
            <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#801336] tracking-tight">
              Flowers for My Bestie, Hebziba!
            </h1>
            <p className="font-dancing text-xl text-[#801336]/80 mt-1">
              "Because no one deserves fresh blooms more than you"
            </p>
          </div>

          {/* 3-Column Display: Left Panda, Center Large Bouquet, Right 7 Bestie Compliments */}
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
              <p className="font-dancing text-xl text-[#F49CB4] font-bold mt-1">
                "Flowers for my bestie, Hebziba!"
              </p>
            </div>

            {/* Center Column: Large Assembled Bouquet (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook-card border border-rose-100 order-1 lg:order-2">
              {/* View Switcher Pill */}
              <div className="mb-4 inline-flex p-1 bg-rose-50 rounded-full border border-rose-200/80">
                <button
                  onClick={() => setViewMode('CUSTOM')}
                  className={`px-4 py-1.5 rounded-full text-xs font-playfair font-bold transition-all ${
                    viewMode === 'CUSTOM'
                      ? 'bg-[#801336] text-white shadow-sm'
                      : 'text-[#801336] hover:bg-rose-100'
                  }`}
                >
                  ✨ Handcrafted Bouquet
                </button>
                <button
                  onClick={() => setViewMode('REAL_PHOTO')}
                  className={`px-4 py-1.5 rounded-full text-xs font-playfair font-bold transition-all ${
                    viewMode === 'REAL_PHOTO'
                      ? 'bg-[#801336] text-white shadow-sm'
                      : 'text-[#801336] hover:bg-rose-100'
                  }`}
                >
                  📸 Studio Photo
                </button>
              </div>

              <div className="flex items-center justify-center min-h-[300px]">
                {viewMode === 'CUSTOM' ? (
                  renderBouquetIllustration(true)
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative p-3 bg-white rounded-2xl shadow-md border border-rose-100 max-w-[300px]"
                  >
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src="/images/flowers/real_luxury_bouquet.jpg"
                        alt="Luxury Fresh Flower Bouquet"
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="pt-2 text-center">
                      <span className="font-dancing text-sm text-[#801336] font-bold">
                        Fresh Florist Stems for Hebziba 💐
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bouquet Dedication Plaque */}
              <div className="mt-4 text-center">
                <span className="font-playfair text-xl font-bold text-[#801336] block">
                  {getActiveFlowerNames() || 'Custom Florist Bouquet'}
                </span>
                <span className="font-dancing text-base text-[#801336] font-bold">
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

          {/* Return to Florist Studio Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setStep('STUDIO')}
              className="px-6 py-2.5 rounded-full bg-white text-[#801336] border border-[#801336]/30 font-playfair font-semibold text-xs tracking-wider shadow-sm hover:bg-rose-50 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Redesign in Florist Studio</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
