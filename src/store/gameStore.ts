import { create } from 'zustand';

interface GameState {
  // Timer
  timeElapsed: number;
  isTimerRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  
  // Game state
  currentLevel: number;
  isGameStarted: boolean;
  isBroken: boolean; // Physics state
  snappedPieces: Set<string>;
  totalPieces: number;
  isLevelRendered: boolean; // Track when animations complete
  
  // Actions
  startGame: () => void;
  breakPieces: () => void;
  resetLevel: () => void;
  snapPiece: (pieceId: string) => void;
  setLevel: (level: number) => void;
  setTotalPieces: (count: number) => void;
  setLevelRendered: (rendered: boolean) => void;
  
  // Level completion
  isLevelComplete: boolean;
  completionTime: number | null;
}

const useGameStore = create<GameState>((set, get) => {
  let timerInterval: NodeJS.Timeout | null = null;

  return {
    // Timer state
    timeElapsed: 0,
    isTimerRunning: false,
    
    // Game state
    currentLevel: 1,
    isGameStarted: false,
    isBroken: false,
    snappedPieces: new Set(),
    totalPieces: 0,
    isLevelRendered: false,
    isLevelComplete: false,
    completionTime: null,

    // Timer actions
    startTimer: () => {
      if (timerInterval) clearInterval(timerInterval);
      
      timerInterval = setInterval(() => {
        set(state => ({ timeElapsed: state.timeElapsed + 50 }));
      }, 50);
      
      set({ isTimerRunning: true });
    },

    stopTimer: () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      set({ isTimerRunning: false });
    },

    resetTimer: () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      set({ timeElapsed: 0, isTimerRunning: false });
    },

    // Game actions
    startGame: () => {
      set({ isGameStarted: true });
      const { startTimer } = get();
      startTimer();
    },

    breakPieces: () => {
      set({ isBroken: true });
    },

    resetLevel: () => {
      const { resetTimer } = get();
      set({ 
        isGameStarted: false,
        isBroken: false,
        snappedPieces: new Set(),
        totalPieces: 0,
        isLevelRendered: false,
        isLevelComplete: false,
        completionTime: null
      });
      resetTimer();
    },

    snapPiece: (pieceId: string) => {
      set(state => {
        const newSnappedPieces = new Set(state.snappedPieces);
        newSnappedPieces.add(pieceId);
        
        const isComplete = newSnappedPieces.size === state.totalPieces;
        
        if (isComplete) {
          if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
          
          return { 
            snappedPieces: newSnappedPieces,
            isLevelComplete: true,
            completionTime: state.timeElapsed,
            isTimerRunning: false
          };
        }
        
        return { snappedPieces: newSnappedPieces };
      });
    },

    setLevel: (level: number) => {
      const { resetLevel } = get();
      set({ currentLevel: level });
      resetLevel();
    },

    setTotalPieces: (count: number) => {
      set({ totalPieces: count });
    },

    setLevelRendered: (rendered: boolean) => {
      set({ isLevelRendered: rendered });
    },
  };
});

export default useGameStore;
