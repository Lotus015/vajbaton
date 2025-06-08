'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { memo } from 'react';
import { level1Pieces } from '@/types';

interface Level1NewsletterProps {
  positions?: Record<string, { x: number; y: number; angle: number }>;
}

const Level1Newsletter = memo(({ positions = {} }: Level1NewsletterProps) => {
  const getTransform = (pieceId: string) => {
    const piece = level1Pieces.find(p => p.id === pieceId);
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
      {/* Newsletter Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Visual card background (not physics-enabled) */}
        <div 
          className="absolute glass border-neon-cyan/50 shadow-2xl neon-glow-cyan"
          style={{
            left: 300,
            top: 150,
            width: 400,
            height: 400,
            borderRadius: '12px',
          }}
        />
        
        {/* Icon */}
        <div 
          className="absolute w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center neon-glow-purple"
          data-physics-piece="icon"
          style={getTransform('icon')}
        >
          <span className="text-white text-xl">✉️</span>
        </div>
        
        {/* Title */}
        <h1 
          className="absolute text-3xl font-bold gradient-text"
          data-physics-piece="title"
          style={getTransform('title')}
        >
          Join Our Newsletter
        </h1>
        
        {/* Subtitle */}
        <p 
          className="absolute text-neon-cyan text-lg font-medium"
          data-physics-piece="subtitle"
          style={getTransform('subtitle')}
        >
          Get the latest updates and insights.
        </p>
        
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email address"
          className="absolute px-4 py-3 bg-synth-800/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-foreground placeholder-muted-foreground backdrop-blur-sm"
          data-physics-piece="email-input"
          style={{
            width: level1Pieces[3].w,
            height: level1Pieces[3].h,
            ...getTransform('email-input')
          }}
        />
        
        {/* Subscribe Button */}
        <Button
          variant="neon-pink"
          size="lg"
          className="absolute px-8 py-3"
          data-physics-piece="subscribe-btn"
          style={{
            width: level1Pieces[4].w,
            height: level1Pieces[4].h,
            ...getTransform('subscribe-btn')
          }}
        >
          Subscribe
        </Button>
        
        {/* Privacy Note */}
        <p 
          className="absolute text-sm text-muted-foreground"
          data-physics-piece="privacy-note"
          style={getTransform('privacy-note')}
        >
          We respect your privacy. Unsubscribe at any time.
        </p>
      </motion.div>
    </div>
  );
});

Level1Newsletter.displayName = 'Level1Newsletter';

export default Level1Newsletter;
