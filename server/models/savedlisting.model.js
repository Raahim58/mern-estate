import mongoose from 'mongoose';

const SavedListingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
}, { timestamps: true });

export default mongoose.model('SavedListing', SavedListingSchema);
