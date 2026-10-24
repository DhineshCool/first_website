import React, { useEffect, useRef } from 'react';

interface FireworksCanvasProps {
  isActive: boolean;
  isMuted?: boolean;
}

// Spatial 3D Fireworks Audio Engine with decoded samples and procedural fallback
class FireworkSoundManager {
  private audioCtx: AudioContext | null = null;
  private burstBuffers: AudioBuffer[] = [];
  private whistleBuffer: AudioBuffer | null = null;
  private isLoaded = false;
  private lastPlayTime = 0;
  private isMuted = false;

  constructor(muted: boolean = false) {
    this.isMuted = muted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public init() {
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();
      this.loadSounds();
    } catch (e) {
      console.warn('Web Audio initialization note:', e);
    }
  }

  private async loadSounds() {
    if (!this.audioCtx) return;
    const urls = [
      '/audio/firework_burst_1.mp3',
      '/audio/firework_burst_2.mp3',
      '/audio/firework_burst_3.mp3',
    ];

    try {
      const promises = urls.map(async (url) => {
        const resp = await fetch(url);
        const arrayBuf = await resp.arrayBuffer();
        return await this.audioCtx!.decodeAudioData(arrayBuf);
      });
      this.burstBuffers = await Promise.all(promises);

      const whistleResp = await fetch('/audio/firework_whistle.mp3');
      const whistleBuf = await whistleResp.arrayBuffer();
      this.whistleBuffer = await this.audioCtx.decodeAudioData(whistleBuf);

      this.isLoaded = true;
    } catch {
      // Procedural synthesis fallback is seamlessly active
      this.isLoaded = false;
    }
  }

  public playExplosion(x: number) {
    if (this.isMuted) return;
    const now = performance.now();
    // Rate limit to prevent sound clipping during simultaneous cluster explosions
    if (now - this.lastPlayTime < 80) return;
    this.lastPlayTime = now;

    if (!this.audioCtx) {
      this.init();
    }
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    const pan = Math.max(-0.85, Math.min(0.85, (x / (window.innerWidth || 1000)) * 2 - 1));

    if (this.isLoaded && this.burstBuffers.length > 0) {
      try {
        const buffer = this.burstBuffers[Math.floor(Math.random() * this.burstBuffers.length)];
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = 0.92 + Math.random() * 0.16;

        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.32 + Math.random() * 0.1;

        if (this.audioCtx.createStereoPanner) {
          const panner = this.audioCtx.createStereoPanner();
          panner.pan.value = pan;
          source.connect(gain);
          gain.connect(panner);
          panner.connect(this.audioCtx.destination);
        } else {
          source.connect(gain);
          gain.connect(this.audioCtx.destination);
        }
        source.start();
        return;
      } catch {
        // Fall back to synth below
      }
    }

    // Procedural synthesis fallback
    this.playProceduralExplosion(pan);
  }

  public playWhistle(x: number) {
    if (this.isMuted || !this.audioCtx || this.audioCtx.state === 'suspended') return;
    if (this.isLoaded && this.whistleBuffer) {
      try {
        const source = this.audioCtx.createBufferSource();
        source.buffer = this.whistleBuffer;
        source.playbackRate.value = 0.94 + Math.random() * 0.14;
        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.12;

        const pan = Math.max(-0.8, Math.min(0.8, (x / (window.innerWidth || 1000)) * 2 - 1));
        if (this.audioCtx.createStereoPanner) {
          const panner = this.audioCtx.createStereoPanner();
          panner.pan.value = pan;
          source.connect(gain);
          gain.connect(panner);
          panner.connect(this.audioCtx.destination);
        } else {
          source.connect(gain);
          gain.connect(this.audioCtx.destination);
        }
        source.start();
      } catch {
        // safe
      }
    }
  }

  private playProceduralExplosion(pan: number) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    try {
      // 1. Resonant Bass Thump
      const osc = ctx.createOscillator();
      const boomGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.32);

      boomGain.gain.setValueAtTime(0.38, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(boomGain);

      // 2. High Frequency Sparkling Crackle
      const bufferSize = Math.floor(ctx.sampleRate * 0.45);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600 + Math.random() * 600, now);
      filter.Q.setValueAtTime(3.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.24, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);

      // Master output
      const master = ctx.createGain();
      master.gain.value = 0.35;
      boomGain.connect(master);
      noiseGain.connect(master);

      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.value = pan;
        master.connect(panner);
        panner.connect(ctx.destination);
      } else {
        master.connect(ctx.destination);
      }

      osc.start(now);
      whiteNoise.start(now);
      osc.stop(now + 0.65);
      whiteNoise.stop(now + 0.45);
    } catch {
      // safe
    }
  }

  public dispose() {
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close().catch(() => {});
      } catch {
        // safe
      }
      this.audioCtx = null;
    }
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
  trail: { x: number; y: number }[];
  isSparkle?: boolean;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  trail: { x: number; y: number }[];
}

const CELEBRATION_COLORS = [
  '#FF1493', // Deep Pink
  '#F49CB4', // Soft Pastel Pink
  '#801336', // Maroon
  '#FFD700', // Gold
  '#FFA500', // Amber Orange
  '#E056FD', // Purple/Violet
  '#FF6B81', // Rose
  '#2ED573', // Emerald Sparkle
  '#70A1FF', // Celestial Blue
  '#FFFDF9', // Starlight White
];

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({
  isActive,
  isMuted = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const soundManagerRef = useRef<FireworkSoundManager | null>(null);

  // Sync mute state dynamically
  useEffect(() => {
    if (soundManagerRef.current) {
      soundManagerRef.current.setMuted(isMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize 3D firework sound engine
    const sound = soundManagerRef.current || new FireworkSoundManager(isMuted);
    sound.setMuted(isMuted);
    sound.init();
    soundManagerRef.current = sound;

    let animationFrameId: number;
    let launchInterval: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const rockets: Rocket[] = [];
    const particles: Particle[] = [];

    const createExplosion = (x: number, y: number, baseColor: string) => {
      // Play spatial burst sound effect with stereo panning
      sound.playExplosion(x);

      // 50-70 sparkles per explosion
      const particleCount = 55 + Math.floor(Math.random() * 25);
      const isHeart = Math.random() < 0.25; // 25% chance of a heart-shaped firework burst!

      for (let i = 0; i < particleCount; i++) {
        let vx: number;
        let vy: number;

        if (isHeart) {
          // Heart curve parametric formula: x = 16 sin^3(t), y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))
          const t = (i / particleCount) * Math.PI * 2;
          const speed = (0.2 + Math.random() * 0.15);
          vx = 16 * Math.pow(Math.sin(t), 3) * speed * 0.28;
          vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * speed * 0.28;
        } else {
          // Radial sphere explosion
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 4.5;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        }

        // Color variation for shimmer
        const color = Math.random() < 0.25 ? '#FFFDF9' : baseColor;

        particles.push({
          x,
          y,
          vx,
          vy,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.016,
          color,
          size: 1.8 + Math.random() * 2.2,
          gravity: 0.065,
          trail: [],
          isSparkle: Math.random() < 0.35,
        });
      }
    };

    const launchRocket = (startX?: number, targetApexY?: number, colorChoice?: string) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = startX !== undefined ? startX : width * (0.15 + Math.random() * 0.7);
      const targetY = targetApexY !== undefined ? targetApexY : height * (0.15 + Math.random() * 0.45);
      const vy = - (9 + Math.random() * 3.5);
      const color = colorChoice || CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)];

      // 35% chance to play gentle ascending launch whistle
      if (Math.random() < 0.35) {
        sound.playWhistle(x);
      }

      rockets.push({
        x,
        y: height,
        vx: (Math.random() - 0.5) * 2,
        vy,
        targetY,
        color,
        trail: [],
      });
    };

    // Immediate Grand Opening Salvo (4 simultaneous bursts across the sky!)
    const triggerSalvo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Left, Center-Left, Center-Right, Right bursts
      createExplosion(width * 0.25, height * 0.35, '#FFD700');
      createExplosion(width * 0.75, height * 0.35, '#F49CB4');
      setTimeout(() => {
        createExplosion(width * 0.5, height * 0.25, '#801336');
        createExplosion(width * 0.15, height * 0.45, '#FF6B81');
        createExplosion(width * 0.85, height * 0.45, '#FFA500');
      }, 350);
    };

    triggerSalvo();

    // Continuous launches every 450-800ms
    launchInterval = window.setInterval(() => {
      launchRocket();
      if (Math.random() > 0.6) {
        setTimeout(() => launchRocket(), 180);
      }
    }, 600);

    // Animation Loop
    const loop = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Soft clear for natural fireworks motion trails
      ctx.clearRect(0, 0, width, height);

      // Update and draw rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.08; // upward deceleration

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 5) r.trail.shift();

        // Draw rocket head & glowing trail
        ctx.beginPath();
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 8;
        if (r.trail.length > 1) {
          ctx.moveTo(r.trail[0].x, r.trail[0].y);
          for (let k = 1; k < r.trail.length; k++) {
            ctx.lineTo(r.trail[k].x, r.trail[k].y);
          }
          ctx.stroke();
        }

        // Check if rocket reached its apex
        if (r.y <= r.targetY || r.vy >= -1) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update and draw explosion particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 4) p.trail.shift();

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.isSparkle ? 12 : 6;

        // Sparkle shimmer
        const flicker = p.isSparkle && Math.random() < 0.4 ? 1.5 : 1.0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * flicker, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Particle trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.7;
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let k = 1; k < p.trail.length; k++) {
            ctx.lineTo(p.trail[k].x, p.trail[k].y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(launchInterval);
      cancelAnimationFrame(animationFrameId);
      sound.dispose();
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ display: 'block' }}
    />
  );
};
