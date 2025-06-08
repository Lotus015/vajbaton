'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhysicsCanvas from '@/components/PhysicsCanvas';
import InstructionsModal from '@/components/InstructionsModal';
import TutorialPopup from '@/components/TutorialPopup';
import CompletionModal from '@/components/CompletionModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { pieces } from '@/types';

type TutorialStep = 'welcome' | 'drag' | 'spacebar' | 'complete' | 'finished';

export default function HomePage() {
  // 1) Local state
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number; angle: number }>
  >({});
  const [broken, setBroken] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [snappedPieces, setSnappedPieces] = useState<Set<string>>(new Set());
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('welcome');
  const [hasStartedDrag, setHasStartedDrag] = useState(false);
  const [hasUsedSpacebar, setHasUsedSpacebar] = useState(false);

  // Timer
  useEffect(() => {
    if (!isGameStarted) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 50);
    }, 50);
    
    return () => clearInterval(timer);
  }, [isGameStarted]);

  // Auto-break after 1.5 seconds when game starts
  useEffect(() => {
    if (isGameStarted && !broken && tutorialStep === 'drag') {
      const timer = setTimeout(() => {
        setBroken(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isGameStarted, broken, tutorialStep]);

  // Check for level completion - proper React pattern
  useEffect(() => {
    console.log('🔍 Completion check:', {
      snappedPiecesSize: snappedPieces.size,
      piecesLength: pieces.length,
      hasUsedSpacebar,
      tutorialStep,
      snappedPiecesArray: Array.from(snappedPieces)
    });
    
    if (snappedPieces.size === pieces.length && hasUsedSpacebar) {
      console.log('✅ Tutorial complete! Setting to finished');
      setTutorialStep('finished');
    }
  }, [snappedPieces, hasUsedSpacebar]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}s`;
  };

  const handlePieceSnapped = (pieceId: string) => {
    console.log('🎯 Piece snapped (auto):', pieceId);
    setSnappedPieces(prev => {
      const newSet = new Set([...prev, pieceId]);
      console.log('📦 Updated snapped pieces (auto):', Array.from(newSet));
      return newSet;
    });
  };

  const handleStartDrag = (pieceId: string) => {
    console.log('🖱️ Started dragging:', pieceId);
    if (!hasStartedDrag && tutorialStep === 'drag') {
      console.log('📚 Moving to spacebar step');
      setHasStartedDrag(true);
      setTutorialStep('spacebar');
    }
  };

  const handleSpacebarSnap = (pieceId: string) => {
    console.log('⌨️ Spacebar snap:', pieceId);
    
    if (!hasUsedSpacebar && tutorialStep === 'spacebar') {
      console.log('🎉 First spacebar use! Moving to complete step');
      setHasUsedSpacebar(true);
      setTutorialStep('complete');
    }
    
    setSnappedPieces(prev => {
      const newSet = new Set([...prev, pieceId]);
      console.log('📦 Updated snapped pieces (spacebar):', Array.from(newSet));
      return newSet;
    });
  };

  const startTutorial = () => {
    setIsGameStarted(true);
    setTutorialStep('drag');
  };

  const skipTutorial = () => {
    setTutorialStep('finished');
  };

  const nextLevel = () => {
    // For now, just reset the tutorial
    setIsGameStarted(false);
    setBroken(false);
    setSnappedPieces(new Set());
    setTutorialStep('welcome');
    setHasStartedDrag(false);
    setHasUsedSpacebar(false);
    setTimeElapsed(0);
  };

  const piecesLeft = pieces.length - snappedPieces.size;

  // Show instructions modal if game hasn't started
  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-synth-950 cyber-grid scanlines">
        <InstructionsModal onStart={startTutorial} />
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
      {/* Fixed HUD at top-right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 right-4 z-50"
      >
        <Card className="glass border-neon-purple/30 shadow-2xl">
          <CardHeader className="p-4">
            <div className="text-right">
              <CardTitle className="text-sm font-bold gradient-text-secondary mb-1">
                Tutorial Level
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium mb-3">
                Build Something Vibeable
              </CardDescription>
            </div>
            
            <div className="flex gap-4 items-center justify-end">
              <div className="text-center">
                <div className="text-neon-yellow text-lg font-bold font-mono">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-xs text-neon-yellow/60 font-medium tracking-wider">TIME</div>
              </div>
              
              <div className="text-center">
                <div className="text-neon-green text-lg font-bold font-mono">
                  {piecesLeft}
                </div>
                <div className="text-xs text-neon-green/60 font-medium tracking-wider">LEFT</div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Tutorial Popups */}
      <AnimatePresence>
        {tutorialStep === 'drag' && (
          <TutorialPopup
            title="🎯 Step 1: Drag & Drop"
            description="Watch the components break apart, then drag any piece around the screen to move it!"
            position="top-center"
            onSkip={skipTutorial}
            showButtons={false}
          />
        )}
        
        {tutorialStep === 'spacebar' && (
          <TutorialPopup
            title="📌 Step 2: Pin in Place"
            description="While dragging a piece, press SPACEBAR to pin it in that exact location!"
            position="top-center"
            onSkip={skipTutorial}
            showButtons={false}
          />
        )}
        
        {tutorialStep === 'complete' && (
          <TutorialPopup
            title="🎉 Almost Done!"
            description="Great! Now pin both pieces wherever you want them. You can drag them close to their original spots to snap them back automatically."
            position="top-center"
            onSkip={skipTutorial}
            showButtons={false}
          />
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      {tutorialStep === 'finished' && (
        <CompletionModal onNextLevel={nextLevel} />
      )}

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
        onPieceSnapped={handlePieceSnapped}
        onStartDrag={handleStartDrag}
        onSpacebarSnap={handleSpacebarSnap}
      />
    </div>
  );
}
