"use client";

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Crosshair, Target, Zap } from 'lucide-react';

export default function HUD() {
  const { score, ammo, maxAmmo, isReloading, shots, hits } = useGameStore();
  
  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      {/* Top Bar: Score & Stats */}
      <div className="flex justify-between items-start">
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Score</div>
          <div className="text-3xl font-bold font-mono text-emerald-400">{score.toLocaleString()}</div>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white flex gap-6">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Accuracy</div>
            <div className="text-xl font-bold font-mono">{accuracy}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Hits</div>
            <div className="text-xl font-bold font-mono">{hits}/{shots}</div>
          </div>
        </div>
      </div>

      {/* Center: Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-1 h-1 bg-emerald-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-8 h-8 border border-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-white/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-12 bg-white/20"></div>
        </div>
      </div>

      {/* Bottom Right: Ammo */}
      <div className="flex justify-end items-end">
        <div className={`bg-black/40 backdrop-blur-md p-6 rounded-lg border border-white/10 text-white transition-colors duration-300 ${isReloading ? 'border-red-500/50 bg-red-900/20' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ammunition</div>
              <div className="text-4xl font-bold font-mono flex items-baseline gap-2">
                <span className={ammo === 0 ? 'text-red-500' : 'text-white'}>{ammo}</span>
                <span className="text-lg text-gray-500">/ {maxAmmo}</span>
              </div>
            </div>
            <div className="h-12 w-1 bg-white/20"></div>
            <div className="text-2xl">
              {isReloading ? (
                <span className="animate-pulse text-yellow-400 text-sm font-bold uppercase tracking-widest">Reloading...</span>
              ) : (
                <Zap className={ammo < 10 ? 'text-red-500' : 'text-emerald-400'} size={32} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls Hint */}
      <div className="absolute bottom-6 left-6 text-white/50 text-xs font-mono space-y-1">
        <div>[WASD] Move</div>
        <div>[SPACE] Jump</div>
        <div>[LMB] Shoot</div>
        <div>[R] Reload</div>
        <div>[ESC] Pause</div>
      </div>
    </div>
  );
}

