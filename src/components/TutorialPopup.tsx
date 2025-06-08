'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface TutorialPopupProps {
  title: string;
  description: string;
  position: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'center';
  onNext?: () => void;
  onSkip?: () => void;
  showButtons?: boolean;
}

const TutorialPopup = ({ 
  title, 
  description, 
  position, 
  onNext, 
  onSkip, 
  showButtons = true 
}: TutorialPopupProps) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-center':
        return 'top-16 left-1/2 transform -translate-x-1/2';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 left-4';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`fixed ${getPositionClasses()} z-[9999] max-w-sm`}
    >
      <div className="glass border-neon-cyan/50 shadow-2xl rounded-lg p-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neon-cyan">{title}</h3>
          <p className="text-sm text-foreground leading-relaxed">{description}</p>
          
          {showButtons && (
            <div className="flex gap-2 justify-end">
              {onSkip && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-xs"
                >
                  Skip Tutorial
                </Button>
              )}
              {onNext && (
                <Button
                  variant="neon-cyan"
                  size="sm"
                  onClick={onNext}
                  className="text-xs"
                >
                  Got it!
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TutorialPopup;
