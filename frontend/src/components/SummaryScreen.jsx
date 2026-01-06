import React from 'react';
import { useGame } from '../context/GameContext';
import { Map, RefreshCw, Milestone } from 'lucide-react';

const SummaryScreen = () => {
    const { guessHistory, goToReplay, goToStart, targetLocation, totalDistance, timeLeft, attempts, gameStatus } = useGame();

    // Calculate performance rating (mock logic)
    const rating = Math.max(0, 100 - (attempts * 5) - (totalDistance * 0.5));
    const stars = rating > 80 ? '⭐⭐⭐' : rating > 50 ? '⭐⭐' : '⭐';

    const getStatusEmoji = () => {
        if (gameStatus === 'won') return '🏆';
        if (gameStatus === 'stopped') return '🛑';
        return '💀';
    };

    return (
        <div className="fixed inset-0 z-50 bg-dark-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4 animate-bounce-slow">{getStatusEmoji()}</div>
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                        {gameStatus === 'won' ? 'MISSION ACCOMPLISHED' : gameStatus === 'stopped' ? 'GAME STOPPED' : 'MISSION FAILED'}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Key Stats */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6 flex flex-col gap-2">
                        <span className="text-gray-400">Rating</span>
                        <span className="text-3xl">{stars}</span>
                        <span className="text-xs text-gray-500">Based on attempts & distance</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6 flex flex-col gap-2">
                        <span className="text-gray-400">Target City</span>
                        <span className="text-3xl font-bold text-white">{targetLocation?.city || 'Unknown'}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6 flex flex-col gap-2">
                        <span className="text-gray-400">Total Travel</span>
                        <span className="text-3xl font-mono text-blue-300">{totalDistance.toFixed(2)} km</span>
                    </div>
                </div>

                {/* Journey Log */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold mb-6">Journey Log</h3>
                    <div className="relative border-l-2 border-white/10 ml-4 space-y-8">
                        {guessHistory.map((guess, idx) => (
                            <div key={idx} className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-dark-900"></div>
                                <h4 className="text-xl font-bold text-white">Attempt #{idx + 1}</h4>
                                <p className="text-lg text-blue-300 font-medium">{guess.locationName}</p>
                                <p className="text-gray-400">{guess.distance.toFixed(2)} km from target</p>
                                <p className="text-xs text-gray-500">Time elapsed: {Math.floor(guess.time / 60)}m {guess.time % 60}s</p>
                            </div>
                        ))}
                        <div className="relative pl-8">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-dark-900 animate-pulse"></div>
                            <h4 className="text-xl font-bold text-green-400">Target Location</h4>
                            <p className="text-lg text-gray-300">{targetLocation?.city}</p>
                            <p className="text-gray-400">Destination Reached</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <button
                        onClick={() => {
                            // Trigger Visualize Mode
                            goToReplay(); // Assuming 'replay' handles 'visualize' logic now, or we pass param
                            // Actually context just sets stage to 'replay'. We need to differentiate Visualize vs Static Replay.
                            // User said: "one is visualize and other is quit... map should automatically move".
                            // Let's assume 'replay' stage IS the visualization stage now.
                        }}
                        className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105"
                    >
                        <Map className="w-6 h-6" /> Visualize Journey
                    </button>
                    <button
                        onClick={goToStart}
                        className="flex-1 py-5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
                    >
                        <RefreshCw className="w-6 h-6" /> Quit Game
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SummaryScreen;
