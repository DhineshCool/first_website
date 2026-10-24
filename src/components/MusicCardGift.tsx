import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Heart, Music, Sparkles, X } from 'lucide-react';

export const MusicCardGift: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(25);
  const [showDedicationModal, setShowDedicationModal] = useState<boolean>(false);
  const [hasSeenDedication, setHasSeenDedication] = useState<boolean>(false);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);

  // Audio Context synthesizer for reliable generative acoustic melodic chimes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startChimeSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Melody notes (C major / A minor pentatonic: C4, D4, E4, G4, A4, C5, D5, E5)
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      let step = 0;

      if (!intervalRef.current) {
        intervalRef.current = window.setInterval(() => {
          if (!audioCtxRef.current) return;
          const now = audioCtxRef.current.currentTime;
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();

          osc.type = 'sine';
          const freq = notes[step % notes.length];
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

          osc.connect(gain);
          gain.connect(audioCtxRef.current.destination);

          osc.start(now);
          osc.stop(now + 1.5);

          step = (step + 1) % notes.length;
        }, 900);
      }
    } catch {
      // Audio fallback safe
    }
  };

  const stopChimeSynth = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePlayToggle = () => {
    if (!hasSeenDedication) {
      setShowDedicationModal(true);
      return;
    }

    if (isPlaying) {
      stopChimeSynth();
      setIsPlaying(false);
    } else {
      startChimeSynth();
      setIsPlaying(true);
    }
  };

  const handleConfirmDedication = () => {
    setShowDedicationModal(false);
    setHasSeenDedication(true);
    startChimeSynth();
    setIsPlaying(true);
  };

  // Progress scrubber simulator
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      stopChimeSynth();
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-6 select-none">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="font-dancing text-2xl text-[#801336] block mb-1">
          Gift 1 of 3
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#801336] tracking-tight">
          Our Special Song & Card
        </h1>
        <p className="font-dancing text-xl text-[#801336]/80 mt-1">
          "Every love song was written about you, Hebziba"
        </p>
      </div>

      {/* Two Column Layout: Left Vinyl Player & Right Foldable Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 w-full max-w-4xl items-start justify-center">
        {/* ================= LEFT SIDE: VINYL PLAYER ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook-card border border-rose-100 flex flex-col items-center">
          {/* Maroon Player Frame */}
          <div className="w-full aspect-[4/3] rounded-2xl bg-[#801336] p-6 flex flex-col items-center justify-between shadow-inner relative overflow-hidden">
            {/* Background texture line */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none" />

            {/* Inscription at top of frame */}
            <p className="font-dancing text-base sm:text-lg text-[#FAF6F0] text-center font-bold tracking-wide z-10">
              "every love song was about you"
            </p>

            {/* Black Vinyl Record Graphic with rotation */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 my-auto flex items-center justify-center">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 4, ease: 'linear' }
                    : { duration: 0.5 }
                }
                className="w-full h-full rounded-full bg-[#111111] shadow-2xl flex items-center justify-center border-4 border-[#222222] relative overflow-hidden"
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-white/10" />
                <div className="absolute inset-5 rounded-full border border-white/5" />
                <div className="absolute inset-8 rounded-full border border-white/10" />
                <div className="absolute inset-11 rounded-full border border-white/5" />

                {/* Vinyl Light Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 pointer-events-none" />

                {/* Center Label (Pink & Maroon) */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F49CB4] border-2 border-white flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  <Heart className="w-4 h-4 fill-[#801336] text-[#801336] mb-0.5" />
                  <span className="text-[9px] font-dancing font-bold text-[#801336] leading-none">
                    Hebziba
                  </span>
                  <span className="text-[7px] text-[#801336]/80 font-bold uppercase tracking-tighter">
                    Side A
                  </span>
                </div>

                {/* Spindle hole */}
                <div className="absolute w-3 h-3 rounded-full bg-[#801336] border border-white/40" />
              </motion.div>

              {/* Tonearm Needle Illustration */}
              <div
                className={`absolute top-0 right-1 w-12 sm:w-16 h-20 origin-top-right transition-transform duration-500 pointer-events-none ${
                  isPlaying ? 'rotate-12' : '-rotate-12 opacity-80'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-500 absolute -top-1 -right-1" />
                <div className="w-1.5 h-16 bg-slate-200 border border-slate-400 rounded-full mx-auto transform -rotate-12" />
                <div className="w-3.5 h-6 bg-slate-800 rounded-sm -bottom-1 left-1 absolute" />
              </div>
            </div>

            {/* Subtle Sound Waves Badge */}
            <div className="flex items-center gap-1.5 text-xs text-[#F49CB4] z-10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-jakarta tracking-wider text-[11px] font-semibold">
                {isPlaying ? 'Playing in High Delight' : 'Paused · Click Play'}
              </span>
            </div>
          </div>

          {/* Audio Controls Card Below Player */}
          <div className="w-full mt-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-playfair text-lg font-bold text-[#801336]">
                  Happy Birthday Song
                </h4>
                <p className="font-dancing text-sm text-[#801336]/70">
                  Dedicated to Hebziba ✨
                </p>
              </div>
              <Music className={`w-5 h-5 text-[#801336] ${isPlaying ? 'animate-bounce' : 'opacity-40'}`} />
            </div>

            {/* Scrubber Bar */}
            <div className="w-full flex items-center gap-3 my-2">
              <span className="text-[11px] font-mono text-[#801336]/60">0:42</span>
              <div className="flex-grow h-2 rounded-full bg-rose-100 overflow-hidden relative cursor-pointer">
                <div
                  className="h-full bg-[#801336] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-[#801336]/60">3:18</span>
            </div>

            {/* Playback Action Buttons */}
            <div className="flex items-center justify-center gap-6 mt-3">
              <button
                onClick={() => setProgress((p) => Math.max(0, p - 10))}
                className="p-2.5 rounded-full hover:bg-rose-50 text-[#801336] transition-colors"
                aria-label="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayToggle}
                className="w-14 h-14 rounded-full bg-[#801336] text-white shadow-pill-maroon hover:bg-[#9E1B43] hover:scale-108 active:scale-95 transition-all duration-200 flex items-center justify-center"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setProgress((p) => Math.min(100, p + 10))}
                className="p-2.5 rounded-full hover:bg-rose-50 text-[#801336] transition-colors"
                aria-label="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: FOLDABLE CARD ================= */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[340px] sm:max-w-[360px] aspect-[4/5] perspective-1000">
            <motion.div
              animate={{ rotateY: isCardOpen ? 180 : 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setIsCardOpen(!isCardOpen)}
              className="w-full h-full relative preserve-3d cursor-pointer rounded-3xl shadow-scrapbook-card"
            >
              {/* FRONT: Closed Maroon Textured Card */}
              <div className="absolute inset-0 backface-hidden bg-[#801336] rounded-3xl p-8 flex flex-col items-center justify-between border-4 border-[#9E1B43] text-[#FAF6F0] shadow-xl">
                <div className="w-full flex justify-between items-center text-xs font-dancing opacity-80">
                  <span>For Hebziba 💖</span>
                  <span>Tap to open</span>
                </div>

                {/* Center Dashed White Heart reading "OPEN" */}
                <div className="flex flex-col items-center my-auto">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
                      <path
                        d="M80 30 C50 -5 10 20 10 60 C10 100 80 145 80 150 C80 145 150 100 150 60 C150 20 110 -5 80 30 Z"
                        fill="rgba(255, 255, 255, 0.08)"
                        stroke="#FAF6F0"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-playfair text-2xl font-bold tracking-widest text-[#FAF6F0]">
                        OPEN
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-300 mt-1" />
                    </div>
                  </div>
                </div>

                <div className="w-full text-center">
                  <p className="font-dancing text-lg text-rose-200">
                    "Open to read what is inside"
                  </p>
                </div>
              </div>

              {/* BACK: Unfolded White Inner Frame with Cute Panda */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between border-2 border-rose-200 shadow-xl text-center">
                <div className="w-full flex justify-end">
                  <span className="text-[10px] bg-rose-50 text-[#801336] px-2.5 py-0.5 rounded-full font-bold">
                    tap card to close
                  </span>
                </div>

                {/* Panda with hearts SVG */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 my-auto">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow">
                    <circle cx="100" cy="100" r="75" fill="#FDE8EF" opacity="0.6" />
                    {/* Panda ears */}
                    <circle cx="65" cy="55" r="16" fill="#2E1C0C" />
                    <circle cx="135" cy="55" r="16" fill="#2E1C0C" />
                    {/* Body */}
                    <ellipse cx="100" cy="140" rx="45" ry="40" fill="#2E1C0C" />
                    <ellipse cx="100" cy="144" rx="28" ry="30" fill="#FFFDF9" />
                    {/* Head */}
                    <ellipse cx="100" cy="90" rx="42" ry="35" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.5" />
                    {/* Eye patches */}
                    <ellipse cx="82" cy="86" rx="11" ry="14" transform="rotate(-15 82 86)" fill="#2E1C0C" />
                    <ellipse cx="118" cy="86" rx="11" ry="14" transform="rotate(15 118 86)" fill="#2E1C0C" />
                    <circle cx="83" cy="85" r="3.5" fill="#FFFFFF" />
                    <circle cx="117" cy="85" r="3.5" fill="#FFFFFF" />
                    {/* Nose & mouth */}
                    <ellipse cx="100" cy="98" rx="5" ry="3.5" fill="#2E1C0C" />
                    <path d="M100 102 V105 M100 105 Q96 109 93 107 M100 105 Q104 109 107 107" stroke="#2E1C0C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    {/* Cheeks */}
                    <ellipse cx="70" cy="98" rx="6" ry="4" fill="#F49CB4" />
                    <ellipse cx="130" cy="98" rx="6" ry="4" fill="#F49CB4" />
                    {/* Hugging tiny heart */}
                    <path d="M100 120 C92 105 76 115 76 128 C76 142 100 156 100 160 C100 156 124 142 124 128 C124 115 108 105 100 120 Z" fill="#801336" />
                  </svg>
                </div>

                {/* Caption: "I Love You So Much Hebziba" */}
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-[#801336]">
                    I Love You So Much
                  </h3>
                  <p className="font-dancing text-xl text-[#F49CB4] font-bold mt-1">
                    Forever & Always, Hebziba ❤️
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <p className="font-dancing text-sm text-[#801336]/70 mt-4 text-center">
            {isCardOpen ? 'Click anywhere on the card to fold it back' : 'Click the card to unfold the secret inside'}
          </p>
        </div>
      </div>

      {/* ================= DEDICATION MODAL ================= */}
      <AnimatePresence>
        {showDedicationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-rose-200 text-center relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDedicationModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-50 text-[#801336] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#FDE8EF] text-[#801336] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Heart className="w-6 h-6 fill-[#801336]" />
              </div>

              <h3 className="font-playfair text-2xl font-bold text-[#801336] mb-3">
                A Sweet Dedication
              </h3>

              <p className="font-dancing text-2xl text-[#801336] leading-relaxed my-4 px-2">
                "I heard this song one day... and every single word reminded me of you. So this one is dedicated only to you, Hebziba ❤️"
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleConfirmDedication}
                  className="px-8 py-3.5 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-sm tracking-widest shadow-pill-maroon hover:bg-[#9E1B43] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Our Song</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
