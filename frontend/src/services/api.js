import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchRandomStreet = async () => {
    try {
        const response = await fetch(`${API_URL}/street/random`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching street:', error);
        throw error;
    }
};

export const reverseGeocode = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
        if (!response.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const data = await response.json();
        return data.display_name.split(',').slice(0, 2).join(', ') || 'Unknown Location';
    } catch (error) {
        console.error("Geocoding failed", error);
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
};
