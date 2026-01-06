import React from 'react';
import { useGame } from '../context/GameContext';
import { Globe } from 'lucide-react';

const StartScreen = () => {
    const { startGame } = useGame();

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-900/95 backdrop-blur-md">
            <div className="max-w-2xl w-full p-10 flex flex-col items-center text-center">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                    <Globe className="w-24 h-24 text-blue-500 relative z-10 animate-spin-slow" />
                </div>

                <h1 className="text-4xl md:text-7xl font-extrabold mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] cursor-default">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent uppercase tracking-widest drop-shadow-2xl">
                        GEOGUESS
                    </span>
                </h1>

                <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl font-light">
                    Discover random streets across India. Guess the location on the map based on the street view.
                </p>

                <div className="backdrop-blur-xl border border-white/20 rounded-xl p-8 w-full mb-10 text-left space-y-4 shadow-2xl bg-dark-800/80">
                    <h3 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">📜 Rules of Engagement:</h3>
                    <p className="text-xl text-gray-300 flex items-center gap-3">
                        <span className="text-blue-400 font-bold">1.</span> Explore the street view for clues.
                    </p>
                    <p className="text-xl text-gray-300 flex items-center gap-3">
                        <span className="text-blue-400 font-bold">2.</span> Pin your guess on the map.
                    </p>
                    <p className="text-xl text-gray-300 flex items-center gap-3">
                        <span className="text-blue-400 font-bold">3.</span> You have 5 minutes to find the target (&lt;500m).
                    </p>
                    <p className="text-xl text-gray-300 flex items-center gap-3">
                        <span className="text-blue-400 font-bold">4.</span> Use hints if you get stuck!
                    </p>
                </div>

                <button
                    onClick={startGame}
                    className="group relative px-8 py-4 bg-blue-600 rounded-xl font-bold text-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center gap-2">
                        Start Adventure 🚀
                    </span>
                </button>
            </div>
        </div>
    );
};

export default StartScreen;
