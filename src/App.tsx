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

export const App: React.FC = () => {
  const [screenState, setScreenState] = useState<ScreenState>('BIRTHDAY_COUNTDOWN');
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);

  // Clear any legacy session flag on mount so every run starts clean
  useEffect(() => {
    try {
      sessionStorage.removeItem('hebziba_candles_blown');
    } catch {
      // safe
    }
  }, []);

  const handleCandlesBlown = () => {
    setCandlesBlown(true);
  };

  // Handle navigation transitions
  const handleEnterPasscode = () => {
    setCandlesBlown(false);
    setScreenState('LOCK');
  };
  const handleBackToCountdown = () => {
    setCandlesBlown(false);
    setScreenState('BIRTHDAY_COUNTDOWN');
  };
  const handlePasscodeSuccess = () => {
    setCandlesBlown(false);
    setScreenState('COUNTDOWN');
  };
  const handleCountdownComplete = () => setScreenState('CAKE');
  const handleCakeContinue = () => setScreenState('PROMPT_GIFT');
  const handleAcceptGift = () => setScreenState('GIFT_HUB');
  const handleRejectGift = () => setScreenState('REJECT_GIFT');
  const handleTryAgain = () => setScreenState('PROMPT_GIFT');

  // Gift selections
  const handleSelectMusic = () => setScreenState('GIFT_MUSIC');
  const handleSelectBouquet = () => setScreenState('GIFT_BOUQUET');
  const handleSelectLetter = () => setScreenState('GIFT_LETTER');

  // Back button navigation (screens after Candle view)
  const handleBack = () => {
    switch (screenState) {
      case 'GIFT_MUSIC':
      case 'GIFT_BOUQUET':
      case 'GIFT_LETTER':
        setScreenState('GIFT_HUB');
        break;
      case 'GIFT_HUB':
        setScreenState('PROMPT_GIFT');
        break;
      case 'REJECT_GIFT':
        setScreenState('PROMPT_GIFT');
        break;
      case 'PROMPT_GIFT':
        setScreenState('CAKE');
        break;
      default:
        break;
    }
  };

  // Whether the back button should appear
  // "Render a pill button '← Back' at top-left on all screens after the Candle view."
  const showBackButton = [
    'PROMPT_GIFT',
    'REJECT_GIFT',
    'GIFT_HUB',
    'GIFT_MUSIC',
    'GIFT_BOUQUET',
    'GIFT_LETTER',
  ].includes(screenState);

  // If on LOCK screen, render without the scrapbook frame
  if (screenState === 'LOCK') {
    return (
      <PasscodeScreen
        correctPasscode="2710"
        onSuccess={handlePasscodeSuccess}
        onBackToCountdown={handleBackToCountdown}
      />
    );
  }

  return (
    <ScrapbookLayout showBackButton={showBackButton} onBack={handleBack}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screenState}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="w-full flex flex-col items-center justify-center relative z-20"
        >
          {screenState === 'BIRTHDAY_COUNTDOWN' && (
            <StartingCountdownScreen
              onEnterPasscode={handleEnterPasscode}
              targetDate="2026-10-27T00:00:00"
              recipientName="Hebziba"
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
      {/* Ambient background photos reveal strictly after candles are blown */}
      {candlesBlown && <FloatingMemoryPhotos />}
    </ScrapbookLayout>
  );
};

export default App;
