import express from 'express';

const router = express.Router();

// Define your user routes here
router.get('/', (req, res) => {
  res.send('User routes working!');
});

export default router;
