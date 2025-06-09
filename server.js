import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fetchProductImage } from './routes/fetchImage.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS for the specific origin
const corsOptions = {
    origin: ['https://trybeforebuy.space', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// get product image and title from URL
app.post('/get-image', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    const result = await fetchProductImage(url);
    res.json(result);
});

app.get('/', (req, res) => {
    res.send('🛒 Product Image Scraper is running!');
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});