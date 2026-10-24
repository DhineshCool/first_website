import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, Music } from 'lucide-react';

interface AudioControllerProps {
  autoPlayTrigger?: boolean;
  onAudioStarted?: () => void;
}

// Generative ambient music using Web Audio API as an ultra-reliable offline fallback
class AmbientSynthEngine {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;

  // Pentatonic warm celestial scale frequencies (F major / D minor pentatonic)
  private scale = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  start() {
    if (this.isRunning) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isRunning = true;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Play soft arpeggiated ambient chords
      let step = 0;
      this.intervalId = window.setInterval(() => {
        if (!this.ctx || !this.isRunning || !this.masterGain) return;
        
        // Root chord tone + harmonic sparkle
        const rootFreq = this.scale[step % this.scale.length];
        const sparkleFreq = this.scale[(step + 2 + Math.floor(Math.random() * 3)) % this.scale.length];
        
        this.playPluck(rootFreq, 0.4, 2.0);
        if (Math.random() > 0.4) {
          setTimeout(() => {
            this.playPluck(sparkleFreq, 0.25, 1.6);
          }, 400);
        }

        step = (step + 1) % this.scale.length;
      }, 1200);
    } catch (e) {
      console.warn('Web Audio synth could not initialize', e);
    }
  }

  private playPluck(freq: number, volume: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Warm low-pass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      // Envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {
      // Audio node cleanup
    }
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {
        // Safe tear down
      }
    }
    if (this.ctx) {
      setTimeout(() => {
        try {
          this.ctx?.close();
        } catch {
          // Context close safe
        }
        this.ctx = null;
      }, 500);
    }
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol * 0.1, this.ctx.currentTime);
    }
  }
}

export const AudioController: React.FC<AudioControllerProps> = ({
  autoPlayTrigger,
  onAudioStarted,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useSynth, setUseSynth] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<AmbientSynthEngine>(new AmbientSynthEngine());

  const startPlayback = useCallback(() => {
    if (isPlaying) return;

    if (audioRef.current && isAudioLoaded) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          onAudioStarted?.();
        })
        .catch((err) => {
          console.log('Audio playback error, falling back to generative synth:', err);
          synthRef.current.start();
          setUseSynth(true);
          setIsPlaying(true);
          onAudioStarted?.();
        });
    } else {
      // Fallback generative audio
      synthRef.current.start();
      setUseSynth(true);
      setIsPlaying(true);
      onAudioStarted?.();
    }
  }, [isPlaying, isAudioLoaded, onAudioStarted]);

  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    synthRef.current.stop();
    setIsPlaying(false);
  }, []);

  const togglePlayback = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  // Safely trigger when parent requests start
  useEffect(() => {
    if (autoPlayTrigger && !isPlaying) {
      startPlayback();
    }
  }, [autoPlayTrigger, isPlaying, startPlayback]);

  // Clean up on unmount
  useEffect(() => {
    const synth = synthRef.current;
    return () => {
      synth.stop();
    };
  }, []);

  return (
    <>
      {/* Background HTML5 audio element with fallback support */}
      <audio
        ref={audioRef}
        src="/audio/background.mp3"
        loop
        preload="auto"
        onCanPlay={() => setIsAudioLoaded(true)}
        onError={() => {
          setIsAudioLoaded(false);
          // Audio file missing or unreadable; synth will take over seamlessly
        }}
      />

      {/* Sticky Floating Audio Control Pill */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={togglePlayback}
          className={`group flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 shadow-2xl border backdrop-blur-md ${
            isPlaying
              ? 'bg-surface/90 border-accent-primary/40 text-tprimary shadow-glow-rose hover:border-accent-primary'
              : 'bg-surface/70 border-white/10 text-tmuted hover:text-tprimary hover:border-white/20'
          }`}
          aria-label={isPlaying ? 'Pause background soundtrack' : 'Play ambient soundtrack'}
          title={isPlaying ? 'Pause music' : 'Play ambient celestial soundtrack'}
        >
          {/* Animated Equalizer Waves */}
          <div className="flex items-end gap-[3px] h-4 w-5 justify-center">
            <span
              className={`w-[3px] bg-accent-primary rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-[bounce_0.9s_ease-in-out_infinite] h-4' : 'h-1.5 opacity-40'
              }`}
            />
            <span
              className={`w-[3px] bg-accent-secondary rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-[bounce_0.7s_ease-in-out_infinite_0.15s] h-3.5' : 'h-1.5 opacity-40'
              }`}
            />
            <span
              className={`w-[3px] bg-accent-highlight rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-[bounce_1.1s_ease-in-out_infinite_0.3s] h-4' : 'h-1.5 opacity-40'
              }`}
            />
            <span
              className={`w-[3px] bg-rose-400 rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite_0.1s] h-2.5' : 'h-1.5 opacity-40'
              }`}
            />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
              {isPlaying ? (
                <>
                  <span className="text-accent-primary font-semibold">Soundtrack Active</span>
                  {useSynth && (
                    <span className="flex items-center text-[10px] text-accent-secondary opacity-80 gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 inline" /> Lo-Fi
                    </span>
                  )}
                </>
              ) : (
                <span className="flex items-center gap-1">
                  <Music className="w-3 h-3 text-tmuted" /> Play Music
                </span>
              )}
            </div>
          </div>

          <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-accent-primary" />
            ) : (
              <VolumeX className="w-4 h-4 text-tmuted" />
            )}
          </div>
        </button>
      </div>
    </>
  );
};
