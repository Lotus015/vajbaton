// types.ts
export type BodyDef = {
  id: string;
  x: number; // top-left x
  y: number; // top-left y
  w: number; // width
  h: number; // height
};

// Tutorial pieces (level 0)
export const tutorialPieces: BodyDef[] = [
  { id: 'header', x: 350, y: 200, w: 500, h: 100 },
  { id: 'button', x: 450, y: 350, w: 200, h: 80 },
];

// Level 1: Newsletter Card pieces
export const level1Pieces: BodyDef[] = [
  { id: 'icon', x: 320, y: 170, w: 48, h: 48 },
  { id: 'title', x: 320, y: 240, w: 360, h: 60 },
  { id: 'subtitle', x: 320, y: 320, w: 360, h: 40 },
  { id: 'email-input', x: 320, y: 380, w: 240, h: 48 },
  { id: 'subscribe-btn', x: 580, y: 380, w: 100, h: 48 },
  { id: 'privacy-note', x: 320, y: 450, w: 360, h: 30 },
];

// Level 2: Two-Column Feature Section pieces
export const level2Pieces: BodyDef[] = [
  { id: 'heading', x: 240, y: 150, w: 260, h: 60 },
  { id: 'bullet-1', x: 240, y: 230, w: 260, h: 40 },
  { id: 'bullet-2', x: 240, y: 290, w: 260, h: 40 },
  { id: 'bullet-3', x: 240, y: 350, w: 260, h: 40 },
  { id: 'learn-more-btn', x: 240, y: 420, w: 140, h: 48 },
  { id: 'hero-image', x: 540, y: 200, w: 220, h: 280 },
  { id: 'decorative-accent', x: 450, y: 180, w: 60, h: 60 },
];

// Legacy export for backward compatibility
export const pieces = tutorialPieces;
