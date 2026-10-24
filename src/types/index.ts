export type ScreenState =
  | 'BIRTHDAY_COUNTDOWN'
  | 'LOCK'
  | 'COUNTDOWN'
  | 'CAKE'
  | 'PROMPT_GIFT'
  | 'REJECT_GIFT'
  | 'GIFT_HUB'
  | 'GIFT_MUSIC'
  | 'GIFT_BOUQUET'
  | 'GIFT_LETTER';

export interface FlowerOption {
  id: string;
  name: string;
  colorName: string;
  emoji: string;
  svgColor: string;
  accentColor: string;
  symbolism: string;
}

export interface PolaroidPhoto {
  id: string;
  caption: string;
  dateText: string;
  rotation: number;
  imageUrl: string;
}

export interface MemoryItem {
  id: string;
  imageUrl: string;
  title: string;
  dateText: string;
  caption: string;
  rotationDeg: number;
  location?: string;
  story?: string;
}

export type EnvelopeState = 'sealed' | 'opening' | 'unfolded';

export interface CountdownTimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}
