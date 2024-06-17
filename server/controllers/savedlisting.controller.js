// controllers/savedlisting.controller.js
import { SavedListing } from '../models'; // Ensure this model is correctly imported

export const saveListing = async (req, res) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id; // Assuming user ID is set by verifyToken middleware

    await SavedListing.create({ userId, listingId });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSavedListings = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedListings = await SavedListing.findAll({ where: { userId } });

    res.status(200).json({ success: true, savedListings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeSavedListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await SavedListing.destroy({ where: { userId, listingId: id } });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
