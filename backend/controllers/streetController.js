const cities = require("../config/cities");
const { createBBox } = require("../utils/geoUtils");
const { fetchStreetImages } = require("../services/mapillaryService");

async function getRandomStreet(req, res) {
    try {
        const city = cities[Math.floor(Math.random() * cities.length)];

        const bbox = createBBox(city.lat, city.lng);

        const images = await fetchStreetImages(bbox);

        if (!images || images.length === 0) {
            return res.status(404).json({ error: "No images found" });
        }

        const img = images.find(i => i.thumb_1024_url && i.geometry);

        if (!img) {
            return res.status(404).json({ error: "Invalid image data" });
        }

        res.json({
            imageUrl: img.thumb_1024_url,
            lat: img.geometry.coordinates[1],
            lng: img.geometry.coordinates[0],
            city: city.name
        });

    } catch (err) {
        console.error("Mapillary error:", err.message);
        res.status(500).json({ error: "Mapillary fetch failed" });
    }
}

module.exports = { getRandomStreet };
