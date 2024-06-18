import express from 'express';
import { getSavedListings, saveListing } from '../controllers/savedlisting.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/savedlistings', verifyToken, saveListing);
router.get('/savedlistings', verifyToken, getSavedListings);

export default router;