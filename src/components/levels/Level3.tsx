'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { memo } from 'react';
import { level3Pieces } from '@/types';

interface Level3NavbarHeroFooterProps {
  positions?: Record<string, { x: number; y: number; angle: number }>;
}

const Level3NavbarHeroFooter = memo(({ positions = {} }: Level3NavbarHeroFooterProps) => {
  const getTransform = (pieceId: string) => {
    const piece = level3Pieces.find(p => p.id === pieceId);
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
        {/* Visual navbar background (not physics-enabled) */}
        <div 
          className="absolute bg-synth-800/40 border-b border-neon-cyan/30 backdrop-blur-sm"
          style={{
            left: 0,
            top: 0,
            width: 1000,
            height: 80,
          }}
        />
        
        {/* Logo */}
        <div 
          className="absolute text-2xl font-bold gradient-text flex items-center"
          data-physics-piece="logo"
          style={getTransform('logo')}
        >
          🚀 VibeCorp
        </div>
        
        {/* Navigation Links */}
        <div 
          className="absolute text-neon-cyan text-lg font-medium flex items-center justify-center hover:text-neon-pink transition-colors cursor-pointer"
          data-physics-piece="nav-link-1"
          style={getTransform('nav-link-1')}
        >
          Home
        </div>
        
        <div 
          className="absolute text-neon-cyan text-lg font-medium flex items-center justify-center hover:text-neon-pink transition-colors cursor-pointer"
          data-physics-piece="nav-link-2"
          style={getTransform('nav-link-2')}
        >
          About
        </div>
        
        <div 
          className="absolute text-neon-cyan text-lg font-medium flex items-center justify-center hover:text-neon-pink transition-colors cursor-pointer"
          data-physics-piece="nav-link-3"
          style={getTransform('nav-link-3')}
        >
          Contact
        </div>
        
        {/* Search Icon */}
        <div 
          className="absolute text-neon-yellow text-xl flex items-center justify-center cursor-pointer hover:text-neon-green transition-colors"
          data-physics-piece="search-icon"
          style={getTransform('search-icon')}
        >
          🔍
        </div>
        
        {/* Visual hero background (not physics-enabled) */}
        <div 
          className="absolute bg-gradient-to-br from-synth-900/50 to-synth-800/50 border-b border-neon-purple/30"
          style={{
            left: 0,
            top: 80,
            width: 1000,
            height: 500,
          }}
        />
        
        {/* Hero Heading */}
        <h1 
          className="absolute text-6xl font-bold gradient-text text-center flex items-center justify-center"
          data-physics-piece="hero-heading"
          style={getTransform('hero-heading')}
        >
          Build the Future
        </h1>
        
        {/* Hero Subheading */}
        <p 
          className="absolute text-xl text-neon-cyan text-center flex items-center justify-center"
          data-physics-piece="hero-subheading"
          style={getTransform('hero-subheading')}
        >
          Create amazing experiences with our platform
        </p>
        
        {/* Get Started Button */}
        <Button
          variant="neon-pink"
          size="lg"
          className="absolute px-8 py-3"
          data-physics-piece="get-started-btn"
          style={{
            width: level3Pieces[6].w,
            height: level3Pieces[6].h,
            ...getTransform('get-started-btn')
          }}
        >
          Get Started
        </Button>
        
        {/* View Demo Button */}
        <Button
          variant="neon-purple"
          size="lg"
          className="absolute px-8 py-3"
          data-physics-piece="view-demo-btn"
          style={{
            width: level3Pieces[7].w,
            height: level3Pieces[7].h,
            ...getTransform('view-demo-btn')
          }}
        >
          View Demo
        </Button>
        
        {/* Hero Illustration */}
        <div 
          className="absolute bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border-2 border-neon-green/50 rounded-lg flex items-center justify-center neon-glow-green"
          data-physics-piece="hero-illustration"
          style={{
            width: level3Pieces[8].w,
            height: level3Pieces[8].h,
            ...getTransform('hero-illustration')
          }}
        >
          <div className="text-center">
            <div className="text-8xl mb-4">🌟</div>
            <div className="text-neon-green font-semibold">Innovation</div>
          </div>
        </div>
        
        {/* Visual footer background (not physics-enabled) */}
        <div 
          className="absolute bg-synth-900/60 border-t border-neon-purple/30 backdrop-blur-sm"
          style={{
            left: 0,
            top: 580,
            width: 1000,
            height: 120,
          }}
        />
        
        {/* Footer Column 1 */}
        <div 
          className="absolute text-neon-cyan text-sm"
          data-physics-piece="footer-column-1"
          style={getTransform('footer-column-1')}
        >
          <div className="font-semibold mb-2">Company</div>
          <div className="space-y-1">
            <div>About Us</div>
            <div>Careers</div>
            <div>Press</div>
          </div>
        </div>
        
        {/* Footer Column 2 */}
        <div 
          className="absolute text-neon-cyan text-sm"
          data-physics-piece="footer-column-2"
          style={getTransform('footer-column-2')}
        >
          <div className="font-semibold mb-2">Support</div>
          <div className="space-y-1">
            <div>Help Center</div>
            <div>Contact</div>
            <div>Privacy</div>
          </div>
        </div>
        
        {/* Social Icons */}
        <div 
          className="absolute bg-neon-blue/20 rounded-full border border-neon-blue/50 flex items-center justify-center cursor-pointer hover:bg-neon-blue/30 transition-colors"
          data-physics-piece="social-icon-1"
          style={{
            width: level3Pieces[11].w,
            height: level3Pieces[11].h,
            ...getTransform('social-icon-1')
          }}
        >
          <span className="text-neon-blue text-xl">📘</span>
        </div>
        
        <div 
          className="absolute bg-neon-cyan/20 rounded-full border border-neon-cyan/50 flex items-center justify-center cursor-pointer hover:bg-neon-cyan/30 transition-colors"
          data-physics-piece="social-icon-2"
          style={{
            width: level3Pieces[12].w,
            height: level3Pieces[12].h,
            ...getTransform('social-icon-2')
          }}
        >
          <span className="text-neon-cyan text-xl">🐦</span>
        </div>
        
        <div 
          className="absolute bg-neon-pink/20 rounded-full border border-neon-pink/50 flex items-center justify-center cursor-pointer hover:bg-neon-pink/30 transition-colors"
          data-physics-piece="social-icon-3"
          style={{
            width: level3Pieces[13].w,
            height: level3Pieces[13].h,
            ...getTransform('social-icon-3')
          }}
        >
          <span className="text-neon-pink text-xl">📷</span>
        </div>
      </motion.div>
    </div>
  );
});

Level3NavbarHeroFooter.displayName = 'Level3NavbarHeroFooter';

export default Level3NavbarHeroFooter;
