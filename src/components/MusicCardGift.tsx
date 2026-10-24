import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Music,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  BookOpen,
} from 'lucide-react';

interface LyricLine {
  time: number;
  tamil: string;
  meaning: string;
}

const LYRICS: LyricLine[] = [
  { time: 0, tamil: '🎵 (இன்னிசை அறிமுகம் - Melodic Intro) 🎵', meaning: 'Dedicated with all heart to Hebziba ✨' },
  { time: 37, tamil: 'நேற்று நான் உன்னை பார்த்த பார்வை வேறு...', meaning: 'The way I looked at you yesterday was different...' },
  { time: 43, tamil: 'நீங்காத எண்ணம் ஆக ஆனாய் இன்று...', meaning: 'Today you have become an unforgettable part of my life...' },
  { time: 48, tamil: 'உன்னோடு நானும் போன தூரம் யாவும் நெஞ்சிலே...', meaning: 'All the precious journeys and memories we shared live on in my heart...' },
  { time: 53, tamil: 'ரீங்கார நினைவுகளாக அலையை இங்கே மிஞ்சுதே...', meaning: 'Echoing like gentle waves of endless laughter and warmth...' },
  { time: 59, tamil: 'நூலறுந்த பட்டம் போலே, உன்னை சுற்றி நானும் ஆட...', meaning: 'Like a carefree kite dancing happily around you...' },
  { time: 64, tamil: 'கைகள் நீட்டி நீயும் பிடிக்க காத்திருக்கிறேன்...', meaning: 'Waiting for your warm hand to hold on...' },
  { time: 69, tamil: 'இதற்கெல்லாம் அர்த்தங்கள் என்ன கேட்க வேண்டும் உன்னை...', meaning: 'What does all this beauty mean? I must ask you...' },
  { time: 75, tamil: 'காலம் கை கூடினால்...', meaning: 'When the right moment arrives...' },
  { time: 79, tamil: 'கதைப்போமா... கதைப்போமா... கதைப்போமா...', meaning: 'Shall we talk? Shall we chat? Let us share our thoughts...' },
  { time: 87, tamil: 'ஒன்றாக நீயும் நானும்தான்... கதைப்போமா...', meaning: 'Just the two of us together... shall we talk? ✨' },
  { time: 98, tamil: 'நீ பேச பேச காயம் ஆறுமே... 💖', meaning: 'As you speak, laugh, and smile, every worry heals away...' },
  { time: 123, tamil: 'அதிகாலை வந்தால் அழகாய் என் வானில் நீ அணையாத சூரியன் ஆகிறாய்...', meaning: 'At dawn, you brighten my world like an eternal warm sunshine...' },
  { time: 133, tamil: 'நெடு நேரம் காய்ந்து கத கதப்பு தந்தவுடன் நிலவாய் உருமாறி நிற்கிறாய்...', meaning: 'Soothing like the calm, gentle moonlight in the night...' },
  { time: 144, tamil: 'உன்னை இன்று பார்த்ததும் என்னை நானே கேட்க்கிறேன்...', meaning: 'Looking at how amazing you are, I wonder...' },
  { time: 149, tamil: 'வைரம் ஒன்றை கையில் வைத்து எங்கே தேடி அலைந்தாயோ...', meaning: 'Holding a precious diamond in my life, where else could I look? 💎' },
  { time: 155, tamil: 'உண்மை என்று தெரிந்துமே நெஞ்சம் சொல்ல தயங்குதே...', meaning: 'Knowing this heartfelt bond, words feel shy yet so genuine...' },
  { time: 160, tamil: 'கைகள் கோர்த்து பேசினாலே தைரியங்கள் தோன்றுமே...', meaning: 'Walking together and talking gives endless strength and joy...' },
  { time: 167, tamil: 'கதைப்போமா... கதைப்போமா... ஒன்றாக நீயும் நானும்தான்...', meaning: 'Shall we talk? Just you and me together...' },
  { time: 186, tamil: 'நீ பேச பேச காயம் ஆறுமே... ✨', meaning: 'Every conversation with you brings absolute peace and joy...' },
  { time: 247, tamil: 'கதைப்போமா... ஒன்றாக நீயும் நானும்தான் கதைப்போமா...', meaning: 'Happy 22nd Birthday to the greatest bestie, Hebziba! 🎂' },
  { time: 271, tamil: 'நீ பேச பேச காயம் ஆறுமே... Best Friends Forever! ❤️', meaning: 'From Dhinesh to my favorite person in the world ✨' },
];

export const MusicCardGift: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(282.25); // ~4:42 duration
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showDedicationModal, setShowDedicationModal] = useState<boolean>(false);
  const [hasSeenDedication, setHasSeenDedication] = useState<boolean>(false);
  const [showLyricsModal, setShowLyricsModal] = useState<boolean>(false);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrubberRef = useRef<HTMLDivElement | null>(null);

  // Time formatting helper: mm:ss
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Sync time & duration from HTML5 Audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Play / Pause toggler with dedication gate
  const handlePlayToggle = () => {
    if (!hasSeenDedication) {
      setShowDedicationModal(true);
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleConfirmDedication = () => {
    setShowDedicationModal(false);
    setHasSeenDedication(true);
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  };

  // Seeking on Scrubber click
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current || !audioRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * (duration || 282.25);
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleSkipBack = () => {
    if (!audioRef.current) return;
    const next = Math.max(0, audioRef.current.currentTime - 10);
    audioRef.current.currentTime = next;
    setCurrentTime(next);
  };

  const handleSkipForward = () => {
    if (!audioRef.current) return;
    const next = Math.min(duration, audioRef.current.currentTime + 10);
    audioRef.current.currentTime = next;
    setCurrentTime(next);
  };

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Clean cleanup on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Compute percentage progress
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Find currently active lyric line
  const activeLyric = [...LYRICS].reverse().find((l) => currentTime >= l.time) || LYRICS[0];

  return (
    <div className="w-full flex flex-col items-center py-1 sm:py-2 select-none">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/audio/birthday_song.mp3" type="audio/mpeg" />
        <source src="/audio/birthday_song.m4a" type="audio/mp4" />
      </audio>

      {/* Header */}
      <div className="text-center mb-3 sm:mb-4">
        <span className="font-dancing text-lg sm:text-xl text-[#801336] block mb-0.5">
          Gift 1 of 3
        </span>
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#801336] tracking-tight">
          Our Special Song & Card
        </h1>
        <p className="font-dancing text-xs sm:text-sm text-[#801336]/80 mt-0.5">
          "The soundtrack to our bestie memories, Hebziba"
        </p>
      </div>

      {/* Two Column Layout: Left Vinyl Player & Right Foldable Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full max-w-3xl items-stretch justify-center relative z-20">
        {/* ================= LEFT SIDE: VINYL PLAYER ================= */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-white ring-1 ring-rose-200/80 flex flex-col items-center justify-between h-full">
          {/* Maroon Player Frame */}
          <div className="w-full aspect-[4/3] rounded-xl bg-[#801336] p-3 sm:p-4 flex flex-col items-center justify-between shadow-inner relative overflow-hidden">
            {/* Background texture line */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none" />

            {/* Inscription at top of frame */}
            <p className="font-dancing text-xs sm:text-sm text-[#FAF6F0] text-center font-bold tracking-wide z-10">
              "only the best tunes for my bestie"
            </p>

            {/* Black Vinyl Record Graphic with rotation */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 my-auto flex items-center justify-center">
              {/* Floating music notes when playing */}
              {isPlaying && (
                <>
                  <motion.span
                    animate={{ y: [-10, -42], x: [0, -16], opacity: [0, 0.9, 0], scale: [0.8, 1.2, 0.9] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute top-2 left-4 text-xs pointer-events-none select-none text-amber-200 z-20"
                  >
                    🎵
                  </motion.span>
                  <motion.span
                    animate={{ y: [-8, -46], x: [0, 16], opacity: [0, 0.85, 0], scale: [0.8, 1.25, 0.9] }}
                    transition={{ duration: 2.9, repeat: Infinity, ease: 'easeOut', delay: 1.3 }}
                    className="absolute top-3 right-4 text-xs pointer-events-none select-none text-rose-200 z-20"
                  >
                    🎶
                  </motion.span>
                  <motion.span
                    animate={{ y: [-5, -35], x: [0, 6], opacity: [0, 0.75, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                    className="absolute top-1 left-12 text-[10px] pointer-events-none select-none text-white z-20"
                  >
                    ✨
                  </motion.span>
                </>
              )}

              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 3.5, ease: 'linear' }
                    : { duration: 0.6, ease: 'easeOut' }
                }
                className="w-full h-full rounded-full bg-[#111111] shadow-2xl flex items-center justify-center border-4 border-[#222222] relative overflow-hidden"
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-white/10" />
                <div className="absolute inset-4 rounded-full border border-white/5" />
                <div className="absolute inset-6 rounded-full border border-white/10" />
                <div className="absolute inset-8 rounded-full border border-white/5" />

                {/* Vinyl Light Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 pointer-events-none" />

                {/* Center Label (Pink & Maroon) */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F49CB4] border-2 border-white flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  <Heart className="w-3.5 h-3.5 fill-[#801336] text-[#801336] mb-0.5 animate-pulse" />
                  <span className="text-[9px] font-dancing font-bold text-[#801336] leading-none">
                    Hebziba
                  </span>
                  <span className="text-[6.5px] text-[#801336]/80 font-bold uppercase tracking-tight mt-0.5">
                    22nd B'day • Side A
                  </span>
                </div>

                {/* Spindle hole */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#801336] border border-white/40" />
              </motion.div>

              {/* Tonearm Needle Illustration */}
              <div
                className={`absolute top-0 right-1 w-9 sm:w-12 h-16 origin-top-right transition-transform duration-700 pointer-events-none ${
                  isPlaying ? 'rotate-12' : '-rotate-12 opacity-80'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-500 absolute -top-1 -right-1 shadow-sm" />
                <div className="w-1.5 h-12 bg-slate-200 border border-slate-400 rounded-full mx-auto transform -rotate-12 shadow-sm" />
                <div className="w-3 h-5 bg-slate-800 rounded-sm -bottom-1 left-1 absolute" />
              </div>
            </div>

            {/* Sound Waves & Live Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#F49CB4] z-10">
              {isPlaying ? (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-2.5 bg-amber-300 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-4 bg-amber-300 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-2 bg-amber-300 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="w-1 h-4.5 bg-amber-300 rounded-full animate-bounce [animation-delay:200ms]" />
                  <span className="w-1 h-3 bg-amber-300 rounded-full animate-bounce [animation-delay:100ms]" />
                </div>
              ) : (
                <Sparkles className="w-3 h-3 text-amber-300" />
              )}
              <span className="font-jakarta tracking-wider text-[10px] sm:text-[11px] font-semibold text-rose-100">
                {isPlaying ? 'Playing Our Anthem • கதைப்போமா' : 'Paused · Click Play To Listen'}
              </span>
            </div>
          </div>

          {/* Audio Controls Card Below Player */}
          <div className="w-full mt-3 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="pr-2">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-playfair text-base font-bold text-[#801336]">
                    Kadhaippoma (கதைப்போமா)
                  </h4>
                  <span className="text-[9px] bg-rose-100 text-[#801336] px-1.5 py-0.5 rounded-full font-bold">
                    Melody
                  </span>
                </div>
                <p className="font-dancing text-xs text-[#801336]/80 mt-0.5">
                  Leon James & Sid Sriram • Dedicated to Hebziba ✨
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Mute button */}
                <button
                  onClick={handleToggleMute}
                  className="p-1 rounded-full hover:bg-rose-50 text-[#801336]/70 hover:text-[#801336] transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label="Toggle mute"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Lyrics modal toggle */}
                <button
                  onClick={() => setShowLyricsModal(true)}
                  className="p-1 rounded-full hover:bg-rose-50 text-[#801336]/70 hover:text-[#801336] transition-colors"
                  title="View Lyrics"
                  aria-label="View lyrics"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrubber Bar */}
            <div className="w-full flex items-center gap-2 my-1">
              <span className="text-[10px] font-mono text-[#801336]/70 w-7 text-right">
                {formatTime(currentTime)}
              </span>
              <div
                ref={scrubberRef}
                onClick={handleScrubberClick}
                className="flex-grow h-2 rounded-full bg-rose-100 overflow-hidden relative cursor-pointer group hover:h-2.5 transition-all"
                title="Click to seek"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#801336] to-[#9E1B43] rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#801336]/70 w-7">
                {formatTime(duration)}
              </span>
            </div>

            {/* Playback Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-1.5">
              <button
                onClick={handleSkipBack}
                className="p-1.5 rounded-full hover:bg-rose-50 text-[#801336] transition-all hover:scale-110 active:scale-95"
                title="Rewind 10 seconds"
                aria-label="Rewind 10 seconds"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlayToggle}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#801336] text-white shadow-pill-maroon hover:bg-[#9E1B43] hover:scale-108 active:scale-95 transition-all duration-200 flex items-center justify-center"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4.5 h-4.5 fill-white" />
                ) : (
                  <Play className="w-4.5 h-4.5 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={handleSkipForward}
                className="p-1.5 rounded-full hover:bg-rose-50 text-[#801336] transition-all hover:scale-110 active:scale-95"
                title="Forward 10 seconds"
                aria-label="Forward 10 seconds"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Synchronized Live Lyrics Snippet Banner */}
            <div
              onClick={() => setShowLyricsModal(true)}
              className="mt-2 p-2 rounded-xl bg-rose-50/80 border border-rose-200/60 cursor-pointer hover:bg-rose-100/60 transition-colors text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#801336]/70 uppercase tracking-wider font-bold mb-0.5">
                <Music className="w-2.5 h-2.5 text-[#801336]" />
                <span>Live Lyrics • Tap to view all</span>
              </div>
              <p className="font-jakarta text-xs font-semibold text-[#801336] leading-snug line-clamp-1">
                "{activeLyric.tamil}"
              </p>
              <p className="font-dancing text-[11px] text-[#801336]/75 mt-0.5 line-clamp-1">
                {activeLyric.meaning}
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: FOLDABLE CARD ================= */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-white ring-1 ring-rose-200/80 flex flex-col items-center justify-between h-full relative overflow-hidden">
          {/* Top subtle header ribbon */}
          <div className="w-full flex justify-between items-center mb-2 z-10">
            <div className="bg-[#FFF8E7] px-2.5 py-0.5 rounded shadow-sm border border-amber-200/50 text-[10px] font-dancing font-bold text-[#801336] transform -rotate-1">
              handcrafted card 💌
            </div>
            <span className="text-[10px] font-dancing text-[#801336]/70 font-semibold">
              tap to flip & open
            </span>
          </div>

          {/* 3D Foldable Card Wrapper */}
          <div className="w-full max-w-[270px] sm:max-w-[290px] aspect-[4/5] perspective-1000 my-auto flex items-center justify-center">
            <motion.div
              animate={{ rotateY: isCardOpen ? 180 : 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setIsCardOpen(!isCardOpen)}
              className="w-full h-full relative preserve-3d cursor-pointer rounded-2xl shadow-scrapbook-card"
            >
              {/* FRONT: Closed Maroon Textured Card */}
              <div className="absolute inset-0 backface-hidden bg-[#801336] rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-between border-3 border-[#9E1B43] text-[#FAF6F0] shadow-xl">
                <div className="w-full flex justify-between items-center text-[11px] font-dancing opacity-80">
                  <span>For Hebziba 💖</span>
                  <span>Tap to open</span>
                </div>

                {/* Center Dashed White Heart reading "OPEN" */}
                <div className="flex flex-col items-center my-auto">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
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
                      <span className="font-playfair text-xl font-bold tracking-widest text-[#FAF6F0]">
                        OPEN
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 mt-0.5" />
                    </div>
                  </div>
                </div>

                <div className="w-full text-center">
                  <p className="font-dancing text-sm sm:text-base text-rose-200">
                    "Open to read what is inside"
                  </p>
                </div>
              </div>

              {/* BACK: Unfolded White Inner Frame with Illustrated Besties Photo */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-between border-2 border-rose-200 shadow-xl text-center overflow-hidden">
                <div className="w-full flex justify-between items-center z-20">
                  <span className="text-[10px] font-dancing text-[#801336]/70 font-bold">
                    Dhinesh & Hebziba 💖
                  </span>
                  <span className="text-[9px] bg-rose-50 text-[#801336] px-2 py-0.5 rounded-full font-bold">
                    tap card to close
                  </span>
                </div>

                {/* Cute Chibi Besties Photo - Sized cleanly */}
                <div className="relative my-auto flex-1 w-full flex items-center justify-center py-0.5">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 max-w-full max-h-full flex items-center justify-center">
                    {/* Soft glowing aura behind photo */}
                    <div className="absolute inset-0 bg-[#FDE8EF] rounded-full blur-xl opacity-75 transform scale-95" />
                    <img
                      src="/images/custom/card_besties.jpg"
                      alt="Dhinesh and Hebziba holding sparkler"
                      className="relative z-10 w-full h-full object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Caption: "Best Friends Forever, Hebziba" */}
                <div className="z-20">
                  <h3 className="font-playfair text-base sm:text-lg font-bold text-[#801336]">
                    Best Friends Forever
                  </h3>
                  <p className="font-dancing text-xs sm:text-sm text-[#801336]/80 font-bold mt-0.5">
                    From Dhinesh to my favorite bestie, Hebziba ✨
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-2 text-center">
            <p className="font-dancing text-xs text-[#801336]/80 font-bold">
              {isCardOpen ? 'Click anywhere on the card to fold it back' : 'Click the card to unfold the secret inside'}
            </p>
          </div>
        </div>
      </div>

      {/* ================= DEDICATION MODAL ================= */}
      <AnimatePresence>
        {showDedicationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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

              <div className="w-14 h-14 rounded-full bg-[#FDE8EF] text-[#801336] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Heart className="w-7 h-7 fill-[#801336]" />
              </div>

              <h3 className="font-playfair text-2xl font-bold text-[#801336] mb-2">
                A Sweet Dedication
              </h3>

              <p className="font-jakarta text-xs text-[#801336]/70 uppercase tracking-widest font-semibold mb-3">
                Kadhaippoma (Oh My Kadavule)
              </p>

              <p className="font-dancing text-2xl text-[#801336] leading-relaxed my-4 px-2">
                "I heard this song one day... and it instantly reminded me of our crazy laughs, late talks, and memories. Dedicated to my bestie, Hebziba! ✨"
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleConfirmDedication}
                  className="px-8 py-3.5 rounded-full bg-[#801336] text-[#FAF6F0] font-playfair font-bold text-sm tracking-widest shadow-pill-maroon hover:bg-[#9E1B43] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Our Song 🎵</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ALL LYRICS MODAL ================= */}
      <AnimatePresence>
        {showLyricsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] shadow-2xl border-2 border-rose-200 flex flex-col relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLyricsModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-50 text-[#801336] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FDE8EF] text-[#801336] flex items-center justify-center">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#801336]">
                    Kadhaippoma (கதைப்போமா)
                  </h3>
                  <p className="font-dancing text-sm text-[#801336]/80">
                    Leon James & Sid Sriram • For Hebziba
                  </p>
                </div>
              </div>

              {/* Scrollable lyrics list */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 my-2 border-t border-b border-rose-100 py-4">
                {LYRICS.map((line, idx) => {
                  const isCurrent = activeLyric.time === line.time;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = line.time;
                          setCurrentTime(line.time);
                        }
                      }}
                      className={`p-3 rounded-2xl cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#FDE8EF] border-l-4 border-[#801336] shadow-sm'
                          : 'hover:bg-rose-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#801336]/60 mb-1">
                        <span>{formatTime(line.time)}</span>
                        {isCurrent && (
                          <span className="text-[#801336] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Now Playing
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm sm:text-base ${
                          isCurrent
                            ? 'font-bold text-[#801336]'
                            : 'text-[#801336]/80'
                        }`}
                      >
                        {line.tamil}
                      </p>
                      <p className="font-dancing text-sm text-[#801336]/70 mt-1">
                        {line.meaning}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-between items-center text-xs text-[#801336]/70">
                <span className="font-dancing text-sm">Tap any line to jump to that moment</span>
                <button
                  onClick={() => setShowLyricsModal(false)}
                  className="px-5 py-2 rounded-full bg-[#801336] text-white text-xs font-semibold hover:bg-[#9E1B43] transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
