"use client";

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Play, RotateCcw, X, Trophy, MousePointer2 } from 'lucide-react';

export default function Menu() {
  const { status, startGame, resumeGame, restartGame, score, hits, shots } = useGameStore();
  
  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  if (status === 'playing') return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        {status === 'menu' && (
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">TARGET RANGE <span className="text-emerald-400">FPS</span></h1>
              <p className="text-slate-400">Advanced Ballistics Training Simulator</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={startGame}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Play size={20} fill="currentColor" />
                START SESSION
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left text-sm text-slate-500 bg-slate-950/50 p-4 rounded-lg border border-white/5">
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-600 mb-1">Movement</span>
                <span className="text-slate-300 font-mono">W A S D + Space</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-600 mb-1">Combat</span>
                <span className="text-slate-300 font-mono">Mouse + Click</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-600 mb-1">Actions</span>
                <span className="text-slate-300 font-mono">R (Reload)</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-600 mb-1">System</span>
                <span className="text-slate-300 font-mono">ESC (Pause)</span>
              </div>
            </div>
          </div>
        )}

        {status === 'paused' && (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-white tracking-widest uppercase">Paused</h2>
            
            <div className="space-y-3">
              <button 
                onClick={resumeGame}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play size={18} fill="currentColor" />
                RESUME
              </button>
              <button 
                onClick={restartGame}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                RESTART
              </button>
            </div>
          </div>
        )}

        {status === 'ended' && (
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">SESSION COMPLETE</h2>
              <p className="text-slate-400 text-sm">Performance Report</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Final Score</div>
                <div className="text-2xl font-bold text-emerald-400">{score}</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Accuracy</div>
                <div className="text-2xl font-bold text-blue-400">{accuracy}%</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Hits</div>
                <div className="text-xl font-bold text-white">{hits}</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Shots Fired</div>
                <div className="text-xl font-bold text-white">{shots}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={restartGame}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

