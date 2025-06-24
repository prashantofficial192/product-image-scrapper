import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const fetchProductDetails = async (url) => {
    console.log("🚀 Starting Meesho Scraper...");
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        console.log("✅ Browser and page created");

        console.log("📝 Setting user agent & viewport...");
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.133 Mobile Safari/537.36');
        await page.setViewport({ width: 360, height: 640, isMobile: true, hasTouch: true });

        console.log("🔧 Spoofing JS properties...");
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
            window.chrome = { runtime: {} };
        });

        console.log("🌐 Setting headers...");
        await page.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Chromium";v="114", "Google Chrome";v="114", "Not:A-Brand";v="99"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
        });

        console.log("⏳ Waiting to appear human...");
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log("➡️ Navigating to URL...");
        const response = await page.goto(url, { waitUntil: 'networkidle2' });
        const status = response.status();
        console.log(`📡 Page status: ${status}`);

        if (status >= 400) {
            throw new Error(`❌ Failed to load page: Status ${status}`);
        }

        console.log("🔍 Waiting for <h1>...");
        await page.waitForSelector('h1', { timeout: 60000 });

        const productTitle = await page.$eval('h1', el => el.textContent.trim());
        console.log("✅ Product Title:", productTitle);

        const productImage = await page.$eval('img[alt][src*="images.meesho.com"]', img => img.src);
        console.log("🖼️  Product Image URL:", productImage);

        return {
            success: true,
            title: productTitle,
            image: productImage
        };

    } catch (err) {
        console.error("🔥 Error:", err.message);
    } finally {
        if (browser) {
            console.log("🛑 Closing browser...");
            await browser.close();
        }
        console.log("✅ Scraping complete.");
    }
};

// https://www.meesho.com/trendy-latest-men-tshirts/p/ho7zk