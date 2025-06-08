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
      <DialogContent className="glass border-neon-cyan/50 shadow-2xl max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-4xl font-black gradient-text mb-4">
              🎮 PHYSICS CHALLENGE
            </DialogTitle>
            <div className="text-neon-cyan text-lg font-medium mb-4">
              Build Something Vibeable
            </div>
          </DialogHeader>
          
          <div className="space-y-4 text-center text-foreground">
            <div className="bg-synth-800/50 rounded-lg p-4 border border-neon-purple/30">
              <h3 className="text-neon-pink font-semibold mb-2">How to Play:</h3>
              <ul className="text-sm space-y-2 text-left">
                <li>• Watch the components break apart and fall with physics</li>
                <li>• Drag each piece back to its original position</li>
                <li>• Pieces will snap into place when close enough</li>
                <li>• Complete the puzzle as fast as possible!</li>
              </ul>
            </div>
            
            <div className="text-neon-yellow text-sm">
              ⚡ Components will break automatically after 1.5 seconds
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              variant="neon-pink"
              size="lg"
              onClick={onStart}
              className="text-xl px-12 py-4 h-16 font-bold"
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
