import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  legs: [{
    name: {
      type: String,
      required: true
    },
    arrivalDate: {
      type: Date,
      required: true
    },
    departureDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value > this.arrivalDate;
        },
        message: 'Departure date must be after arrival date'
      }
    },
    days: {
      type: Number,
      required: true
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Trip', TripSchema);
