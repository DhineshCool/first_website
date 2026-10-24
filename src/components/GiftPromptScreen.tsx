import React from 'react';
import { motion } from 'framer-motion';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';

interface GiftPromptScreenProps {
  isRejectedView: boolean;
  onAccept: () => void;
  onReject: () => void;
  onTryAgain: () => void;
}

export const GiftPromptScreen: React.FC<GiftPromptScreenProps> = ({
  isRejectedView,
  onAccept,
  onReject,
  onTryAgain,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center select-none py-1 sm:py-2 my-auto">
      {/* ================= PROMPT VIEW ================= */}
      {!isRejectedView ? (
        <motion.div
          key="prompt-gift"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col items-center max-w-md sm:max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 sm:px-8 shadow-2xl border-2 border-rose-200/80 ring-1 ring-white/60"
        >
          {/* Header */}
          <span className="font-dancing text-base sm:text-lg text-[#801336] block mb-0.5 font-semibold">
            From Dhinesh • A special surprise for my bestie, Hebziba
          </span>
          <h1 className="font-playfair text-xl sm:text-2xl font-extrabold text-[#801336] tracking-wide mb-2 uppercase">
            PLEASE ACCEPT THE GIFT
          </h1>

          {/* Center Illustration: Cute Panda holding large maroon heart */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 my-1 relative">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md">
              {/* Soft pink circle behind */}
              <circle cx="150" cy="150" r="115" fill="#FDE8EF" opacity="0.6" />

              {/* Panda Ears */}
              <circle cx="95" cy="85" r="24" fill="#2E1C0C" />
              <circle cx="95" cy="85" r="12" fill="#4A2E18" />
              <circle cx="205" cy="85" r="24" fill="#2E1C0C" />
              <circle cx="205" cy="85" r="12" fill="#4A2E18" />

              {/* Panda Body */}
              <ellipse cx="150" cy="205" rx="65" ry="60" fill="#2E1C0C" />
              <ellipse cx="150" cy="210" rx="42" ry="46" fill="#FFFDF9" />

              {/* Panda Head */}
              <ellipse cx="150" cy="130" rx="60" ry="50" fill="#FFFDF9" stroke="#E8D8C8" strokeWidth="2" />

              {/* Eye patches */}
              <ellipse cx="125" cy="125" rx="16" ry="20" transform="rotate(-15 125 125)" fill="#2E1C0C" />
              <ellipse cx="175" cy="125" rx="16" ry="20" transform="rotate(15 175 125)" fill="#2E1C0C" />
              {/* Eyes */}
              <circle cx="127" cy="123" r="5" fill="#FFFFFF" />
              <circle cx="173" cy="123" r="5" fill="#FFFFFF" />
              <circle cx="128" cy="122" r="2.5" fill="#2E1C0C" />
              <circle cx="172" cy="122" r="2.5" fill="#2E1C0C" />

              {/* Nose & Mouth */}
              <ellipse cx="150" cy="140" rx="7" ry="5" fill="#2E1C0C" />
              <path d="M150 145 V150 M150 150 Q145 155 140 152 M150 150 Q155 155 160 152" stroke="#2E1C0C" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Cute Pink Cheeks */}
              <ellipse cx="108" cy="142" rx="9" ry="6" fill="#F49CB4" opacity="0.75" />
              <ellipse cx="192" cy="142" rx="9" ry="6" fill="#F49CB4" opacity="0.75" />

              {/* Panda Arms Holding Heart */}
              <ellipse cx="98" cy="190" rx="18" ry="26" transform="rotate(25 98 190)" fill="#2E1C0C" />
              <ellipse cx="202" cy="190" rx="18" ry="26" transform="rotate(-25 202 190)" fill="#2E1C0C" />

              {/* Large Maroon Heart in Panda's Hands */}
              <g id="panda-heart" transform="translate(150, 185) scale(0.95)">
                <path
                  d="M0 -20 C-30 -55 -70 -20 -70 20 C-70 60 0 100 0 115 C0 100 70 60 70 20 C70 -20 30 -55 0 -20 Z"
                  fill="#801336"
                  className="filter drop-shadow-md"
                />
                <circle cx="-20" cy="15" r="5" fill="#FFFFFF" opacity="0.3" />
                <text x="0" y="38" textAnchor="middle" fill="#FAF6F0" className="font-dancing text-sm font-bold">
                  besties 4ever
                </text>
              </g>
            </svg>
          </div>

          <p className="font-dancing text-sm sm:text-base text-[#801336] my-2 font-bold">
            "Will you accept these surprises from Dhinesh?"
          </p>

          {/* Two Maroon Pill Buttons: YES and NO */}
          <div className="flex items-center gap-4 mt-1">
            <button
              onClick={onAccept}
              className="px-6 py-2.5 sm:px-7 sm:py-2.5 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-xs sm:text-sm tracking-widest shadow-pill-maroon hover:bg-[#9E1B43] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-[#F49CB4] text-[#F49CB4]" />
              <span>YES</span>
            </button>

            <button
              onClick={onReject}
              className="px-6 py-2.5 sm:px-7 sm:py-2.5 rounded-full bg-white text-[#801336] border-2 border-[#801336] font-playfair font-bold text-xs sm:text-sm tracking-widest shadow-md hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>NO</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* ================= REJECT VIEW ================= */
        <motion.div
          key="reject-gift"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center max-w-md sm:max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 sm:px-8 shadow-2xl border-2 border-rose-300 ring-1 ring-white/60"
        >
          {/* Header */}
          <h1 className="font-playfair text-xl sm:text-2xl font-extrabold text-[#801336] tracking-wide mb-1.5 uppercase animate-bounce">
            WHY DID YOU CLICK NO! 😭
          </h1>
          <p className="font-dancing text-sm sm:text-base text-[#801336]/80 mb-1.5 font-semibold">
            You broke Dhinesh's heart into tiny pieces... 😭💔
          </p>

          {/* Center Illustration: Crying / Sad Panda */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 my-1 relative">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md">
              <circle cx="150" cy="150" r="115" fill="#E2E8F0" opacity="0.6" />

              {/* Droopy Panda Ears */}
              <circle cx="90" cy="95" r="22" fill="#2E1C0C" />
              <circle cx="210" cy="95" r="22" fill="#2E1C0C" />

              {/* Panda Body */}
              <ellipse cx="150" cy="215" rx="65" ry="55" fill="#2E1C0C" />
              <ellipse cx="150" cy="220" rx="42" ry="42" fill="#FFFDF9" />

              {/* Panda Head */}
              <ellipse cx="150" cy="140" rx="58" ry="48" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="2" />

              {/* Sad Eye Patches */}
              <ellipse cx="125" cy="135" rx="16" ry="18" transform="rotate(15 125 135)" fill="#2E1C0C" />
              <ellipse cx="175" cy="135" rx="16" ry="18" transform="rotate(-15 175 135)" fill="#2E1C0C" />

              {/* Closed Crying Eyes */}
              <path d="M117 135 Q125 128 133 135" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M167 135 Q175 128 183 135" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Cascading Blue Tears */}
              <g fill="#38BDF8">
                <path d="M125 142 C122 148 116 160 116 166 C116 172 121 176 126 176 C131 176 136 172 136 166 C136 160 130 148 125 142 Z" />
                <circle cx="120" cy="188" r="4" opacity="0.7" />
                <path d="M175 142 C172 148 166 160 166 166 C166 172 171 176 176 176 C181 176 186 172 186 166 C186 160 180 148 175 142 Z" />
                <circle cx="180" cy="188" r="4" opacity="0.7" />
              </g>

              {/* Sad Mouth */}
              <ellipse cx="150" cy="150" rx="6" ry="4" fill="#2E1C0C" />
              <path d="M142 165 Q150 157 158 165" stroke="#2E1C0C" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Broken Maroon Heart */}
              <g transform="translate(150, 220) scale(0.7)">
                <path d="M-5 -20 C-30 -50 -60 -20 -60 15 C-60 45 0 80 -5 95 L-2 70 L-10 50 L2 30 L-8 10 Z" fill="#801336" />
                <path d="M5 -20 C30 -50 60 -20 60 15 C60 45 0 80 5 95 L2 70 L10 50 L-2 30 L8 10 Z" fill="#801336" />
              </g>
            </svg>
          </div>

          <p className="font-dancing text-sm sm:text-base text-[#801336] my-2 font-bold">
            Hebziba, don't break your bestie's heart, please say YES! 🥺
          </p>

          {/* Button: TRY AGAIN */}
          <button
            onClick={onTryAgain}
            className="px-6 py-2.5 sm:px-7 sm:py-2.5 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-xs sm:text-sm tracking-widest shadow-pill-maroon hover:bg-[#9E1B43] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 mt-1"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>TRY AGAIN</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
