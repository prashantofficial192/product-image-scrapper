import express from 'express';
import { scrapeMeeshoProduct } from '../controllers/meeshoController.js';

const router = express.Router();

router.post('/fetch-details', scrapeMeeshoProduct);

export default router;