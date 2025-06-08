'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { memo } from 'react';

const Level1Newsletter = memo(() => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {/* Newsletter Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card 
          className="glass border-neon-cyan/50 shadow-2xl neon-glow-cyan overflow-hidden w-96"
          data-physics-piece="card-background"
        >
          <div className="p-8">
            {/* Icon */}
            <div 
              className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center mb-6 neon-glow-purple"
              data-physics-piece="icon"
            >
              <span className="text-white text-xl">✉️</span>
            </div>
            
            {/* Title */}
            <h1 
              className="text-3xl font-bold gradient-text mb-4"
              data-physics-piece="title"
            >
              Join Our Newsletter
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-neon-cyan text-lg mb-8 font-medium"
              data-physics-piece="subtitle"
            >
              Stay updated with the latest tips, tutorials, and industry insights delivered straight to your inbox.
            </p>
            
            {/* Email Form */}
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-synth-800/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan text-foreground placeholder-muted-foreground backdrop-blur-sm"
                data-physics-piece="email-input"
              />
              <Button
                variant="neon-pink"
                size="lg"
                className="px-8 py-3"
                data-physics-piece="subscribe-btn"
              >
                Subscribe
              </Button>
            </div>
            
            {/* Privacy Note */}
            <p 
              className="text-sm text-muted-foreground mt-4"
              data-physics-piece="privacy-note"
            >
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
});

Level1Newsletter.displayName = 'Level1Newsletter';

export default Level1Newsletter;
