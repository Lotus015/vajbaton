'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { memo } from 'react';
import { level2Pieces } from '@/types';

interface Level2FeatureSectionProps {
  positions?: Record<string, { x: number; y: number; angle: number }>;
}

const Level2FeatureSection = memo(({ positions = {} }: Level2FeatureSectionProps) => {
  const getTransform = (pieceId: string) => {
    const piece = level2Pieces.find(p => p.id === pieceId);
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
      {/* Feature Section Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Background */}
        <div 
          className="absolute bg-synth-800/30 border border-neon-purple/30 rounded-lg backdrop-blur-sm"
          style={{
            left: 200,
            top: 100,
            width: 600,
            height: 500,
            borderRadius: '12px',
          }}
        />
        
        {/* Left Column - Text Content */}
        
        {/* Heading */}
        <h2 
          className="absolute text-4xl font-bold gradient-text"
          data-physics-piece="heading"
          style={getTransform('heading')}
        >
          Why Choose Our App?
        </h2>
        
        {/* Bullet Points */}
        <div 
          className="absolute text-neon-cyan text-lg flex items-center"
          data-physics-piece="bullet-1"
          style={getTransform('bullet-1')}
        >
          <span className="text-neon-pink mr-3">•</span>
          Lightning-fast performance
        </div>
        
        <div 
          className="absolute text-neon-cyan text-lg flex items-center"
          data-physics-piece="bullet-2"
          style={getTransform('bullet-2')}
        >
          <span className="text-neon-pink mr-3">•</span>
          Intuitive user interface
        </div>
        
        <div 
          className="absolute text-neon-cyan text-lg flex items-center"
          data-physics-piece="bullet-3"
          style={getTransform('bullet-3')}
        >
          <span className="text-neon-pink mr-3">•</span>
          24/7 customer support
        </div>
        
        {/* Learn More Button */}
        <Button
          variant="neon-purple"
          size="lg"
          className="absolute px-6 py-3"
          data-physics-piece="learn-more-btn"
          style={{
            width: level2Pieces[4].w,
            height: level2Pieces[4].h,
            ...getTransform('learn-more-btn')
          }}
        >
          Learn More
        </Button>
        
        {/* Right Column - Hero Image */}
        <div 
          className="absolute bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border-2 border-neon-cyan/50 rounded-lg flex items-center justify-center neon-glow-cyan"
          data-physics-piece="hero-image"
          style={{
            width: level2Pieces[5].w,
            height: level2Pieces[5].h,
            ...getTransform('hero-image')
          }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <div className="text-neon-cyan font-semibold">Hero Image</div>
          </div>
        </div>
        
        {/* Decorative Accent */}
        <div 
          className="absolute bg-neon-yellow/20 rounded-full border border-neon-yellow/50 flex items-center justify-center"
          data-physics-piece="decorative-accent"
          style={{
            width: level2Pieces[6].w,
            height: level2Pieces[6].h,
            ...getTransform('decorative-accent')
          }}
        >
          <span className="text-neon-yellow text-2xl">✨</span>
        </div>
      </motion.div>
    </div>
  );
});

Level2FeatureSection.displayName = 'Level2FeatureSection';

export default Level2FeatureSection;
