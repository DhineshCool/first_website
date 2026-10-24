import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Delete, Lock, Sparkles } from 'lucide-react';
import { vaultService } from '../services/vaultService';

interface PasscodeScreenProps {
  correctPasscode?: string;
  onSuccess: () => void;
  onBackToCountdown?: () => void;
}

export const PasscodeScreen: React.FC<PasscodeScreenProps> = ({
  correctPasscode = '2710',
  onSuccess,
  onBackToCountdown,
}) => {
  const [pin, setPin] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleKeyPress = (char: string) => {
    if (pin.length < 4) {
      const newPin = pin + char;
      setPin(newPin);
      setErrorMessage('');
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const verifyPin = useCallback((currentPin: string) => {
    // Accepts 2710 (DD/MM), 1027 (MM/DD)
    if (
      currentPin === correctPasscode ||
      currentPin === '1027' ||
      currentPin === '2710' ||
      currentPin === '2004' ||
      currentPin === '0819'
    ) {
      try {
        const prime = new Audio('/audio/happy_birthday.mp3');
        prime.volume = 0.001;
        prime.play().then(() => {
          prime.pause();
          prime.currentTime = 0;
        }).catch(() => {});
      } catch {
        // safe
      }
      vaultService.init('2710');
      onSuccess();
    } else {
      setIsShaking(true);
      setErrorMessage('Oops! Incorrect passcode. Hint: 27 Oct ✨');
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 700);
    }
  }, [correctPasscode, onSuccess]);

  const handleUnlockClick = () => {
    if (pin.length === 4) {
      verifyPin(pin);
    } else {
      setErrorMessage('Please enter all 4 digits!');
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key) || e.key === '*' || e.key === '#') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleUnlockClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="w-full flex items-center justify-center py-1 sm:py-3 select-none my-auto">
      {/* Centered Two-Column Scrapbook Card */}
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-scrapbook-card border border-rose-200/60 overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* ================= LEFT COLUMN: CUTE BEAR & BUNNY ================= */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFDF9] to-[#FAF6F0] border-b md:border-b-0 md:border-r border-rose-100 relative">
          {/* Decorative Corner Tape */}
          <div className="absolute top-3 left-3 transform -rotate-12 bg-[#FFF8E7] px-3 py-0.5 rounded shadow-sm border border-amber-200/50 text-[10px] font-dancing font-bold text-[#801336]">
            Hebziba's 22nd 💌
          </div>

          <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center my-auto">
            {/* SVG Illustration: Bear and Bunny hugging a big heart */}
            <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-md">
              {/* Soft background aura */}
              <circle cx="160" cy="160" r="130" fill="#FDE8EF" opacity="0.6" />

              {/* Sparkles & mini floating hearts */}
              <g fill="#801336" opacity="0.7">
                <path d="M70 70 Q75 60 80 70 Q90 75 80 80 Q75 90 70 80 Q60 75 70 70 Z" />
                <path d="M250 80 Q254 72 258 80 Q266 84 258 88 Q254 96 250 88 Q242 84 250 80 Z" />
                <path d="M60 210 Q64 204 68 210 Q74 214 68 218 Q64 224 60 218 Q54 214 60 210 Z" />
              </g>

              {/* Brown Teddy Bear (Left) */}
              <g id="bear">
                {/* Ears */}
                <circle cx="95" cy="115" r="22" fill="#B07D62" />
                <circle cx="95" cy="115" r="12" fill="#E0A98B" />
                {/* Body */}
                <ellipse cx="120" cy="205" rx="42" ry="48" fill="#B07D62" />
                {/* Head */}
                <ellipse cx="115" cy="145" rx="38" ry="34" fill="#B07D62" />
                {/* Muzzle */}
                <ellipse cx="122" cy="154" rx="16" ry="12" fill="#E0A98B" />
                <ellipse cx="122" cy="149" rx="6" ry="4" fill="#4A2E18" />
                <path d="M122 153 V158" stroke="#4A2E18" strokeWidth="2" strokeLinecap="round" />
                {/* Eyes */}
                <circle cx="106" cy="140" r="4.5" fill="#2E1C0C" />
                <circle cx="128" cy="139" r="4.5" fill="#2E1C0C" />
                <circle cx="107.5" cy="138" r="1.5" fill="#FFFFFF" />
                <circle cx="129.5" cy="137" r="1.5" fill="#FFFFFF" />
                {/* Blush */}
                <ellipse cx="98" cy="150" rx="6" ry="4" fill="#F49CB4" opacity="0.7" />
                <ellipse cx="136" cy="148" rx="6" ry="4" fill="#F49CB4" opacity="0.7" />
                {/* Bear arm */}
                <ellipse cx="138" cy="188" rx="14" ry="20" transform="rotate(-30 138 188)" fill="#B07D62" />
              </g>

              {/* White Bunny (Right) */}
              <g id="bunny">
                {/* Bunny Ears */}
                <ellipse cx="195" cy="85" rx="12" ry="36" transform="rotate(-15 195 85)" fill="#FFFFFF" stroke="#FCE4EC" strokeWidth="2" />
                <ellipse cx="195" cy="85" rx="6" ry="24" transform="rotate(-15 195 85)" fill="#F8BBD0" />
                <ellipse cx="225" cy="95" rx="12" ry="34" transform="rotate(12 225 95)" fill="#FFFFFF" stroke="#FCE4EC" strokeWidth="2" />
                <ellipse cx="225" cy="95" rx="6" ry="22" transform="rotate(12 225 95)" fill="#F8BBD0" />
                {/* Body */}
                <ellipse cx="200" cy="205" rx="40" ry="46" fill="#FFFFFF" />
                {/* Head */}
                <ellipse cx="205" cy="145" rx="36" ry="32" fill="#FFFFFF" />
                {/* Eyes */}
                <circle cx="192" cy="140" r="4" fill="#2E1C0C" />
                <circle cx="216" cy="140" r="4" fill="#2E1C0C" />
                <circle cx="193" cy="138.5" r="1.3" fill="#FFFFFF" />
                <circle cx="217" cy="138.5" r="1.3" fill="#FFFFFF" />
                {/* Nose & Mouth */}
                <polygon points="204,147 201,151 207,151" fill="#F49CB4" />
                <path d="M204 151 Q200 155 197 153 M204 151 Q208 155 211 153" stroke="#2E1C0C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {/* Blush */}
                <ellipse cx="185" cy="148" rx="6" ry="4" fill="#F8BBD0" />
                <ellipse cx="223" cy="148" rx="6" ry="4" fill="#F8BBD0" />
                {/* Bunny arm */}
                <ellipse cx="182" cy="188" rx="14" ry="20" transform="rotate(30 182 188)" fill="#FFFFFF" />
              </g>

              {/* Big Shared Crimson Maroon Heart with heartbeat pulse */}
              <motion.g
                id="shared-heart"
                animate={{ scale: [1.1, 1.18, 1.1, 1.15, 1.1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '160px 195px' }}
                transform="translate(160, 195)"
              >
                <path
                  d="M0 -15 C-25 -45 -55 -15 -55 15 C-55 45 0 75 0 90 C0 75 55 45 55 15 C55 -15 25 -45 0 -15 Z"
                  fill="#801336"
                  className="filter drop-shadow"
                />
                <circle cx="-16" cy="15" r="4" fill="#FFFFFF" opacity="0.4" />
                <text x="0" y="32" textAnchor="middle" fill="#FAF6F0" className="font-dancing text-xs font-bold">
                  for Hebziba
                </text>
              </motion.g>
            </svg>
          </div>

          <h2 className="font-playfair text-lg sm:text-xl font-bold text-[#801336] mt-2 text-center">
            A Special Gift For My Bestie
          </h2>
          <p className="font-dancing text-sm sm:text-base text-[#801336]/80 text-center mt-0.5">
            "Only for my favorite human, Hebziba..."
          </p>
        </div>

        {/* ================= RIGHT COLUMN: PINK PASSCODE PANEL ================= */}
        <div className="bg-[#F49CB4] p-5 sm:p-6 flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center">
            {/* Script Title */}
            <h1 className="font-dancing text-3xl sm:text-4xl font-bold text-[#801336] tracking-wide mb-3">
              Enter the Passcode
            </h1>

            {/* 4 Heart Indicator Slots */}
            <motion.div
              animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 my-1"
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = index < pin.length;
                return (
                  <motion.div
                    key={index}
                    animate={{ scale: isFilled ? [1, 1.25, 1] : 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/40 border-2 border-[#801336]/30 shadow-inner"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-200 ${
                        isFilled
                          ? 'fill-[#801336] text-[#801336] scale-110'
                          : 'fill-transparent text-[#801336]/30'
                      }`}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Error or Hint feedback */}
            <div className="h-5 my-1 text-[11px] font-medium text-center">
              {errorMessage ? (
                <span className="text-[#801336] font-bold animate-pulse">{errorMessage}</span>
              ) : (
                <span className="text-[#801336]/70 flex items-center gap-1 justify-center">
                  <Sparkles className="w-3 h-3" /> Hint: 27 Oct ✨
                </span>
              )}
            </div>

            {/* 3x4 Circular Button Keypad with spring press */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full max-w-[220px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((btn) => (
                <motion.button
                  key={btn}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleKeyPress(btn)}
                  className="w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-full bg-white text-[#801336] font-playfair text-lg sm:text-xl font-bold shadow-md hover:bg-[#FAF6F0] transition-all duration-150 flex items-center justify-center border border-[#801336]/10 cursor-pointer"
                >
                  {btn}
                </motion.button>
              ))}
            </div>

            {/* Action Row: Delete & Hint Badge */}
            <div className="w-full max-w-[220px] flex items-center justify-between mt-2 px-1">
              <span className="text-[11px] font-dancing text-[#801336]/80 font-bold">
                27 Oct 🎂
              </span>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-[11px] text-[#801336] font-bold hover:opacity-80 p-0.5 cursor-pointer ml-auto"
                aria-label="Delete digit"
              >
                <Delete className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Bottom Pill Button: UNLOCK */}
          <div className="w-full mt-3 flex flex-col items-center justify-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUnlockClick}
              className="animate-shimmer w-full max-w-[210px] py-2.5 rounded-full bg-gradient-to-r from-[#801336] via-[#9E1B43] to-[#801336] text-[#FAF6F0] font-playfair font-bold text-xs tracking-widest shadow-pill-maroon hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 border border-rose-300/40 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 animate-pulse" />
              <span>UNLOCK</span>
            </motion.button>
            {onBackToCountdown && (
              <button
                onClick={onBackToCountdown}
                className="text-[11px] font-dancing font-bold text-[#801336]/75 hover:text-[#801336] hover:underline transition-all mt-0.5"
              >
                ← Back to Birthday Countdown
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
