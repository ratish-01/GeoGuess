
// MapBoard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents, Circle, Polyline } from 'react-leaflet';
import { useGame } from '../context/GameContext';
import L from 'leaflet';
import { Pause } from 'lucide-react';

// CSS is now loaded in index.html, but keep this to be safe or remove if conflict?
// Removing 'leaflet/dist/leaflet.css' import as we use CDN in HTML now to ensure it loads
// import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapEvents = () => {
    const { makeGuess, gameStage, isPaused } = useGame();
    useMapEvents({
        click(e) {
            if (gameStage === 'playing' && !isPaused) {
                makeGuess(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
};

const FlyToTarget = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 13);
    }, [center, map]);
    return null;
}

const MapBoard = () => {
    // We just need history and stage
    const {
        guessHistory,
        targetLocation,
        gameStage,
        currentDistance,
        isPaused
    } = useGame();

    const isReplay = gameStage === 'replay';
    const isResult = gameStage === 'result' || gameStage === 'summary'; // effectively end of game

    // Visualization State
    const [visualStep, setVisualStep] = useState(-1); // -1: not started/finished, 0..N: step index
    const mapRef = useRef(null);

    // Auto-play Visualization Logic
    useEffect(() => {
        if (isReplay && guessHistory.length > 0) {
            setVisualStep(0); // Start from first guess
        } else {
            setVisualStep(-1);
        }
    }, [isReplay, guessHistory]);

    useEffect(() => {
        if (!isReplay || visualStep === -1 || !mapRef.current) return;

        const totalSteps = guessHistory.length + 1; // Guesses + Target

        // If finished all steps
        if (visualStep >= totalSteps) {
            // Maybe zoom out to show whole path?
            // For now, stop.
            return;
        }

        // Dynamic Timing Logic
        const stepTime = 3000; // Fixed 3s as requested
        let currentPos, nextPos;

        // Determine current and next positions
        if (visualStep === 0) {
            currentPos = [20.5937, 78.9629]; // From Center (approx)
            const firstGuess = guessHistory[0];
            nextPos = [firstGuess.lat, firstGuess.lng];
        } else if (visualStep < guessHistory.length) {
            const prevGuess = guessHistory[visualStep - 1];
            const currGuess = guessHistory[visualStep];
            currentPos = [prevGuess.lat, prevGuess.lng];
            nextPos = [currGuess.lat, currGuess.lng];
        } else {
            // Last Jump to Target
            const lastGuess = guessHistory[guessHistory.length - 1];
            currentPos = [lastGuess.lat, lastGuess.lng];
            nextPos = [targetLocation.lat, targetLocation.lng];
        }

        // Calculate distance in km
        const dist = L.latLng(currentPos).distanceTo(L.latLng(nextPos)) / 1000;

        // Timer Thresholds: Replaced by fixed 3000ms above

        const timer = setTimeout(() => {
            setVisualStep(prev => prev + 1);
        }, stepTime);

        // Map Movement Logic
        const map = mapRef.current;
        let targetLat, targetLng, zoom = 14;

        if (visualStep < guessHistory.length) {
            // Show Guess
            const guess = guessHistory[visualStep];
            targetLat = guess.lat;
            targetLng = guess.lng;
        } else {
            // Show Target
            targetLat = targetLocation.lat;
            targetLng = targetLocation.lng;
            zoom = 15;
        }

        map.flyTo([targetLat, targetLng], zoom, {
            duration: (stepTime / 1000) - 0.5 // Fly slightly faster than the step
        });

        return () => clearTimeout(timer);

    }, [visualStep, isReplay, guessHistory, targetLocation]);

    // In 'playing' mode, we show the LAST guess + target (only if game over?)
    // Actually, usually in GeoGuessr you only see your guess after you make it.
    // Here we show all history? Or just current? 
    // Let's stick to showing the current guess if available.

    // Replay Logic: Draw lines connecting all guesses -> Target
    const replayPath = isReplay && guessHistory.length > 0
        ? [...guessHistory.map(g => [g.lat, g.lng]), [targetLocation.lat, targetLocation.lng]]
        : [];

    return (
        <div className="absolute inset-0 z-0 select-none">
            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapEvents />

                {/* Live Game Markers */}
                {gameStage === 'playing' && guessHistory.length > 0 && (
                    <>
                        <Marker position={[guessHistory[guessHistory.length - 1].lat, guessHistory[guessHistory.length - 1].lng]}>
                            <Popup>Current Guess</Popup>
                        </Marker>
                        <Circle
                            center={[guessHistory[guessHistory.length - 1].lat, guessHistory[guessHistory.length - 1].lng]}
                            pathOptions={{ color: 'blue' }}
                            radius={currentDistance ? currentDistance * 1000 : 0}
                        />
                    </>
                )}

                {/* Result / Replay Markers */}
                {(isResult || isReplay) && targetLocation && (
                    <Marker position={[targetLocation.lat, targetLocation.lng]} opacity={1}>
                        <Popup autoClose={false} closeOnClick={false} closeButton={false} className="font-bold">
                            <div className="text-center">
                                <p className="text-green-600 text-lg">TARGET</p>
                                <p>{targetLocation.city}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Replay Path & Visualization Markers */}
                {isReplay && (
                    <>
                        {guessHistory.map((guess, idx) => (
                            <Marker key={idx} position={[guess.lat, guess.lng]} opacity={0.8}>
                                {/* Show Tooltip only if this is the current visual step (or maybe always?) */}
                                {/* User wanted "number and name at the top". Let's show it prominently when visualized */}
                                {/* Show Tooltip if this step has been reached in the visualization */}
                                {visualStep >= idx && (
                                    <Tooltip permanent direction="top" offset={[0, -20]} className="custom-tooltip">
                                        <div className="text-center p-1 bg-white/90 rounded border border-blue-500 shadow-lg select-none">
                                            <p className="font-bold text-blue-700 text-sm whitespace-nowrap">#{idx + 1} {guess.locationName}</p>
                                        </div>
                                    </Tooltip>
                                )}
                            </Marker>
                        ))}
                        <Polyline positions={replayPath} color="cyan" dashArray="5, 10" weight={4} />
                    </>
                )}

            </MapContainer>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-radial-vignette z-[400]" style={{ background: 'radial-gradient(circle, transparent 40%, rgba(15, 23, 42, 0.8) 100%)' }}></div>

            {/* Pause Overlay */}
            {isPaused && (
                <div className="absolute inset-0 z-[1000] bg-dark-900/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center animate-pulse">
                        <Pause className="w-20 h-20 text-white mx-auto mb-4" />
                        <h2 className="text-4xl font-extrabold tracking-widest text-white">GAME PAUSED</h2>
                    </div>
                </div>
            )}

            {/* Visualize Exit Button (Floating) */}
            {isReplay && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000]">
                    <button
                        onClick={() => window.location.reload()} // Simple way to 'Quit' back to start/clean state or use context
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                    >
                        Quit Visualization
                    </button>
                </div>
            )}
        </div>
    );
};

export default MapBoard;
