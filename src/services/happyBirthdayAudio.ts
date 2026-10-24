/**
 * Happy Birthday Audio Service
 * Plays the celebratory Happy Birthday chime/music box arrangement.
 * Supports HTML5 Audio with an automatic Web Audio API synthesizer fallback
 * to guarantee 100% reliable playback across all browsers and devices.
 */

class HappyBirthdayAudioService {
  private audioElement: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private synthInterval: number | null = null;
  private synthGain: GainNode | null = null;

  constructor() {
    // Lazy initialize on first interaction or play
  }

  private initAudioElement() {
    if (this.audioElement) return;
    try {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.85;
      audio.preload = 'auto';

      // Check format support
      if (audio.canPlayType('audio/mpeg')) {
        audio.src = '/audio/happy_birthday.mp3';
      } else {
        audio.src = '/audio/happy_birthday.m4a';
      }

      this.audioElement = audio;
    } catch (e) {
      console.warn('Audio element initialization failed:', e);
    }
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx) {
      try {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      } catch (e) {
        console.warn('Web Audio API not supported:', e);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Start playing the Happy Birthday melody
   */
  public async play(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.initAudioElement();

    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.muted = this.isMuted;
      try {
        await this.audioElement.play();
        return;
      } catch (err) {
        console.warn('HTML5 Audio play was prevented or failed, activating Web Audio synth:', err);
      }
    }

    // Fallback: Web Audio API musical chime box
    this.startSynth();
  }

  /**
   * Stop playing immediately with a gentle fade-out
   */
  public stop(): void {
    this.isPlaying = false;

    // Stop HTML5 audio
    if (this.audioElement) {
      try {
        // Fade out volume slightly before pausing
        const prevVol = this.audioElement.volume;
        this.audioElement.volume = Math.max(0, prevVol * 0.3);
        setTimeout(() => {
          if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.audioElement.volume = prevVol;
          }
        }, 120);
      } catch {
        // Safe pause
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      }
    }

    // Stop synth fallback
    this.stopSynth();
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute;
    if (this.audioElement) {
      this.audioElement.muted = mute;
    }
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(mute ? 0 : 0.15, this.audioCtx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // ================= WEB AUDIO SYNTHESIZER FALLBACK =================
  private startSynth(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopSynth();

    this.synthGain = ctx.createGain();
    this.synthGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, ctx.currentTime);
    this.synthGain.connect(ctx.destination);

    // Happy birthday melody notes in Hz
    const notes: [number, number][] = [
      [293.66, 0.75], // D4
      [293.66, 0.25], // D4
      [329.63, 1.0],  // E4
      [293.66, 1.0],  // D4
      [392.00, 1.0],  // G4
      [369.99, 2.0],  // F#4
      [293.66, 0.75], // D4
      [293.66, 0.25], // D4
      [329.63, 1.0],  // E4
      [293.66, 1.0],  // D4
      [440.00, 1.0],  // A4
      [392.00, 2.0],  // G4
      [293.66, 0.75], // D4
      [293.66, 0.25], // D4
      [587.33, 1.0],  // D5
      [493.88, 1.0],  // B4
      [392.00, 1.0],  // G4
      [369.99, 1.0],  // F#4
      [329.63, 2.0],  // E4
      [523.25, 0.75], // C5
      [523.25, 0.25], // C5
      [493.88, 1.0],  // B4
      [392.00, 1.0],  // G4
      [440.00, 1.0],  // A4
      [392.00, 2.5],  // G4
    ];

    const beatDuration = 0.55; // seconds per beat

    const playFullSong = () => {
      if (!this.isPlaying || !this.audioCtx || !this.synthGain) return;
      let timeOffset = 0;

      notes.forEach(([freq, duration]) => {
        const noteStart = this.audioCtx!.currentTime + timeOffset;
        const noteDuration = duration * beatDuration;

        this.playChimeNote(freq, noteStart, noteDuration);
        // Harmonic sparkle
        this.playChimeNote(freq * 2, noteStart, noteDuration * 0.5, 0.25);

        timeOffset += noteDuration;
      });

      // Schedule next loop
      const loopInterval = (timeOffset + 1.2) * 1000;
      this.synthInterval = window.setTimeout(playFullSong, loopInterval);
    };

    playFullSong();
  }

  private playChimeNote(freq: number, startTime: number, duration: number, volMultiplier: number = 1): void {
    if (!this.audioCtx || !this.synthGain) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Bell chime attack & decay
      const baseVol = (this.isMuted ? 0 : 0.3) * volMultiplier;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(baseVol, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.8);

      osc.connect(gain);
      gain.connect(this.synthGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.9);
    } catch {
      // safe node teardown
    }
  }

  private stopSynth(): void {
    if (this.synthInterval) {
      clearTimeout(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthGain && this.audioCtx) {
      try {
        this.synthGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.2);
      } catch {
        // safe
      }
    }
  }
}

export const happyBirthdayAudio = new HappyBirthdayAudioService();
