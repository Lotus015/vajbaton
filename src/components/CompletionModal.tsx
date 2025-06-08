'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CompletionModalProps {
  onNextLevel: () => void;
}

const CompletionModal = ({ onNextLevel }: CompletionModalProps) => {
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
              🎉 CONGRATULATIONS!
            </DialogTitle>
            <div className="text-neon-cyan text-xl font-medium mb-4">
              You are now a vibecoder!
            </div>
          </DialogHeader>
          
          <div className="space-y-4 text-center text-foreground">
            <div className="bg-synth-800/50 rounded-lg p-4 border border-neon-purple/30">
              <p className="text-sm leading-relaxed">
                You've mastered the art of physics-based UI reconstruction! 
                Time to put your skills to the test with more challenging levels.
              </p>
            </div>
            
            <div className="text-neon-yellow text-sm">
              ⚡ Ready for the real challenge?
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              variant="neon-pink"
              size="lg"
              onClick={onNextLevel}
              className="text-xl px-12 py-4 h-16 font-bold"
            >
              🚀 NEXT LEVEL
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CompletionModal;
