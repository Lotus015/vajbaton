'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { memo } from 'react';
import useGameStore from '@/store/gameStore';

const SimpleHeader = memo(() => {
  const { setLevelRendered } = useGameStore();

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => setLevelRendered(true)}
        className="text-center space-y-6"
      >
        {/* Title */}
        <h1 
          className="text-6xl font-bold gradient-text"
          data-physics-piece="title"
        >
          Build Something Vibeable
        </h1>
        
        {/* Button */}
        <Button
          variant="neon-pink"
          size="lg"
          className="text-2xl px-12 py-6 h-16"
          data-physics-piece="build-btn"
        >
          Build
        </Button>
      </motion.div>
    </div>
  );
});

SimpleHeader.displayName = 'SimpleHeader';

export default SimpleHeader;
