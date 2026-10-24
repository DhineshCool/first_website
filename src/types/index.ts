export interface MemoryItem {
  id: string;
  imageUrl: string;
  title: string;
  dateText: string;
  caption: string;
  rotationDeg: number; // e.g. -4 to 4 for organic polaroid scatter
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
