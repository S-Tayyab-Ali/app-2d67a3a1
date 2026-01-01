"use client";

import React, { useEffect } from 'react';
import GameScene from '@/components/game/GameScene';
import HUD from '@/components/ui/HUD';
import Menu from '@/components/ui/Menu';
import { useGameStore } from '@/store/gameStore';

export default function Page() {
  const { status, pauseGame } = useGameStore();

  // Handle ESC key to pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        pauseGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pauseGame]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <GameScene />
      
      {status === 'playing' && <HUD />}
      <Menu />
    </main>
  );
}

