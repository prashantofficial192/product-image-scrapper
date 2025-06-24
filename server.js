import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fetchProductImage } from './routes/fetchImage.js';
import meeshoRotes from "./routes/meeshoRoutes.js"
import myntraRoutes from "./routes/myntraRoutes.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Configure CORS based on environment
const corsOptions = {
    origin: isProduction
        ? ['https://trybeforebuy.space']
        : ['http://localhost:3000', 'http://localhost:5173'],
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

app.use('/api', meeshoRotes);
app.use('/api', myntraRoutes);

app.get('/', (req, res) => {
    res.send('🛒 Product Image Scraper is running!');
});

// app.listen(PORT, () => {
//     const serverUrl = isProduction 
//         ? 'https://product-image-scrapper.onrender.com'
//         : `http://localhost:${PORT}`;
//     console.log(`✅ Server running at ${serverUrl}`);
//     console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
// });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});