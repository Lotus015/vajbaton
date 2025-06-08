'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import useGameStore from '@/store/gameStore';
import { allLevels } from '@/types';

interface LevelSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LevelSelectorModal({ open, onOpenChange }: LevelSelectorModalProps) {
  const { currentLevel, setLevel } = useGameStore();

  const handleLevelSelect = (levelId: number) => {
    setLevel(levelId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-neon-cyan/50 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text mb-2">
            🎮 Level Selector
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Dev Mode - Select any level to jump to
          </div>
        </DialogHeader>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allLevels.map((level) => (
            <div key={level.id}>
              <Button
                variant={currentLevel === level.id ? "neon-pink" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => handleLevelSelect(level.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <div className="font-semibold">{level.name}</div>
                    <div className="text-sm opacity-80">{level.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {level.pieces.length} pieces
                    </Badge>
                    {currentLevel === level.id && (
                      <Badge variant="default" className="text-xs bg-neon-pink/20 text-neon-pink border-neon-pink">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
              {level.id < allLevels.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          Press <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘K</kbd> to toggle this menu
        </div>
      </DialogContent>
    </Dialog>
  );
}
