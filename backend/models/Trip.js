import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cities: [{
    type: String,
    required: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Trip', TripSchema);
