'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InstructionsModalProps {
  onStart: () => void;
}

const InstructionsModal = ({ onStart }: InstructionsModalProps) => {
  return (
    <Dialog open={true}>
      <DialogContent className="glass border-neon-cyan/50 shadow-2xl max-w-[90vw] sm:max-w-lg mx-2 sm:mx-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DialogHeader className="text-center mb-4 sm:mb-6">
            <DialogTitle className="text-xl sm:text-2xl lg:text-4xl font-black gradient-text mb-2 sm:mb-4">
              🎮 PHYSICS CHALLENGE
            </DialogTitle>
            <div className="text-neon-cyan text-base sm:text-lg font-medium mb-2 sm:mb-4">
              Build Something Vibeable
            </div>
          </DialogHeader>
          
          <div className="space-y-3 sm:space-y-4 text-center text-foreground">
            <div className="bg-synth-800/50 rounded-lg p-3 sm:p-4 border border-neon-purple/30">
              <h3 className="text-neon-pink font-semibold mb-2 text-sm sm:text-base">How to Play:</h3>
              <ul className="text-xs sm:text-sm space-y-1 sm:space-y-2 text-left">
                <li>• Watch the components break apart and fall with physics</li>
                <li>• Drag each piece back to its original position</li>
                <li>• Pieces will snap into place when close enough</li>
                <li>• Complete the puzzle as fast as possible!</li>
              </ul>
            </div>
            
            <div className="text-neon-yellow text-xs sm:text-sm">
              ⚡ Components will break automatically after 1 second
            </div>
          </div>
          
          <div className="flex justify-center mt-6 sm:mt-8">
            <Button
              variant="neon-pink"
              size="lg"
              onClick={onStart}
              className="text-sm sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 h-10 sm:h-12 lg:h-16 font-bold"
            >
              🚀 START GAME
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsModal;
