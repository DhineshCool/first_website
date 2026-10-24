import React, { useRef, useState } from 'react';
import { PhysicsLayer } from './components/PhysicsLayer';
import { CountdownHero } from './components/CountdownHero';
import { MemoryLane } from './components/MemoryLane';
import { LetterEnvelope } from './components/LetterEnvelope';
import { CandleCake } from './components/CandleCake';
import { AudioController } from './components/AudioController';
import { fallbackMemories } from './data/memories';
import { Sparkles, Heart, Gift, ArrowUp } from 'lucide-react';

export const App: React.FC = () => {
  const [audioTrigger, setAudioTrigger] = useState(false);
  const memorySectionRef = useRef<HTMLDivElement | null>(null);
  const envelopeSectionRef = useRef<HTMLDivElement | null>(null);
  const cakeSectionRef = useRef<HTMLDivElement | null>(null);

  // Set default target date: 2026-11-15T00:00:00 as suggested in the SPEC
  const targetDate = '2026-11-15T00:00:00';
  const recipientName = 'Alex';

  const handleStartAudio = () => {
    setAudioTrigger(true);
  };

  const scrollToMemories = () => {
    memorySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-background text-tprimary selection:bg-accent-primary selection:text-white overflow-hidden">
      {/* 1. Ambient Zero-Gravity Physics Floating Canvas in Background */}
      <PhysicsLayer className="z-0 pointer-events-auto" particleCount={22} />

      {/* Top Subtle Floating Nav / Brand */}
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/60 border-b border-white/5 transition-all">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-primary to-accent-highlight flex items-center justify-center shadow-glow-rose">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-base sm:text-lg tracking-wide bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              Tribute for {recipientName}
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-tmuted">
            <button
              onClick={() => memorySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all"
            >
              Memories
            </button>
            <button
              onClick={() => envelopeSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all"
            >
              Letter
            </button>
            <button
              onClick={() => cakeSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-full text-accent-primary hover:bg-accent-primary/10 transition-all font-semibold flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Make a Wish</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Page Layout Container (Max 1100px with responsive padding) */}
      <main className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-12 sm:gap-20">
        {/* 2. Countdown Entry Hero Section */}
        <CountdownHero
          targetDate={targetDate}
          recipientName={recipientName}
          onEnterExperience={handleStartAudio}
          onScrollToExplore={scrollToMemories}
        />

        {/* 3. Interactive Polaroid Memory Scrapbook */}
        <div ref={memorySectionRef} className="scroll-mt-20">
          <MemoryLane memories={fallbackMemories} />
        </div>

        {/* 4. Digital 3D Skeuomorphic Unfolding Letter Envelope */}
        <div ref={envelopeSectionRef} className="scroll-mt-20">
          <LetterEnvelope
            recipientName={recipientName}
            senderName="Your Lifelong Friends & Admirers"
            onOpenLetter={handleStartAudio}
          />
        </div>

        {/* 5. Virtual Interactive Birthday Cake & Candle Climax */}
        <div ref={cakeSectionRef} className="scroll-mt-20">
          <CandleCake onBlowOut={handleStartAudio} />
        </div>
      </main>

      {/* 6. Sticky Floating Audio Controller Pill */}
      <AudioController
        autoPlayTrigger={audioTrigger}
        onAudioStarted={() => setAudioTrigger(true)}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20 py-12 px-4 sm:px-6 text-center text-xs text-tmuted backdrop-blur-sm bg-background/50">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent-primary fill-accent-primary" />
            <span>Crafted with infinite affection & antigravity physics</span>
          </div>

          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} Alex’s Celestial Birthday</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-300 hover:text-accent-primary transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
