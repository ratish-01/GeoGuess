import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { MapPin } from 'lucide-react';

const TopHintBar = () => {
    const { hint, gameStage } = useGame();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (hint) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000); // Hide after 5 sec
            return () => clearTimeout(timer);
        }
    }, [hint]);

    if (gameStage !== 'playing' || !hint || !visible) return null;

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
            <div className="backdrop-blur-xl rounded-xl px-6 py-3 flex items-center gap-3 bg-blue-600/30 border border-blue-400/50 shadow-blue-500/20">
                <MapPin className="text-blue-300 w-5 h-5 animate-pulse" />
                <span className="text-lg font-bold text-white tracking-wide">{hint}</span>
            </div>
        </div>
    );
};

export default TopHintBar;
