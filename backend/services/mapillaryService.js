const axios = require("axios");

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchStreetImages(bbox) {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            const response = await axios.get(
                "https://graph.mapillary.com/images",
                {
                    params: {
                        access_token: process.env.MAPILLARY_TOKEN,
                        fields: "id,thumb_1024_url,geometry",
                        limit: 5,
                        bbox
                    },
                    timeout: 10000, // 10s timeout
                    headers: {
                        'User-Agent': 'GeoGuess/1.0 (axios)',
                        'Accept-Encoding': 'gzip,deflate,compress'
                    }
                }
            );
            return response.data.data;
        } catch (err) {
            retries++;

            const isNetworkError = !err.response && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED');

            if (isNetworkError && retries < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                continue;
            }

            if (retries >= MAX_RETRIES) {
                throw new Error(`Mapillary API failed after ${MAX_RETRIES} attempts: ${err.message}`);
            }
            throw new Error(err.response?.data?.error?.message || err.message);
        }
    }
}

module.exports = { fetchStreetImages };
