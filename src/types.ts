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

// Level 3: Navbar + Hero + Footer pieces (formerly Level 4)
export const level3Pieces: BodyDef[] = [
  // Navbar pieces (no background)
  { id: 'logo', x: 40, y: 20, w: 120, h: 40 },
  { id: 'nav-link-1', x: 300, y: 25, w: 80, h: 30 },
  { id: 'nav-link-2', x: 400, y: 25, w: 80, h: 30 },
  { id: 'nav-link-3', x: 500, y: 25, w: 80, h: 30 },
  
  // Hero section pieces (no background)
  { id: 'hero-heading', x: 200, y: 180, w: 600, h: 80 },
  { id: 'hero-subheading', x: 250, y: 280, w: 500, h: 40 },
  { id: 'get-started-btn', x: 300, y: 350, w: 140, h: 50 },
  { id: 'view-demo-btn', x: 460, y: 350, w: 140, h: 50 },
  { id: 'hero-illustration', x: 650, y: 150, w: 280, h: 280 },
  
  // Footer pieces (no background)
  { id: 'footer-column-1', x: 100, y: 620, w: 200, h: 60 },
  { id: 'footer-column-2', x: 350, y: 620, w: 200, h: 60 },
  { id: 'social-icon-1', x: 700, y: 630, w: 40, h: 40 },
  { id: 'social-icon-2', x: 760, y: 630, w: 40, h: 40 },
  { id: 'social-icon-3', x: 820, y: 630, w: 40, h: 40 },
];

// Level 4: Interactive Form Modal pieces - simplified to just form elements
export const level4Pieces: BodyDef[] = [
  // Special neon header that swings
  { id: 'neon-header', x: 150, y: 20, w: 700, h: 50 },
  
  // Base page elements
  { id: 'page-header', x: 150, y: 90, w: 700, h: 40 },
  { id: 'feature-card-1', x: 100, y: 150, w: 180, h: 120 },
  { id: 'feature-card-2', x: 310, y: 150, w: 180, h: 120 },
  { id: 'feature-card-3', x: 520, y: 150, w: 180, h: 120 },
  
  // Form elements only - positioned in center
  { id: 'modal-title', x: 300, y: 320, w: 300, h: 40 },
  { id: 'name-input', x: 300, y: 380, w: 300, h: 40 },
  { id: 'email-input', x: 300, y: 430, w: 300, h: 40 },
  { id: 'password-input', x: 300, y: 480, w: 300, h: 40 },
  { id: 'submit-btn', x: 300, y: 530, w: 140, h: 40 },
  { id: 'cancel-btn', x: 460, y: 530, w: 140, h: 40 },
];

// Level 5: The "Easy" Level - single button with anti-gravity
export const level5Pieces: BodyDef[] = [
  { id: 'easy-button', x: 450, y: 275, w: 160, h: 60 }, // Centered button
];

// Central source of truth for all levels
export const allLevels = [
  { 
    id: 0, 
    name: 'Tutorial', 
    description: 'Build Something Vibeable', 
    pieces: tutorialPieces 
  },
  { 
    id: 1, 
    name: 'Level 1', 
    description: 'Newsletter Card', 
    pieces: level1Pieces 
  },
  { 
    id: 2, 
    name: 'Level 2', 
    description: 'Feature Section', 
    pieces: level2Pieces 
  },
  { 
    id: 3, 
    name: 'Level 3', 
    description: 'Navbar + Hero + Footer', 
    pieces: level3Pieces 
  },
  { 
    id: 4, 
    name: 'Level 4', 
    description: 'Interactive Form Modal', 
    pieces: level4Pieces 
  },
  { 
    id: 5, 
    name: 'Level 5', 
    description: 'The "Easy" Level', 
    pieces: level5Pieces 
  },
];

// Legacy export for backward compatibility
export const pieces = tutorialPieces;
