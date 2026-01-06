import React from 'react';
import { useGame } from '../context/GameContext';
import { Timer, MapPin, Play, Pause, Square, HelpCircle, Activity, Navigation } from 'lucide-react';

const DashboardHUD = () => {
    const {
        gameStage,
        timeLeft,
        isPaused,
        attempts,
        currentDistance,
        totalDistance,
        getHint,
        togglePause,
        stopGame
    } = useGame();

    if (gameStage === 'start') return null;

    return (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30 flex flex-col gap-4 md:gap-6 w-[calc(100%-2rem)] md:w-96 font-sans">

            <div className="rounded-xl p-6 shadow-2xl bg-dark-900/40 backdrop-blur-xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3 tracking-wide">
                        <Activity className="text-blue-400 w-6 h-6" />
                        {isPaused ? 'PAUSED' : gameStage.toUpperCase()}
                    </h2>
                    <div className="flex items-center gap-3 bg-dark-800/50 px-4 py-2 rounded-xl border border-white/5">
                        <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`} />
                        <span className="font-mono text-3xl font-bold">{timeLeft}s</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Attempts</p>
                        <p className="text-3xl font-bold">{attempts}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Total Km</p>
                        <p className="text-3xl font-mono text-blue-300">{totalDistance.toFixed(1)}</p>
                    </div>
                </div>

                {currentDistance !== null && (
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
                        <span className="text-sm text-blue-200 font-medium">Last Guess Distance:</span>
                        <span className="font-mono text-blue-300 text-2xl font-bold">{currentDistance.toFixed(2)} km</span>
                    </div>
                )}

                {gameStage === 'playing' && (
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <button
                                onClick={togglePause}
                                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all border ${isPaused
                                    ? 'bg-green-600 hover:bg-green-500 border-green-500 text-white'
                                    : 'bg-yellow-600/80 hover:bg-yellow-500 border-yellow-500 text-white'
                                    }`}
                            >
                                {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                                {isPaused ? 'RESUME' : 'PAUSE'}
                            </button>

                            <button
                                onClick={stopGame}
                                className="px-6 py-4 bg-red-600/80 hover:bg-red-500 rounded-xl font-bold border border-red-500 flex items-center justify-center"
                                title="Stop Game"
                            >
                                <Square className="w-5 h-5 fill-current" />
                            </button>
                        </div>

                        <button
                            onClick={getHint}
                            disabled={isPaused}
                            className={`w-full py-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${isPaused
                                ? 'bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-600/50 hover:bg-purple-600 border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
                                }`}
                        >
                            <HelpCircle className="w-5 h-5" /> GET HINT
                        </button>
                    </div>
                )}

                {gameStage === 'replay' && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6 flex items-center gap-4 animate-fade-in border-l-4 border-green-500 shadow-xl">
                        <Navigation className="text-green-400 w-8 h-8" />
                        <div>
                            <p className="text-sm text-gray-400 uppercase tracking-widest">Replay Mode</p>
                            <p className="font-bold text-xl">Visualizing Path History</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHUD;
