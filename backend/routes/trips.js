import express from 'express';
import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import UserReference from '../models/UserReference.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Save trip
router.post('/save', async (req, res) => {
  try {
    const { name, legs, userId } = req.body;

    logger.info('Trips API call - Save trip', { userId, timestamp: new Date().toISOString() });

    // Validate user ID
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    // Find or create UserReference
    let userRef = await UserReference.findOne({ userId });
    if (!userRef) {
      userRef = new UserReference({
        userId,
        objectId: new mongoose.Types.ObjectId()
      });
      await userRef.save();
    }

    // Validate legs
    if (!legs || !legs.length) {
      throw new Error('At least one leg is required');
    }

    // Validate and format legs
    const formattedLegs = legs.map(leg => {
      if (!leg.name || typeof leg.name !== 'string' || !leg.name.trim()) {
        throw new Error('Leg name is required and must be a non-empty string');
      }
      return {
        ...leg,
        name: String(leg.name).trim(),
        days: Math.ceil((new Date(leg.departureDate) - new Date(leg.arrivalDate)) / (1000 * 60 * 60 * 24))
      };
    });

    // Create trip
    const trip = new Trip({
      name,
      legs: formattedLegs,
      user: userRef.objectId
    });

    await trip.save();
    logger.info('Trip saved successfully', { tripId: trip._id, userId, timestamp: new Date().toISOString() });
    res.status(201).json(trip);
  } catch (error) {
    logger.error('Trip save error', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
    res.status(400).json({ 
      error: true,
      message: error.message,
      details: {
        validationErrors: error.message.includes('required') ? 'Check all required fields' : undefined,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Get trips for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info('Trips API call - Get trips for user', { userId, timestamp: new Date().toISOString() });

    // Find the user's ObjectID from userreferences
    const userRef = await UserReference.findOne({ userId }).exec();
    if (!userRef) {
      return res.status(404).json({ error: true, message: `User ${userId} not found` });
    }

    // Find trips associated with the user's ObjectID
    const trips = await Trip.find({ user: userRef.objectId }).exec();
    if (!trips || trips.length === 0) {
      return res.status(404).json({ error: true, message: `No trips found for user ${userId}` });
    }

    res.json(trips);
    logger.info('Trips retrieved successfully', { userId, tripCount: trips.length, timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error('Trip retrieval error', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: true,
      message: error.message,
      details: {
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Get all trips
router.get('/all', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    logger.error('All trips retrieval error', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: true,
      message: error.message,
      details: {
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;
