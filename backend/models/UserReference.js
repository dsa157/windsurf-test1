import mongoose from 'mongoose';

const UserReferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  objectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  }
});

export default mongoose.model('UserReference', UserReferenceSchema);
