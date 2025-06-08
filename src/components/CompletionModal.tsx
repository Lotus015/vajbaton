'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import useGameStore from '@/store/gameStore';

interface CompletionModalProps {
  onNextLevel: () => void;
}

const CompletionModal = ({ onNextLevel }: CompletionModalProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const { currentLevel, completionTime } = useGameStore();

  const getLevelName = () => {
    switch (currentLevel) {
      case 0: return 'Build Something Vibeable';
      case 1: return 'Newsletter Card';
      case 2: return 'Feature Section';
      case 3: return 'Navbar + Hero + Footer';
      case 4: return 'Interactive Form Modal';
      case 5: return 'The "Easy" Level';
      default: return 'Challenge';
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Get current positions from physics pieces
      const positions: Record<string, { x: number; y: number; angle: number }> = {};
      const physicsPieces = document.querySelectorAll('[data-physics-piece]');
      
      physicsPieces.forEach((element) => {
        const pieceId = element.getAttribute('data-physics-piece');
        if (pieceId) {
          const rect = element.getBoundingClientRect();
          const transform = window.getComputedStyle(element).transform;
          
          // Extract position and rotation from transform matrix
          let x = rect.left + rect.width / 2;
          let y = rect.top + rect.height / 2;
          let angle = 0;
          
          if (transform && transform !== 'none') {
            const matrix = transform.match(/matrix.*\((.+)\)/);
            if (matrix) {
              const values = matrix[1].split(', ').map(Number);
              if (values.length >= 6) {
                x = values[4] + rect.width / 2;
                y = values[5] + rect.height / 2;
                angle = Math.atan2(values[1], values[0]);
              }
            }
          }
          
          positions[pieceId] = { x, y, angle };
        }
      });

      const response = await fetch('/api/save-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          levelId: currentLevel,
          levelName: getLevelName(),
          positions,
          completionTime: completionTime || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save layout');
      }

      const { id } = await response.json();
      const baseUrl = window.location.origin;
      setPublishedUrl(`${baseUrl}/view/${id}`);
    } catch (error) {
      console.error('Failed to publish:', error);
      alert('Failed to publish layout. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="glass border-neon-cyan/50 shadow-2xl max-w-md w-[90vw] max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DialogHeader className="text-center mb-4">
            <DialogTitle className="text-2xl sm:text-3xl font-black gradient-text mb-2">
              🎉 CONGRATULATIONS!
            </DialogTitle>
            <div className="text-neon-cyan text-lg font-medium mb-2">
              You are now a vibecoder!
            </div>
          </DialogHeader>
          
          <div className="space-y-3 text-center text-foreground">
            <div className="bg-synth-800/50 rounded-lg p-3 border border-neon-purple/30">
              <p className="text-sm leading-relaxed">
                You've mastered the art of physics-based UI reconstruction! 
                {publishedUrl ? ' Your creation has been published!' : ' Share your creation with the world!'}
              </p>
            </div>
            
            {publishedUrl ? (
              <div className="space-y-3">
                <div className="text-neon-green text-sm font-semibold">
                  ✨ Published Successfully!
                </div>
                <div className="bg-synth-900/50 rounded-lg p-3 border border-neon-green/30">
                  <div className="text-xs text-muted-foreground mb-2">Share this link:</div>
                  <div className="text-xs text-neon-cyan break-all font-mono overflow-hidden">
                    {publishedUrl}
                  </div>
                </div>
                <Button
                  variant="neon-cyan"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-sm px-4 py-2"
                >
                  📋 Copy Link
                </Button>
              </div>
            ) : (
              <div className="text-neon-yellow text-sm">
                ⚡ Ready for the real challenge?
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            {!publishedUrl && (
              <Button
                variant="neon-purple"
                size="lg"
                onClick={handlePublish}
                disabled={isPublishing}
                className="text-base px-6 py-3 h-12 font-bold w-full"
              >
                {isPublishing ? '📤 Publishing...' : '🌐 Publish & Share'}
              </Button>
            )}
            
            <Button
              variant="neon-pink"
              size="lg"
              onClick={onNextLevel}
              className="text-base px-6 py-3 h-12 font-bold w-full"
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
