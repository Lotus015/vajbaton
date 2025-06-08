'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { memo, useState, useEffect } from 'react';
import { level4Pieces } from '@/types';

interface Level4FormModalProps {
  positions?: Record<string, { x: number; y: number; angle: number }>;
}

const Level4FormModal = memo(({ positions = {} }: Level4FormModalProps) => {
  const [isFlickering, setIsFlickering] = useState(false);
  
  // Start flickering when neon header is broken
  useEffect(() => {
    const neonHeaderPos = positions['neon-header'];
    if (neonHeaderPos && (Math.abs(neonHeaderPos.angle) > 0.1 || neonHeaderPos.y > 50)) {
      setIsFlickering(true);
    }
  }, [positions]);

  const getTransform = (pieceId: string) => {
    const piece = level4Pieces.find(p => p.id === pieceId);
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
        {/* Special Neon Header with flickering effect */}
        <div 
          className={`absolute bg-gradient-to-r from-neon-pink/30 to-neon-cyan/30 border-2 border-neon-pink rounded-lg flex items-center justify-center font-bold text-3xl text-neon-pink backdrop-blur-sm ${
            isFlickering ? 'animate-pulse' : 'neon-glow-pink'
          }`}
          data-physics-piece="neon-header"
          style={{
            width: level4Pieces[0].w,
            height: level4Pieces[0].h,
            ...getTransform('neon-header'),
            boxShadow: isFlickering 
              ? '0 0 20px rgba(255, 0, 128, 0.8), 0 0 40px rgba(255, 0, 128, 0.4), inset 0 0 20px rgba(255, 0, 128, 0.2)'
              : '0 0 10px rgba(255, 0, 128, 0.3), 0 0 20px rgba(255, 0, 128, 0.2), 0 0 40px rgba(255, 0, 128, 0.1)',
            animation: isFlickering ? 'flicker 0.5s infinite alternate' : 'none',
          }}
        >
          <div className="flex items-center gap-4">
            <span>⚡</span>
            <span>NEON DINER</span>
            <span>⚡</span>
          </div>
          
          {/* Neon light tube effect */}
          <div 
            className={`absolute bottom-0 left-4 right-4 h-2 bg-gradient-to-r from-neon-pink to-neon-cyan rounded-full ${
              isFlickering ? 'opacity-60' : 'opacity-100'
            }`}
            style={{
              boxShadow: isFlickering 
                ? '0 0 10px rgba(255, 0, 128, 0.8), 0 0 20px rgba(0, 212, 255, 0.8)'
                : '0 0 5px rgba(255, 0, 128, 0.5), 0 0 10px rgba(0, 212, 255, 0.5)',
              animation: isFlickering ? 'flicker 0.3s infinite alternate' : 'none',
            }}
          />
        </div>

        {/* Base Page Header */}
        <div 
          className="absolute bg-synth-800/40 border-b border-neon-cyan/30 backdrop-blur-sm flex items-center justify-center text-xl font-bold gradient-text"
          data-physics-piece="page-header"
          style={getTransform('page-header')}
        >
          Welcome to Our Platform
        </div>

        {/* Feature Cards */}
        <div 
          className="absolute bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border border-neon-purple/50 rounded-lg p-3 backdrop-blur-sm"
          data-physics-piece="feature-card-1"
          style={getTransform('feature-card-1')}
        >
          <div className="text-center">
            <div className="text-3xl mb-1">🚀</div>
            <div className="text-neon-purple font-semibold mb-1 text-sm">Fast</div>
            <div className="text-xs text-foreground">Lightning speed</div>
          </div>
        </div>

        <div 
          className="absolute bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/50 rounded-lg p-3 backdrop-blur-sm"
          data-physics-piece="feature-card-2"
          style={getTransform('feature-card-2')}
        >
          <div className="text-center">
            <div className="text-3xl mb-1">🎨</div>
            <div className="text-neon-cyan font-semibold mb-1 text-sm">Beautiful</div>
            <div className="text-xs text-foreground">Stunning design</div>
          </div>
        </div>

        <div 
          className="absolute bg-gradient-to-br from-neon-green/20 to-neon-yellow/20 border border-neon-green/50 rounded-lg p-3 backdrop-blur-sm"
          data-physics-piece="feature-card-3"
          style={getTransform('feature-card-3')}
        >
          <div className="text-center">
            <div className="text-3xl mb-1">🔒</div>
            <div className="text-neon-green font-semibold mb-1 text-sm">Secure</div>
            <div className="text-xs text-foreground">Bank-level security</div>
          </div>
        </div>

        {/* Modal Title */}
        <h2 
          className="absolute text-xl font-bold gradient-text text-center flex items-center justify-center"
          data-physics-piece="modal-title"
          style={getTransform('modal-title')}
        >
          Join Our Community
        </h2>

        {/* Form Inputs */}
        <input
          type="text"
          placeholder="Your Name"
          className="absolute px-3 py-2 bg-synth-800/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-foreground placeholder-muted-foreground backdrop-blur-sm text-sm"
          data-physics-piece="name-input"
          style={{
            width: level4Pieces[6].w,
            height: level4Pieces[6].h,
            ...getTransform('name-input')
          }}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="absolute px-3 py-2 bg-synth-800/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-foreground placeholder-muted-foreground backdrop-blur-sm text-sm"
          data-physics-piece="email-input"
          style={{
            width: level4Pieces[7].w,
            height: level4Pieces[7].h,
            ...getTransform('email-input')
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="absolute px-3 py-2 bg-synth-800/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-foreground placeholder-muted-foreground backdrop-blur-sm text-sm"
          data-physics-piece="password-input"
          style={{
            width: level4Pieces[8].w,
            height: level4Pieces[8].h,
            ...getTransform('password-input')
          }}
        />

        {/* Form Buttons */}
        <Button
          variant="neon-pink"
          size="sm"
          className="absolute px-4 py-2"
          data-physics-piece="submit-btn"
          style={{
            width: level4Pieces[9].w,
            height: level4Pieces[9].h,
            ...getTransform('submit-btn')
          }}
        >
          Submit
        </Button>

        <Button
          variant="neon-purple"
          size="sm"
          className="absolute px-4 py-2"
          data-physics-piece="cancel-btn"
          style={{
            width: level4Pieces[10].w,
            height: level4Pieces[10].h,
            ...getTransform('cancel-btn')
          }}
        >
          Cancel
        </Button>
      </motion.div>

      {/* CSS for flickering animation */}
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
});

Level4FormModal.displayName = 'Level4FormModal';

export default Level4FormModal;
