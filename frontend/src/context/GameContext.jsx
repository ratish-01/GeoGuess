import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchRandomStreet, reverseGeocode } from '../services/api';
import { getDistanceFromLatLonInKm, getDirectionHint } from '../utils/geo';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [gameStage, setGameStage] = useState('start');
    const [gameStatus, setGameStatus] = useState('playing');

    const [timeLeft, setTimeLeft] = useState(60);
    const [isPaused, setIsPaused] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [targetLocation, setTargetLocation] = useState(null);
    const [guessHistory, setGuessHistory] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);

    const [currentDistance, setCurrentDistance] = useState(null);
    const [hint, setHint] = useState(null);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        let timer;
        if (gameStage === 'playing' && timeLeft > 0 && !isPaused) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endGame(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStage, timeLeft, isPaused]);

    const startGame = async () => {
        try {
            const data = await fetchRandomStreet();
            setTargetLocation({
                lat: data.lat,
                lng: data.lng,
                imageUrl: data.imageUrl,
                city: data.city
            });
            setGameStage('playing');
            setGameStatus('playing');
            setTimeLeft(300);
            setIsPaused(false);
            setAttempts(0);
            setGuessHistory([]);
            setTotalDistance(0);
            setCurrentDistance(null);
            setHint(null);
            setStartTime(Date.now());
        } catch (error) {
            console.error("Failed to start game", error);
        }
    };

    const togglePause = () => {
        if (gameStage === 'playing') {
            setIsPaused(prev => !prev);
        }
    };

    const stopGame = () => {
        if (gameStage === 'playing') {
            endGame(false, true); // Treat as loss/give up
        }
    };

    const makeGuess = async (lat, lng) => {
        if (gameStage !== 'playing' || isPaused) return; // Prevent guess if paused

        const dist = getDistanceFromLatLonInKm(lat, lng, targetLocation.lat, targetLocation.lng);
        setCurrentDistance(dist);
        setAttempts(prev => prev + 1);

        // Fetch Place Name
        const placeName = await reverseGeocode(lat, lng);

        // Add to history
        const newGuess = {
            lat,
            lng,
            distance: dist,
            time: 300 - timeLeft, // Time elapsed
            locationName: placeName
        };

        setGuessHistory(prev => [...prev, newGuess]);

        // Calculate total distance traveled (from previous guess or start?)
        // Let's count distance from previous guess to current guess for "travel"
        // Or just keeping it simple: Total Error Distance?
        // User asked: "total distance covered from the initial point to the final point"
        // Let's treat the first guess as the "initial point" user clicked.
        if (guessHistory.length > 0) {
            const lastPos = guessHistory[guessHistory.length - 1];
            const travelDist = getDistanceFromLatLonInKm(lastPos.lat, lastPos.lng, lat, lng);
            setTotalDistance(prev => prev + travelDist);
        } else {
            // First click - maybe 0 distance "traveled" or distance from a default center?
            // Let's assume 0 for first guess
        }

        if (dist < 0.5) { // < 500m
            endGame(true);
        }
    };

    const endGame = (won, stopped = false) => {
        setGameStage('result');
        setIsPaused(false);
        if (won) setGameStatus('won');
        else if (stopped) setGameStatus('stopped');
        else setGameStatus('lost');
    };

    const getHint = () => {
        if (!targetLocation || isPaused) return;

        // Logic: specific direction from map center or last guess
        const lastPos = guessHistory.length > 0 ? guessHistory[guessHistory.length - 1] : { lat: 20.5937, lng: 78.9629 }; // Default India center

        const dir = getDirectionHint(lastPos.lat, lastPos.lng, targetLocation.lat, targetLocation.lng);
        setHint(`Go ${dir}`);
    };

    const goToSummary = () => setGameStage('summary');
    const goToReplay = () => setGameStage('replay');
    const goToStart = () => setGameStage('start');

    return (
        <GameContext.Provider value={{
            gameStage,
            gameStatus,
            timeLeft,
            isPaused,
            attempts,
            targetLocation,
            guessHistory,
            totalDistance,
            currentDistance,
            hint,
            startGame,
            togglePause,
            stopGame,
            makeGuess,
            getHint,
            goToSummary,
            goToReplay,
            goToStart
        }}>
            {children}
        </GameContext.Provider>
    );
};
