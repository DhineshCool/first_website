import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, SkipForward, Play, Pause } from 'lucide-react';

interface SoundtrackTrack {
  id: string;
  name: string;
  artist: string;
  src: string;
  badge: string;
}

const TRACKS: SoundtrackTrack[] = [
  {
    id: 'musicbox',
    name: 'Celestial Music Box',
    artist: 'Acoustic Birthday Melody',
    src: '/audio/background.mp3',
    badge: 'Lo-Fi ✨',
  },
  {
    id: 'starlight',
    name: 'Starlight Serenade',
    artist: 'Acoustic Guitar Lullaby',
    src: '/audio/starlight_serenade.mp3',
    badge: 'Acoustic 🌙',
  },
  {
    id: 'birthday',
    name: 'Happy Birthday Hebziba',
    artist: 'Birthday Tribute 🎂',
    src: '/audio/happy_birthday.mp3',
    badge: 'Celebration 🎉',
  },
];

interface BackgroundMusicPlayerProps {
  isSuppressed?: boolean; // When Cake or Dedicated Player is playing
}

export const BackgroundMusicPlayer: React.FC<BackgroundMusicPlayerProps> = ({
  isSuppressed = false,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.28); // Gentle 28% background level
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = TRACKS[currentTrackIndex];

  // Sync volume & mute state to HTML5 audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle suppression (e.g. when Cake screen plays Happy Birthday or Music Card plays)
  useEffect(() => {
    if (isSuppressed && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    } else if (!isSuppressed && isPlaying && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  }, [isSuppressed, isPlaying]);

  // Play handler with gesture fallback
  const startPlayback = useCallback(() => {
    if (!audioRef.current || isSuppressed) return;
    audioRef.current.volume = isMuted ? 0 : volume;
    const promise = audioRef.current.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(() => {
          // Autoplay blocked by browser policy until gesture
        });
    }
  }, [isSuppressed, isMuted, volume]);

  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = () => {
    setHasInteracted(true);
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const handleNextTrack = () => {
    setHasInteracted(true);
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIdx);
  };

  // Switch audio track source
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.load();
      if (isPlaying && !isSuppressed) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, track.src, isPlaying, isSuppressed]);

  // Auto-unlock background music on very first user interaction
  useEffect(() => {
    if (!hasInteracted) {
      const handleFirstClick = () => {
        setHasInteracted(true);
        if (!isSuppressed) {
          startPlayback();
        }
      };

      window.addEventListener('click', handleFirstClick, { capture: true, once: true });
      window.addEventListener('touchstart', handleFirstClick, { capture: true, once: true });
      window.addEventListener('pointerdown', handleFirstClick, { capture: true, once: true });

      return () => {
        window.removeEventListener('click', handleFirstClick, { capture: true });
        window.removeEventListener('touchstart', handleFirstClick, { capture: true });
        window.removeEventListener('pointerdown', handleFirstClick, { capture: true });
      };
    }
  }, [hasInteracted, isSuppressed, startPlayback]);

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        loop
        preload="metadata"
        onEnded={handleNextTrack}
      />

      {/* Floating Scrapbook Music Control Pill (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 select-none">
        <motion.div
          layout
          className="bg-white/95 backdrop-blur-md rounded-full shadow-2xl border-2 border-rose-200/90 ring-1 ring-white/60 p-1 flex items-center gap-1.5 transition-all text-[#801336]"
        >
          {/* Main Pill Play/Pause button */}
          <button
            onClick={togglePlay}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isPlaying && !isSuppressed
                ? 'bg-gradient-to-tr from-[#801336] to-[#9E1B43] text-white shadow-md'
                : 'bg-rose-100 text-[#801336] hover:bg-rose-200'
            }`}
            title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
            aria-label={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
          >
            {isPlaying && !isSuppressed ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-[#801336] ml-0.5" />
            )}
          </button>

          {/* Equalizer animation + Track name */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-2 py-0.5 cursor-pointer group"
            title="Click to change track or adjust volume"
          >
            {/* Equalizer bars */}
            <div className="flex items-end gap-0.5 h-3 w-3.5 justify-center">
              <span
                className={`w-[2.5px] bg-[#801336] rounded-full transition-all ${
                  isPlaying && !isSuppressed
                    ? 'h-3 animate-bounce [animation-duration:800ms]'
                    : 'h-1 opacity-40'
                }`}
              />
              <span
                className={`w-[2.5px] bg-[#F49CB4] rounded-full transition-all ${
                  isPlaying && !isSuppressed
                    ? 'h-3.5 animate-bounce [animation-duration:650ms]'
                    : 'h-1 opacity-40'
                }`}
              />
              <span
                className={`w-[2.5px] bg-[#801336] rounded-full transition-all ${
                  isPlaying && !isSuppressed
                    ? 'h-2.5 animate-bounce [animation-duration:900ms]'
                    : 'h-1 opacity-40'
                }`}
              />
            </div>

            <div className="flex flex-col text-left max-w-[110px] sm:max-w-[150px] truncate">
              <span className="font-playfair text-[11px] font-bold text-[#801336] truncate leading-tight">
                {isSuppressed ? 'Soundtrack Paused' : track.name}
              </span>
              <span className="font-dancing text-[9px] text-[#801336]/70 truncate leading-none">
                {isSuppressed ? 'for spotlight audio' : track.badge}
              </span>
            </div>
          </div>

          {/* Next Track Button */}
          <button
            onClick={handleNextTrack}
            className="w-7 h-7 rounded-full hover:bg-rose-100 flex items-center justify-center text-[#801336]/80 hover:text-[#801336] transition-colors"
            title="Next Track"
            aria-label="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-7 h-7 rounded-full hover:bg-rose-100 flex items-center justify-center text-[#801336]/80 hover:text-[#801336] transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </motion.div>

        {/* Expanded Track Picker & Volume Tray */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-12 right-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border-2 border-rose-200/90 text-[#801336]"
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-rose-100">
                <span className="font-dancing text-xs font-bold text-[#801336]">
                  Background Soundtracks ✨
                </span>
                <span className="text-[9px] bg-rose-100 text-[#801336] px-1.5 py-0.5 rounded-full font-bold">
                  {TRACKS.length} songs
                </span>
              </div>

              {/* Track list */}
              <div className="flex flex-col gap-1 my-1.5">
                {TRACKS.map((t, idx) => {
                  const isActive = idx === currentTrackIndex;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                        setHasInteracted(true);
                      }}
                      className={`w-full text-left p-1.5 rounded-xl transition-all flex items-center justify-between gap-1.5 ${
                        isActive
                          ? 'bg-[#801336] text-[#FAF6F0] font-bold shadow-sm'
                          : 'hover:bg-rose-50 text-[#801336]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Music className={`w-3 h-3 shrink-0 ${isActive ? 'text-amber-200' : 'text-[#801336]/60'}`} />
                        <span className="text-[11px] font-playfair truncate">{t.name}</span>
                      </div>
                      <span className={`text-[8.5px] px-1.5 py-0.2 rounded-full shrink-0 font-dancing ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-[#801336]'
                      }`}>
                        {t.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-rose-100 flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-[#801336]/70 shrink-0" />
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-full h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-[#801336]"
                  title="Background Volume"
                />
                <span className="text-[9px] font-mono text-[#801336]/70 w-6 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
