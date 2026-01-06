import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StreetFrame = () => {
    const { targetLocation, gameState } = useGame();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!targetLocation) {
        return (
            <div className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6 w-96 text-center">
                <h2 className="text-xl font-bold mb-2">Welcome to GeoGuess</h2>
                <p className="text-sm opacity-70">Start the game to explore a random street in India.</p>
            </div>
        );
    }

    return (
        <>
            {/* Minimized View */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className={`absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-2 transition-all duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <div className="relative group w-80 h-56 rounded-lg overflow-hidden cursor-pointer" onClick={() => setIsExpanded(true)}>
                    <img
                        src={targetLocation.imageUrl}
                        alt="Street View"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="text-white drop-shadow-md" />
                    </div>
                </div>
                <div className="mt-2 px-1">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Current View</p>
                </div>
            </motion.div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setIsExpanded(false)}
                    >
                        <div className="relative max-w-5xl w-full aspect-video bg-dark-800 rounded-xl overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
                            <img src={targetLocation.imageUrl} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="absolute top-4 right-4 bg-blue-600 text-white font-bold transition-all shadow hover:bg-blue-500 hover:shadow-blue-500/50 p-2 rounded-full"
                            >
                                <Minimize2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default StreetFrame;
