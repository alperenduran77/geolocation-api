const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

const SERVER_URL = `http://localhost:${process.env.PORT || 3000}`;

async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, answer => {
        rl.close();
        resolve(answer);
    }));
}

async function geocodeAddress() {
    const address = await askQuestion('Enter Address: ');
    if (address.toLowerCase() === 'exit') return;

    try {
        const url = `${SERVER_URL}/geocode`;
        const response = await axios.post(url, { address });

        const { lat, lon } = response.data;
        console.log(`Coordinates for ${address}: Latitude ${lat}, Longitude ${lon}`);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

async function reverseGeocodeCoordinates() {
    const latitude = await askQuestion('Enter Latitude: ');
    if (latitude.toLowerCase() === 'exit') return;

    const longitude = await askQuestion('Enter Longitude: ');
    if (longitude.toLowerCase() === 'exit') return;

    try {
        const url = `${SERVER_URL}/reverse-geocode`;
        const response = await axios.post(url, { lat: latitude, lon: longitude });

        const { location } = response.data;
        console.log('Location:', location);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

async function mainMenu() {
    while (true) {
        console.log('\nMain Menu');
        console.log('1. Geocode Address');
        console.log('2. Reverse Geocode Coordinates');
        console.log('3. Exit');
        const choice = await askQuestion('Choose an option: ');

        switch (choice) {
            case '1':
                await geocodeAddress();
                break;
            case '2':
                await reverseGeocodeCoordinates();
                break;
            case '3':
            case 'exit':
                console.log('Goodbye!');
                return;
            default:
                console.log('Invalid choice, please try again.');
        }
    }
}

mainMenu();
