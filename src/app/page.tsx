'use client';

import { useState, useEffect } from 'react';
import PhysicsCanvas from '@/components/PhysicsCanvas';
import InstructionsModal from '@/components/InstructionsModal';
import { pieces } from '@/types';

export default function HomePage() {
  // 1) Local state
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number; angle: number }>
  >({});
  const [broken, setBroken] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Auto-break after 1.5 seconds when game starts
  useEffect(() => {
    if (isGameStarted && !broken) {
      const timer = setTimeout(() => {
        setBroken(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isGameStarted, broken]);

  // Show instructions modal if game hasn't started
  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-synth-950 cyber-grid scanlines">
        <InstructionsModal onStart={() => setIsGameStarted(true)} />
        {/* Preview of the level in the background */}
        <div className="opacity-30">
          <div className="relative w-screen h-screen bg-synth-950 cyber-grid scanlines overflow-hidden">
            {/* 2) Render header */}
            <div
              id="header"
              className="absolute text-neon-cyan font-bold text-4xl flex items-center justify-center"
              style={{
                width: pieces[0].w,
                height: pieces[0].h,
                transform: `translate(${pieces[0].x}px, ${pieces[0].y}px)`,
                transformOrigin: 'center',
              }}
            >
              Build Something Vibeable
            </div>

            {/* 3) Render button */}
            <button
              id="button"
              className="absolute bg-neon-pink text-white px-4 py-2 rounded border-2 border-neon-cyan font-bold"
              style={{
                width: pieces[1].w,
                height: pieces[1].h,
                transform: `translate(${pieces[1].x}px, ${pieces[1].y}px)`,
                transformOrigin: 'center',
              }}
            >
              Click Me
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-synth-950 cyber-grid scanlines overflow-hidden">
      {/* 2) Render header */}
      <div
        id="header"
        className="absolute text-neon-cyan font-bold text-4xl flex items-center justify-center"
        style={{
          width: pieces[0].w,
          height: pieces[0].h,
          transform: `translate(${(positions.header?.x ?? pieces[0].x + pieces[0].w/2) - pieces[0].w/2}px, ${
            (positions.header?.y ?? pieces[0].y + pieces[0].h/2) - pieces[0].h/2
          }px) rotate(${positions.header?.angle ?? 0}rad)`,
          transformOrigin: 'center',
        }}
      >
        Build Something Vibeable
      </div>

      {/* 3) Render button */}
      <button
        id="button"
        className="absolute bg-neon-pink text-white px-4 py-2 rounded border-2 border-neon-cyan font-bold"
        style={{
          width: pieces[1].w,
          height: pieces[1].h,
          transform: `translate(${(positions.button?.x ?? pieces[1].x + pieces[1].w/2) - pieces[1].w/2}px, ${
            (positions.button?.y ?? pieces[1].y + pieces[1].h/2) - pieces[1].h/2
          }px) rotate(${positions.button?.angle ?? 0}rad)`,
          transformOrigin: 'center',
        }}
      >
        Click Me
      </button>

      {/* 4) Physics layer */}
      <PhysicsCanvas
        pieces={pieces}
        breakMode={broken}
        onUpdate={(pos) => setPositions(pos)}
      />
    </div>
  );
}
