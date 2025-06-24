import express from 'express';
import scrapeMyntraProduct from '../services/fetchMyntraProduct.js';

const router = express.Router();

router.post('/fetch-myntra-product', scrapeMyntraProduct);

export default router;