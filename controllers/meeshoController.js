import { fetchProductDetails } from "../services/fetchProductDetails.js";

export const scrapeMeeshoProduct = async (req, res) => {
    const { url } = req.body;

    if (!url || !url.includes('meesho.com')) {
        return res.status(400).json({ error: 'Invalid or missing Meesho product URL' });
    }

    try {
        const result = await fetchProductDetails(url);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Scraping failed', details: error.message });
    }
};