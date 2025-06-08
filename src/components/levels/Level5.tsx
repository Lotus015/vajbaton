'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { memo } from 'react';
import { level5Pieces } from '@/types';

interface Level5EasyProps {
  positions?: Record<string, { x: number; y: number; angle: number }>;
}

const Level5Easy = memo(({ positions = {} }: Level5EasyProps) => {
  const getTransform = (pieceId: string) => {
    const piece = level5Pieces.find(p => p.id === pieceId);
    if (!piece) return {};

    const pos = positions[pieceId];
    if (pos) {
      // Use physics position
      return {
        transform: `translate(${pos.x - piece.w/2}px, ${pos.y - piece.h/2}px) rotate(${pos.angle}rad)`,
        transformOrigin: 'center',
      };
    } else {
      // Use original position
      return {
        transform: `translate(${piece.x}px, ${piece.y}px)`,
        transformOrigin: 'center',
      };
    }
  };

  return (
    <div className="absolute inset-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background gradient for visual appeal */}
        <div 
          className="absolute bg-gradient-to-br from-synth-900/30 to-synth-800/30 border border-neon-green/20 rounded-lg backdrop-blur-sm"
          style={{
            left: 300,
            top: 200,
            width: 400,
            height: 200,
            borderRadius: '12px',
          }}
        />
        
        {/* Title */}
        <h1 
          className="absolute text-4xl font-bold gradient-text text-center flex items-center justify-center"
          style={{
            left: 350,
            top: 150,
            width: 300,
            height: 60,
          }}
        >
          The "Easy" Level
        </h1>
        
        {/* The single button - positioned in center */}
        <Button
          variant="neon-green"
          size="lg"
          className="absolute px-8 py-4 text-lg font-bold"
          data-physics-piece="easy-button"
          style={{
            width: level5Pieces[0].w,
            height: level5Pieces[0].h,
            ...getTransform('easy-button')
          }}
        >
          🎯 Click Me!
        </Button>
        
        {/* Subtitle hint */}
        <p 
          className="absolute text-neon-yellow text-sm text-center flex items-center justify-center"
          style={{
            left: 350,
            top: 350,
            width: 300,
            height: 30,
          }}
        >
          Just put the button back... how hard could it be? 😈
        </p>
      </motion.div>
    </div>
  );
});

Level5Easy.displayName = 'Level5Easy';

export default Level5Easy;
