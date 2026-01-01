"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useGameStore } from '@/store/gameStore';
import Player from './Player';
import Level from './Level';
import Target from './Target';

export default function GameScene() {
  const { status } = useGameStore();

  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ fov: 75 }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <Player />
            <Level />
            
            {/* Targets */}
            <Target position={[0, 2, -10]} />
            <Target position={[-5, 2, -15]} />
            <Target position={[5, 2, -15]} />
            <Target position={[-8, 3, -20]} isMoving />
            <Target position={[8, 3, -20]} isMoving />
            <Target position={[0, 4, -22]} />
            <Target position={[-3, 1, -8]} />
            <Target position={[3, 1, -8]} />
            <Target position={[-12, 2, -12]} />
            <Target position={[12, 2, -12]} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

