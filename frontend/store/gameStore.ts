import { create } from 'zustand';

export type GameStatus = 'menu' | 'playing' | 'paused' | 'ended';

interface GameState {
  status: GameStatus;
  score: number;
  shots: number;
  hits: number;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  
  shoot: () => void;
  hitTarget: () => void;
  reload: () => void;
  finishReload: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'menu',
  score: 0,
  shots: 0,
  hits: 0,
  ammo: 30,
  maxAmmo: 30,
  isReloading: false,

  startGame: () => set({ 
    status: 'playing', 
    score: 0, 
    shots: 0, 
    hits: 0, 
    ammo: 30, 
    isReloading: false 
  }),
  
  pauseGame: () => set((state) => ({ 
    status: state.status === 'playing' ? 'paused' : state.status 
  })),
  
  resumeGame: () => set((state) => ({ 
    status: state.status === 'paused' ? 'playing' : state.status 
  })),
  
  endGame: () => set({ status: 'ended' }),
  
  restartGame: () => set({ 
    status: 'playing', 
    score: 0, 
    shots: 0, 
    hits: 0, 
    ammo: 30, 
    isReloading: false 
  }),

  shoot: () => set((state) => {
    if (state.ammo > 0 && !state.isReloading) {
      return { 
        ammo: state.ammo - 1, 
        shots: state.shots + 1 
      };
    }
    return state;
  }),

  hitTarget: () => set((state) => ({ 
    score: state.score + 100, 
    hits: state.hits + 1 
  })),

  reload: () => set((state) => {
    if (state.ammo < state.maxAmmo && !state.isReloading) {
      return { isReloading: true };
    }
    return state;
  }),

  finishReload: () => set((state) => ({ 
    ammo: state.maxAmmo, 
    isReloading: false 
  })),
}));

