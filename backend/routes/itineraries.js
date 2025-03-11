import express from 'express';
import Trip from '../models/Trip.js';

const router = express.Router();

// Define your itinerary routes here
router.get('/', (req, res) => {
  res.send('Itinerary routes working!');
});

// Save trip endpoint
router.post('/save', async (req, res) => {
  try {
    const { name, cities, userId } = req.body;
    // Convert string dates to Date objects
    const formattedCities = cities.map(city => ({
      ...city,
      arrivalDate: new Date(city.arrivalDate),
      departureDate: new Date(city.departureDate)
    }));
    const newTrip = new Trip({
      name,
      cities: formattedCities,
      user: userId
    });
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error saving trip:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
