import React from 'react';
import { useGame } from '../context/GameContext';
import { Compass as CompassIcon } from 'lucide-react';

const Compass = () => {
    const { hint } = useGame();

    if (!hint) return null;

    return (
        <div className="absolute bottom-6 left-6 z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-bounce">
            <CompassIcon className="text-blue-400 w-6 h-6 animate-spin-slow" />
            <span className="font-semibold text-sm">{hint}</span>
        </div>
    );
};

export default Compass;
