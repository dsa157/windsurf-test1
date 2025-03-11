import express from 'express';

const router = express.Router();

// Define your itinerary routes here
router.get('/', (req, res) => {
  res.send('Itinerary routes working!');
});

export default router;
