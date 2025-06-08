# Product Requirements Document (PRD)

---

## 1. Project Overview

**Name**: SynthWave Rebuild  
**Description**:  
A browser-based "break & rebuild" puzzle game where users watch a synthwave-themed UI fall apart under physics, then drag-and-drop pieces back into place. Each level presents a common web-UI layout (cards, navbars, dashboards) rendered with a glowing neon aesthetic. At the end of each level, players submit their time to a global leaderboard.

---

## 2. Goals & Objectives

- **Engagement**: Create a simple, addictive mechanics loop—break UI, rebuild under time pressure.  
- **Visual Impact**: Leverage a black & neon synthwave theme for immediate visual appeal.  
- **Competition**: Track completion times and foster rivalry via a real-time leaderboard.  
- **Hackathon Fit**: Rapid build with mostly zero-config, free-tier services and frameworks.

---

## 3. Target Audience

- Front-end developers and designers looking for a quick, nostalgic game.  
- Hackathon judges seeking polished UI/UX and creative use of physics.  
- Casual puzzle enthusiasts interested in drag-and-drop mechanics.

---

## 4. User Stories

1. **As a player**, I want to see an intact neon UI and a "Break Everything" button so I can start the puzzle.  
2. **As a player**, I want pieces to fall with realistic physics so the effect feels satisfying.  
3. **As a player**, I want to drag pieces back to their original spots and see them snap home.  
4. **As a player**, I want a timer and "Pieces Left" counter so I know my progress.  
5. **As a player**, I want to submit my time and see a leaderboard of top performers.

---

## 5. Features & Requirements

| Feature                        | Description                                                                         |
|--------------------------------|-------------------------------------------------------------------------------------|
| Break Mechanic                 | One-click "Break Everything" that removes constraints and lets UI pieces fall.      |
| Physics-Driven Pieces          | Use rigid-body physics for gravity, collisions, restitution.                        |
| Drag-and-Drop Rebuild          | Mouse drag to move pieces; snap-to-origin when within tolerance.                    |
| Level Progression              | Multiple levels of increasing complexity (6–20+ pieces).                           |
| Neon Synthwave Theme           | Black backgrounds + neon pink/purple/cyan glows.                                    |
| HUD & Feedback                 | Timer display, "Break" button, "Pieces Left" counter, level title.                 |
| Leaderboard & Persistence      | Name entry, time submission, top-10 display per level.                              |
| Responsive Design              | Works across desktop and tablet screen sizes.                                       |

---

## 6. Technology Stack

| Layer            | Technology                 | Purpose                                   |
|------------------|----------------------------|-------------------------------------------|
| Framework        | **Next.js (App Router)**   | File-based routing; server/client code    |
| Language         | **TypeScript**             | Type safety; developer DX                 |
| Styles & Theme   | **Tailwind CSS**           | Utility classes; theme extension          |
| Components       | **shadcn UI + Radix**      | Prebuilt, Tailwind-friendly UI primitives |
| Physics Engine   | **matter-js**              | 2D rigid-body physics                     |
| State Management | **zustand**                | Lightweight global store (timer, flags)   |
| Animations       | **framer-motion**          | Page transitions; hover/flicker effects   |
| Backend API      | **Next.js API Routes**     | (Optional) custom endpoints               |
| Persistence      | **Supabase (Postgres)**    | Leaderboard table; hosted DB + JS SDK     |
| Deployment       | **Vercel**                 | Instant deploy + env vars                 |

---

## 7. High-Level Architecture

```
┌──────────────────┐ ┌──────────────────────┐ ┌───────────────────┐
│                  │ │                      │ │                   │
│ Browser (Next)   │─────▶│ PhysicsCanvas (UI) │ │ Supabase          │
│                  │ │ • Matter.js engine   │ │ • leaderboards    │
│ • React pages    │ │ • MouseConstraint    │◀────▶│ table             │
│ • shadcn UI      │ │ • onBodiesUpdate     │ │ • CRUD via JS SDK │
│                  │ │ • onPieceSnapped     │ │                   │
└──────────────────┘ └──────────────────────┘ └───────────────────┘
        │                        ▲
        │                        │
        ▼                        │
┌──────────────────┐             │
│                  │             │
│ Zustand Store    │─────────────┘
│ • time, broken   │
│ • start/stop     │
│ • level state    │
└──────────────────┘
```

---

## 8. Level Design & Progression

1. **Level 1**: Newsletter Card (6 pieces)  
2. **Level 2**: Two-Column Feature (8 pieces)  
3. **Level 3**: Navbar + Hero + Footer (18 pieces)  
4. **Level 4**: Base Page + Login Modal (13 pieces)  
5. **Level 5**: Mini Dashboard (20 pieces)  
6. **(Bonus) Level 6**: E-Commerce Product Page (26 pieces)  

Each level's piece positions and sizes defined in `/lib/levelConfigs.ts`.

---

## 9. UI Style & Theming

- **Global**:  
  - `bg-synth-900` body, `font-synthwave` (Orbitron), `neon-grid-bg` overlay, scanlines.  
- **Components**:  
  - Cards & containers on `bg-synth-800`, `border-2 border-neon-*`, `shadow-neon-*`.  
  - Text with `text-neon-*` + `drop-shadow-neon-*`, optional `.flicker`.  
- **HUD**:  
  - Neon timer + "Break All" button (NeonButton wrapper).

---

## 10. Data & Persistence

- **Supabase Table**:  
  ```sql
  CREATE TABLE leaderboards (
    id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    player     text NOT NULL,
    level      integer NOT NULL,
    time_ms    integer NOT NULL,
    created_at timestamptz DEFAULT now()
  );
  ```

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Day 1)
1. **Setup & Dependencies**
   - Install matter-js, zustand, framer-motion, @supabase/supabase-js
   - Configure Tailwind with custom synthwave theme colors
   - Setup basic project structure

2. **Core Physics Engine**
   - Create PhysicsCanvas component with matter-js
   - Implement basic rectangle bodies that can fall
   - Add mouse constraint for dragging

3. **Basic UI Layout**
   - Create simple level with 3-4 rectangular pieces
   - Implement "Break Everything" button
   - Add snap-to-position logic

### Phase 2: Game Mechanics (Day 2)
1. **Level System**
   - Create level configuration structure
   - Implement level progression
   - Add timer and piece counter

2. **Synthwave Styling**
   - Custom Tailwind theme with neon colors
   - CSS animations for glow effects
   - Scanline and grid background overlays

3. **Game State Management**
   - Zustand store for game state
   - Win condition detection
   - Level completion flow

### Phase 3: Polish & Features (Day 3)
1. **Supabase Integration**
   - Setup database and API routes
   - Leaderboard submission and display
   - Player name input

2. **Advanced Levels**
   - Design and implement 5-6 levels
   - Complex UI layouts (navbar, cards, modals)
   - Increasing difficulty progression

3. **Final Polish**
   - Sound effects (optional)
   - Particle effects
   - Mobile responsiveness
   - Performance optimization

---

## 12. Technical Considerations

### Performance
- Limit physics bodies to <30 per level
- Use `matter-js` render only for debug; custom React rendering for UI pieces
- Implement object pooling for particle effects

### Mobile Support
- Touch events for drag-and-drop
- Responsive breakpoints for different screen sizes
- Simplified physics for mobile performance

### Accessibility
- Keyboard navigation support
- Screen reader friendly labels
- High contrast mode option

---

## 13. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Physics performance issues | High | Start with simple shapes, optimize early |
| Complex drag-and-drop on mobile | Medium | Implement touch-specific handling |
| Supabase setup complexity | Low | Use local storage fallback initially |
| Time constraints | High | Focus on MVP first, add polish incrementally |
