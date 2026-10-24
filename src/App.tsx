import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScreenState } from './types';
import { StartingCountdownScreen } from './components/StartingCountdownScreen';
import { PasscodeScreen } from './components/PasscodeScreen';
import { CountdownScreen } from './components/CountdownScreen';
import { CakeCalendarScreen } from './components/CakeCalendarScreen';
import { GiftPromptScreen } from './components/GiftPromptScreen';
import { GiftHubScreen } from './components/GiftHubScreen';
import { MusicCardGift } from './components/MusicCardGift';
import { BouquetBuilderGift } from './components/BouquetBuilderGift';
import { LoveLetterGift } from './components/LoveLetterGift';
import { ScrapbookLayout } from './components/ScrapbookLayout';
import { FloatingMemoryPhotos } from './components/FloatingMemoryPhotos';

// Screen sequence for directional sliding (forward vs backward)
const SCREEN_ORDER: Record<ScreenState, number> = {
  BIRTHDAY_COUNTDOWN: 0,
  LOCK: 1,
  COUNTDOWN: 2,
  CAKE: 3,
  PROMPT_GIFT: 4,
  REJECT_GIFT: 4.5,
  GIFT_HUB: 5,
  GIFT_MUSIC: 6,
  GIFT_BOUQUET: 6,
  GIFT_LETTER: 6,
};

// Smooth scrapbook page-turn variants with 3D perspective and velvety cubic-bezier deceleration
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 42 : -42,
    opacity: 0,
    scale: 0.96,
    rotateY: direction > 0 ? 4 : -4,
    filter: 'blur(6px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1], // Velvety smooth Apple-style easeOut
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -42 : 42,
    opacity: 0,
    scale: 0.96,
    rotateY: direction > 0 ? -4 : 4,
    filter: 'blur(6px)',
    transition: {
      duration: 0.35,
      ease: [0.32, 0, 0.67, 0], // Smooth acceleration into exit
    },
  }),
};

export const App: React.FC = () => {
  const [screenState, setScreenState] = useState<ScreenState>('BIRTHDAY_COUNTDOWN');
  const [direction, setDirection] = useState<number>(1);
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);

  // Clear any legacy session flag on mount so every run starts clean
  useEffect(() => {
    try {
      sessionStorage.removeItem('hebziba_candles_blown');
    } catch {
      // safe
    }
  }, []);

  const navigateTo = (nextState: ScreenState) => {
    const currentOrder = SCREEN_ORDER[screenState] ?? 0;
    const nextOrder = SCREEN_ORDER[nextState] ?? 0;
    setDirection(nextOrder >= currentOrder ? 1 : -1);
    setScreenState(nextState);
  };

  const handleCandlesBlown = () => {
    setCandlesBlown(true);
  };

  // Handle navigation transitions
  const handleEnterPasscode = () => {
    setCandlesBlown(false);
    navigateTo('LOCK');
  };
  const handleBackToCountdown = () => {
    setCandlesBlown(false);
    navigateTo('BIRTHDAY_COUNTDOWN');
  };
  const handlePasscodeSuccess = () => {
    setCandlesBlown(false);
    navigateTo('COUNTDOWN');
  };
  const handleCountdownComplete = () => navigateTo('CAKE');
  const handleCakeContinue = () => navigateTo('PROMPT_GIFT');
  const handleAcceptGift = () => navigateTo('GIFT_HUB');
  const handleRejectGift = () => navigateTo('REJECT_GIFT');
  const handleTryAgain = () => navigateTo('PROMPT_GIFT');

  // Gift selections
  const handleSelectMusic = () => navigateTo('GIFT_MUSIC');
  const handleSelectBouquet = () => navigateTo('GIFT_BOUQUET');
  const handleSelectLetter = () => navigateTo('GIFT_LETTER');

  // Back button navigation (screens after Candle view)
  const handleBack = () => {
    switch (screenState) {
      case 'LOCK':
        navigateTo('BIRTHDAY_COUNTDOWN');
        break;
      case 'GIFT_MUSIC':
      case 'GIFT_BOUQUET':
      case 'GIFT_LETTER':
        navigateTo('GIFT_HUB');
        break;
      case 'GIFT_HUB':
        navigateTo('PROMPT_GIFT');
        break;
      case 'REJECT_GIFT':
        navigateTo('PROMPT_GIFT');
        break;
      case 'PROMPT_GIFT':
        navigateTo('CAKE');
        break;
      default:
        break;
    }
  };

  // Whether the back button should appear
  const showBackButton = [
    'LOCK',
    'PROMPT_GIFT',
    'REJECT_GIFT',
    'GIFT_HUB',
    'GIFT_MUSIC',
    'GIFT_BOUQUET',
    'GIFT_LETTER',
  ].includes(screenState);

  return (
    <ScrapbookLayout showBackButton={showBackButton} onBack={handleBack}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={screenState}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full flex flex-col items-center justify-center relative z-20 preserve-3d"
        >
          {screenState === 'BIRTHDAY_COUNTDOWN' && (
            <StartingCountdownScreen
              onEnterPasscode={handleEnterPasscode}
              targetDate="2026-10-27T00:00:00"
              recipientName="Hebziba"
            />
          )}

          {screenState === 'LOCK' && (
            <PasscodeScreen
              correctPasscode="2710"
              onSuccess={handlePasscodeSuccess}
              onBackToCountdown={handleBackToCountdown}
            />
          )}

          {screenState === 'COUNTDOWN' && (
            <CountdownScreen onComplete={handleCountdownComplete} />
          )}

          {screenState === 'CAKE' && (
            <CakeCalendarScreen
              onContinue={handleCakeContinue}
              targetDay={27}
              monthName="October"
              onCandlesBlown={handleCandlesBlown}
              alreadyBlown={candlesBlown}
            />
          )}

          {screenState === 'PROMPT_GIFT' && (
            <GiftPromptScreen
              isRejectedView={false}
              onAccept={handleAcceptGift}
              onReject={handleRejectGift}
              onTryAgain={handleTryAgain}
            />
          )}

          {screenState === 'REJECT_GIFT' && (
            <GiftPromptScreen
              isRejectedView={true}
              onAccept={handleAcceptGift}
              onReject={handleRejectGift}
              onTryAgain={handleTryAgain}
            />
          )}

          {screenState === 'GIFT_HUB' && (
            <GiftHubScreen
              onSelectMusic={handleSelectMusic}
              onSelectBouquet={handleSelectBouquet}
              onSelectLetter={handleSelectLetter}
            />
          )}

          {screenState === 'GIFT_MUSIC' && <MusicCardGift />}

          {screenState === 'GIFT_BOUQUET' && <BouquetBuilderGift />}

          {screenState === 'GIFT_LETTER' && <LoveLetterGift />}
        </motion.div>
      </AnimatePresence>
      {/* Ambient background photos reveal strictly after candles are blown; blur on letter, melody, and floral boom pages */}
      {candlesBlown && (
        <FloatingMemoryPhotos
          isBlurred={
            screenState === 'GIFT_LETTER' ||
            screenState === 'GIFT_MUSIC' ||
            screenState === 'GIFT_BOUQUET'
          }
        />
      )}
    </ScrapbookLayout>
  );
};

export default App;

