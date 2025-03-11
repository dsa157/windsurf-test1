import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './utils/logger.js';

import userRoutes from './routes/users.js';
import itineraryRoutes from './routes/itineraries.js';
import tripsRouter from './routes/trips.js';

const app = express();
dotenv.config();

// Middleware
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Routes
app.use('/users', userRoutes);
app.use('/itineraries', itineraryRoutes);
app.use('/trips', tripsRouter);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => logger.info(`Server running on port: ${PORT}`));
  })
  .catch((error) => logger.error(error.message));
