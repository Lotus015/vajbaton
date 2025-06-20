'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhysicsCanvas from '@/components/PhysicsCanvas';
import InstructionsModal from '@/components/InstructionsModal';
import TutorialPopup from '@/components/TutorialPopup';
import CompletionModal from '@/components/CompletionModal';
import LevelSelectorModal from '@/components/LevelSelectorModal';
import TwitterCTA from '@/components/TwitterCTA';
import Level1Newsletter from '@/components/levels/Level1';
import Level2FeatureSection from '@/components/levels/Level2';
import Level3NavbarHeroFooter from '@/components/levels/Level3';
import Level4FormModal from '@/components/levels/Level4';
import Level5Easy from '@/components/levels/Level5';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import useGameStore from '@/store/gameStore';
import { allLevels } from '@/types';

type TutorialStep = 'welcome' | 'drag' | 'spacebar' | 'complete' | 'finished';

export default function HomePage() {
  const {
    currentLevel,
    timeElapsed,
    isGameStarted,
    isBroken,
    snappedPieces,
    totalPieces,
    isLevelComplete,
    startGame,
    breakPieces,
    snapPiece,
    setLevel,
    setTotalPieces,
    resetLevel,
    resetTimer
  } = useGameStore();

  // Tutorial-specific state (only for level 0)
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number; angle: number }>
  >({});
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('welcome');
  const [hasStartedDrag, setHasStartedDrag] = useState(false);
  const [hasUsedSpacebar, setHasUsedSpacebar] = useState(false);
  
  // Level selector modal state
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState(false);
  
  // Reset counter to force PhysicsCanvas re-mount
  const [resetCounter, setResetCounter] = useState(0);

  // Keyboard listener for Command+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsLevelSelectorOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get current level pieces
  const getCurrentPieces = () => {
    const level = allLevels.find(l => l.id === currentLevel);
    return level ? level.pieces : allLevels[0].pieces; // fallback to tutorial
  };

  const currentPieces = getCurrentPieces();

  // Set total pieces when level changes
  useEffect(() => {
    setTotalPieces(currentPieces.length);
  }, [currentLevel, setTotalPieces, currentPieces.length]);

  // Auto-break after 1 second when game starts (tutorial only)
  useEffect(() => {
    if (currentLevel === 0 && isGameStarted && !isBroken && tutorialStep === 'drag') {
      const timer = setTimeout(() => {
        breakPieces();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentLevel, isGameStarted, isBroken, tutorialStep, breakPieces]);

  // Auto-break for regular levels after 1 second
  useEffect(() => {
    if (currentLevel > 0 && isGameStarted && !isBroken) {
      const timer = setTimeout(() => {
        breakPieces();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentLevel, isGameStarted, isBroken, breakPieces]);

  // Tutorial completion check
  useEffect(() => {
    if (currentLevel === 0 && snappedPieces.size === currentPieces.length && hasUsedSpacebar) {
      setTutorialStep('finished');
    }
  }, [currentLevel, snappedPieces, hasUsedSpacebar, currentPieces.length]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}s`;
  };

  const handlePieceSnapped = (pieceId: string) => {
    snapPiece(pieceId);
  };

  const handleStartDrag = (pieceId: string) => {
    if (currentLevel === 0 && !hasStartedDrag && tutorialStep === 'drag') {
      setHasStartedDrag(true);
      setTutorialStep('spacebar');
    }
  };

  const handleSpacebarSnap = (pieceId: string) => {
    if (currentLevel === 0) {
      if (!hasUsedSpacebar && tutorialStep === 'spacebar') {
        setHasUsedSpacebar(true);
        setTutorialStep('complete');
      }
    }
    snapPiece(pieceId);
  };

  const startTutorial = () => {
    startGame();
    if (currentLevel === 0) {
      setTutorialStep('drag');
    }
  };

  const skipTutorial = () => {
    if (currentLevel === 0) {
      setTutorialStep('finished');
    }
  };

  const nextLevel = () => {
    if (currentLevel === 0) {
      // Move from tutorial to Level 1
      setLevel(1);
      setTutorialStep('welcome');
      setHasStartedDrag(false);
      setHasUsedSpacebar(false);
    } else if (currentLevel === 1) {
      // Move from Level 1 to Level 2
      setLevel(2);
    } else if (currentLevel === 2) {
      // Move from Level 2 to Level 3
      setLevel(3);
    } else if (currentLevel === 3) {
      // Move from Level 3 to Level 4
      setLevel(4);
    } else if (currentLevel === 4) {
      // Move from Level 4 to Level 5
      setLevel(5);
    } else {
      // For now, just reset current level
      resetLevel();
    }
  };

  const handleResetLevel = () => {
    setPositions({}); // Reset positions to initial
    setResetCounter(c => c + 1); // Force PhysicsCanvas re-mount
    resetLevel(true); // Keep game started
    setTotalPieces(currentPieces.length); // Re-set total pieces count
    startGame(); // Restart timer and game logic
  };

  const piecesLeft = totalPieces - snappedPieces.size;

  // Show instructions modal if game hasn't started
  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-synth-950 cyber-grid scanlines">
        <InstructionsModal onStart={startTutorial} />
        {/* Preview of the level in the background */}
        <div className="opacity-30">
          {currentLevel === 0 ? (
            <div className="relative w-screen h-screen bg-synth-950 cyber-grid scanlines overflow-hidden">
              {/* Tutorial elements */}
              <div
                id="header"
                className="absolute text-neon-cyan font-bold text-4xl flex items-center justify-center"
                style={{
                  width: currentPieces[0].w,
                  height: currentPieces[0].h,
                  transform: `translate(${(positions.header?.x ?? currentPieces[0].x + currentPieces[0].w/2) - currentPieces[0].w/2}px, ${
                    (positions.header?.y ?? currentPieces[0].y + currentPieces[0].h/2) - currentPieces[0].h/2
                  }px) rotate(${positions.header?.angle ?? 0}rad)`,
                  transformOrigin: 'center',
                }}
              >
                Build Something Vibeable
              </div>
              <button
                id="button"
                className="absolute bg-neon-pink text-white px-4 py-2 rounded border-2 border-neon-cyan font-bold"
                style={{
                  width: currentPieces[1].w,
                  height: currentPieces[1].h,
                  transform: `translate(${(positions.button?.x ?? currentPieces[1].x + currentPieces[1].w/2) - currentPieces[1].w/2}px, ${
                    (positions.button?.y ?? currentPieces[1].y + currentPieces[1].h/2) - currentPieces[1].h/2
                  }px) rotate(${positions.button?.angle ?? 0}rad)`,
                  transformOrigin: 'center',
                }}
              >
                Click Me
              </button>
            </div>
          ) : (
            <Level1Newsletter positions={positions} />
          )}
        </div>
      </div>
    );
  }

  const getLevelTitle = () => {
    const level = allLevels.find(l => l.id === currentLevel);
    return level ? level.name : `Level ${currentLevel}`;
  };

  const getLevelDescription = () => {
    const level = allLevels.find(l => l.id === currentLevel);
    return level ? level.description : 'Challenge';
  };

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
                {getLevelTitle()}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium mb-3">
                {getLevelDescription()}
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
            
            {/* Reset Level Button */}
            <div className="flex justify-end mt-3">
              <Button
                variant="neon-purple"
                size="sm"
                onClick={handleResetLevel}
                className="text-xs px-3 py-1"
              >
                🔄 Reset Level
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Twitter CTA */}
      <TwitterCTA />

      {/* Tutorial Popups (only for level 0) */}
      {currentLevel === 0 && (
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
      )}

      {/* Completion Modal */}
      {(isLevelComplete || (currentLevel === 0 && tutorialStep === 'finished')) && (
        <CompletionModal onNextLevel={nextLevel} />
      )}

      {/* Level Selector Modal (Dev Mode) */}
      <LevelSelectorModal 
        open={isLevelSelectorOpen} 
        onOpenChange={setIsLevelSelectorOpen} 
      />

      {/* Render current level */}
      {currentLevel === 0 ? (
        <>
          {/* Tutorial elements */}
          <div
            id="header"
            className="absolute text-neon-cyan font-bold text-4xl flex items-center justify-center"
            style={{
              width: currentPieces[0].w,
              height: currentPieces[0].h,
              transform: `translate(${(positions.header?.x ?? currentPieces[0].x + currentPieces[0].w/2) - currentPieces[0].w/2}px, ${
                (positions.header?.y ?? currentPieces[0].y + currentPieces[0].h/2) - currentPieces[0].h/2
              }px) rotate(${positions.header?.angle ?? 0}rad)`,
              transformOrigin: 'center',
            }}
          >
            Build Something Vibeable
          </div>
          <button
            id="button"
            className="absolute bg-neon-pink text-white px-4 py-2 rounded border-2 border-neon-cyan font-bold"
            style={{
              width: currentPieces[1].w,
              height: currentPieces[1].h,
              transform: `translate(${(positions.button?.x ?? currentPieces[1].x + currentPieces[1].w/2) - currentPieces[1].w/2}px, ${
                (positions.button?.y ?? currentPieces[1].y + currentPieces[1].h/2) - currentPieces[1].h/2
              }px) rotate(${positions.button?.angle ?? 0}rad)`,
              transformOrigin: 'center',
            }}
          >
            Click Me
          </button>
        </>
      ) : currentLevel === 1 ? (
        <Level1Newsletter positions={positions} />
      ) : currentLevel === 2 ? (
        <Level2FeatureSection positions={positions} />
      ) : currentLevel === 3 ? (
        <Level3NavbarHeroFooter positions={positions} />
      ) : currentLevel === 4 ? (
        <Level4FormModal positions={positions} />
      ) : currentLevel === 5 ? (
        <Level5Easy positions={positions} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-neon-cyan text-2xl">Level {currentLevel} - Coming Soon!</div>
        </div>
      )}

      {/* Physics layer */}
      <PhysicsCanvas
        key={resetCounter}
        pieces={currentPieces}
        breakMode={isBroken}
        onUpdate={(pos) => setPositions(pos)}
        onPieceSnapped={handlePieceSnapped}
        onStartDrag={handleStartDrag}
        onSpacebarSnap={handleSpacebarSnap}
      />

    </div>
  );
}
