require('dotenv').config();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const GEOCODE_API_URL = 'https://api.tomtom.com/search/2/geocode/address.json';
const REVERSE_GEOCODE_API_URL = 'https://api.tomtom.com/search/2/reverseGeocode';
const API_KEY = process.env.TOMTOM_API_KEY;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle geocode address
app.post('/geocode', async (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    console.log(`Geocode address requested for: ${address}`);
    try {
        const url = `${GEOCODE_API_URL}`;
        const response = await axios.get(url, {
            params: {
                key: API_KEY,
                query: address
            }
        });

        const { results } = response.data;
        if (results && results.length > 0) {
            const position = results[0].position;
            res.json({ lat: position.lat, lon: position.lon });
        } else {
            res.status(404).json({ error: 'Coordinates not found' });
        }
    } catch (error) {
        console.error('Error fetching geocode data:', error.message);
        res.status(500).json({ error: 'Error fetching geocode data' });
    }
});

// Route to handle reverse geocode coordinates
app.post('/reverse-geocode', async (req, res) => {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    console.log(`Reverse geocode requested for coordinates: Latitude ${lat}, Longitude ${lon}`);
    try {
        const url = `${REVERSE_GEOCODE_API_URL}/${lat},${lon}.json`;
        const response = await axios.get(url, {
            params: {
                key: API_KEY
            }
        });

        const { addresses } = response.data;
        if (addresses && addresses.length > 0) {
            const location = addresses[0].address.freeformAddress;
            res.json({ location });
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        console.error('Error fetching reverse geocode data:', error.message);
        res.status(500).json({ error: 'Error fetching reverse geocode data' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
