// Importing puppeteer for headless browser automation
import puppeteer from 'puppeteer';

// Main function to fetch product image and title from a given e-commerce product URL
export async function fetchProductImage(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new', // run in headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // sandboxing config for deployment
        });

        const page = await browser.newPage();

        // Set a custom user agent to mimic a real browser (avoids bot detection)
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36'
        );

        // Navigate to the product URL
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // 1. Try to get og:image (used for social sharing)
        const ogImage = await page.$$eval('meta[property="og:image"]', (meta) =>
            meta.length ? meta[0].content : null
        );

        // 2. Try to get product title from meta or h1 tag
        let title = await page.title(); // Default fallback

        const ogTitle = await page.$$eval('meta[property="og:title"]', (meta) =>
            meta.length ? meta[0].content : null
        );

        if (ogTitle) title = ogTitle;

        // 3. Fallback image strategy
        let imageUrl = ogImage;

        if (!imageUrl) {
            const altImage = await page.$$eval('img', (imgs) => {
                for (let img of imgs) {
                    if (
                        img.src &&
                        (
                            img.alt?.toLowerCase().includes('product') ||
                            img.src.includes('images/I/')
                        )
                    ) {
                        return img.src;
                    }
                }
                return null;
            });

            if (altImage) {
                imageUrl = altImage.replace(/\._.*?_\./, '.'); // Remove resizing params for Amazon-style images
            }
        }

        if (!imageUrl) {
            return { success: false, message: 'No image found' };
        }

        return {
            success: true,
            imageUrl,
            title
        };

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (browser) await browser.close();
    }
}