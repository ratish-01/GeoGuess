import React from 'react';
import { useGame } from '../context/GameContext';
import { CheckCircle, XCircle, Clock, Map, Target } from 'lucide-react';

const ResultModal = () => {
    const { gameStage, currentDistance, attempts, timeLeft, totalDistance, goToSummary } = useGame();

    if (gameStage !== 'result') return null;

    const isWin = currentDistance < 0.5;
    const timeTaken = 300 - timeLeft;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-8 max-w-md w-full text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isWin ? 'from-green-400 to-emerald-600' : 'from-red-500 to-orange-600'}`}></div>

                <div className="mb-6 flex justify-center">
                    {isWin ? (
                        <CheckCircle className="w-20 h-20 text-green-400 animate-bounce" />
                    ) : (
                        <XCircle className="w-20 h-20 text-red-400 animate-shake" />
                    )}
                </div>

                <h2 className="text-3xl font-bold mb-2">{isWin ? 'MISSION ACCOMPLISHED' : 'GAME OVER'}</h2>
                <p className="text-gray-400 mb-8">{isWin ? 'You found the location!' : 'Better luck next time.'}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg">
                        <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Attempts</p>
                        <p className="text-xl font-bold">{attempts}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                        <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Time Taken</p>
                        <p className="text-xl font-bold">{Math.floor(timeTaken / 60)}m {timeTaken % 60}s</p>
                    </div>
                    <div className="col-span-2 bg-white/5 p-4 rounded-lg">
                        <Map className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Total Distance Traveled</p>
                        <p className="text-xl font-bold">{totalDistance.toFixed(2)} km</p>
                    </div>
                </div>

                <button
                    onClick={goToSummary}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all"
                >
                    View Summary &rarr;
                </button>
            </div>
        </div>
    );
};

export default ResultModal;
