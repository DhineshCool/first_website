import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, X, Heart, Feather } from 'lucide-react';
import { EnvelopeState } from '../types';

interface LetterEnvelopeProps {
  onOpenLetter?: () => void;
  recipientName?: string;
  senderName?: string;
}

export const LetterEnvelope: React.FC<LetterEnvelopeProps> = ({
  onOpenLetter,
  recipientName = 'Dearest One',
  senderName = 'With all our love & admiration',
}) => {
  const [state, setState] = useState<EnvelopeState>('sealed');

  const handleOpenEnvelope = () => {
    if (state === 'sealed') {
      onOpenLetter?.();
      setState('opening');
      setTimeout(() => {
        setState('unfolded');
      }, 700);
    }
  };

  const handleCloseLetter = () => {
    setState('sealed');
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto py-16 px-4 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold uppercase tracking-wider mb-3"
        >
          <Mail className="w-3.5 h-3.5" />
          A Personal Handwritten Epistle
        </motion.div>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-tprimary tracking-tight">
          An Unfolding Love Letter
        </h2>
        <p className="mt-3 text-tmuted text-sm sm:text-base max-w-md mx-auto">
          Tap the crimson wax seal to break the seal and read the heartfelt message penned just for you.
        </p>
      </div>

      {/* 3D Envelope Container */}
      <div className="relative w-full max-w-md perspective-1000 flex flex-col items-center justify-center">
        {/* Resting Envelope */}
        <div className="relative w-full aspect-[16/11] max-w-[380px] sm:max-w-[420px] rounded-2xl bg-surface border border-white/10 shadow-2xl p-2 preserve-3d overflow-hidden">
          {/* Subtle envelope texture / gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface-light/40 via-surface/90 to-surface pointer-events-none" />

          {/* Envelope Pocket Body (Bottom Fold) */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-slate-900/90 border-t border-white/10 rounded-b-xl flex items-center justify-center z-10 shadow-inner">
            <div className="flex flex-col items-center opacity-40 text-xs text-tmuted tracking-widest font-heading uppercase">
              <span>Private & Confidential</span>
              <span>For Your Eyes Only</span>
            </div>
          </div>

          {/* Letter Peek-Through inside pocket */}
          <motion.div
            animate={{
              y: state === 'opening' || state === 'unfolded' ? -40 : 0,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-x-8 top-12 h-36 bg-[#fdfaf2] rounded-t-lg shadow-md flex flex-col p-4 opacity-95 z-[5]"
          >
            <div className="w-16 h-1.5 bg-slate-300 rounded-full mb-2" />
            <div className="w-full h-1 bg-slate-200 rounded-full mb-1.5" />
            <div className="w-4/5 h-1 bg-slate-200 rounded-full mb-1.5" />
            <div className="w-3/5 h-1 bg-slate-200 rounded-full" />
          </motion.div>

          {/* Envelope Left & Right Fold Overlays */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <svg viewBox="0 0 420 280" className="w-full h-full" preserveAspectRatio="none">
              {/* Left flap */}
              <polygon points="0,0 210,150 0,280" fill="#131B2E" opacity="0.9" />
              {/* Right flap */}
              <polygon points="420,0 210,150 420,280" fill="#182239" opacity="0.9" />
              {/* Bottom triangular flap */}
              <polygon points="0,280 210,150 420,280" fill="#1a253d" opacity="0.95" />
            </svg>
          </div>

          {/* 3D Top Flap that Flips Back (-180deg) */}
          <motion.div
            style={{ originY: '0%' }}
            animate={{
              rotateX: state === 'sealed' ? 0 : -170,
              zIndex: state === 'sealed' ? 20 : 2,
            }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 top-0 h-1/2 preserve-3d"
          >
            <svg viewBox="0 0 420 140" className="w-full h-full filter drop-shadow-lg" preserveAspectRatio="none">
              <polygon points="0,0 210,140 420,0" fill="#1e2a47" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </svg>
          </motion.div>

          {/* The Wax Seal Button */}
          {state === 'sealed' && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenEnvelope}
              className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-red-900 border-2 border-rose-400/40 shadow-wax-seal flex flex-col items-center justify-center cursor-pointer group"
              title="Break Wax Seal to Read"
            >
              <div className="absolute inset-1 rounded-full border border-dashed border-rose-300/40 pointer-events-none" />
              <Heart className="w-6 h-6 text-rose-100 fill-rose-200/40 drop-shadow group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-heading tracking-wider uppercase text-rose-100/90 font-bold mt-0.5">
                Open
              </span>
            </motion.button>
          )}
        </div>

        {/* Action Button Below Envelope */}
        {state === 'sealed' && (
          <button
            onClick={handleOpenEnvelope}
            className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase text-accent-secondary bg-accent-secondary/10 border border-accent-secondary/30 hover:bg-accent-secondary/20 transition-all shadow-glow-amber"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tap Seal to Unfold Epistle
          </button>
        )}
      </div>

      {/* Fullscreen Unfolded Letter Modal Sheet with Caveat Handwriting */}
      <AnimatePresence>
        {state === 'unfolded' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md">
            {/* Backdrop click closes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseLetter}
              className="absolute inset-0"
            />

            {/* The Unfolded Paper Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-[#FFFDF7] text-slate-800 rounded-3xl p-7 sm:p-10 shadow-2xl border-4 border-[#F5E6CC] z-10"
              style={{
                backgroundImage: `radial-gradient(#E8D5B5 0.75px, transparent 0.75px)`,
                backgroundSize: '24px 24px',
              }}
            >
              {/* Close Button Top Right */}
              <button
                onClick={handleCloseLetter}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors shadow-sm"
                aria-label="Close letter"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Quill Header */}
              <div className="flex items-center gap-2 text-rose-700 font-heading text-xs uppercase tracking-widest mb-4">
                <Feather className="w-4 h-4" />
                <span>Penned From the Heart</span>
              </div>

              {/* Salutation */}
              <h3 className="font-handwriting text-3xl sm:text-4xl text-rose-800 font-bold mb-4">
                {recipientName},
              </h3>

              {/* Letter Body in Caveat Handwriting */}
              <div className="font-handwriting text-xl sm:text-2xl text-slate-800 leading-relaxed space-y-4">
                <p>
                  Today isn’t just an ordinary calendar flip; it’s an ode to the light, compassion, and effortless joy you bring into everyone’s orbit.
                </p>
                <p>
                  From spontaneous roadtrips to late-night conversations where time completely stopped, every single moment shared with you feels like pure serendipity. You have that rare gift of making people believe in themselves a little more just by being near you.
                </p>
                <p>
                  As you embark on this grand new chapter, may your road be paved with triumphs, your courage never waver, and your smile remain as radiant as ever. Keep dreaming fearlessly—the world is so much better with you in it.
                </p>
              </div>

              {/* Closing & Signature */}
              <div className="mt-8 pt-6 border-t border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-900">
                    Always & Forever,
                  </div>
                  <div className="font-handwriting text-xl sm:text-2xl text-slate-600">
                    {senderName}
                  </div>
                </div>

                {/* Commemorative Wax Stamp in Letter footer */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                  <span>Sealed With Eternal Love</span>
                </div>
              </div>

              {/* Fold back button inside modal footer */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleCloseLetter}
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-sans text-xs font-semibold tracking-wide uppercase transition-all shadow-md"
                >
                  Fold & Put Away Letter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
