import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function scrapeMyntraProduct() {
    console.log("🚀 Starting Myntra Scraper...");

    const url = 'https://www.myntra.com/tshirts/roadster/roadster-men-white-printed-round-neck-pure-cotton-t-shirt/13750728/buy';
    let browser;

    try {
        console.log("1️⃣  Launching browser...");
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        console.log("✅ Browser and page created");

        console.log("2️⃣  Setting user agent & viewport...");
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)' +
            ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.133 Safari/537.36');
        await page.setViewport({ width: 1200, height: 800 });

        console.log("3️⃣  Spoofing JS properties...");
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
            window.chrome = { runtime: {} };
        });

        console.log("4️⃣  Setting headers...");
        await page.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
        });

        console.log("⏳ Waiting before navigation...");
        await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 sec to appear human

        console.log("➡️ Navigating to URL:", url);
        const response = await page.goto(url, { waitUntil: 'networkidle2' });
        const status = response.status();
        console.log(`📡 Page status: ${status}`);

        if (status >= 400) {
            throw new Error(`❌ Failed to load page: Status ${status}`);
        }

        console.log("🔍 Waiting for product title...");
        await page.waitForSelector('h1.pdp-title', { timeout: 60000 });

        console.log("5️⃣  Extracting product title...");
        const productTitle = await page.$eval('h1.pdp-title', el => el.textContent.trim());
        console.log("✅ Product Title:", productTitle);

        console.log("6️⃣  Extracting product image...");
        const productImage = await page.$eval('img[src*="assets.myntassets.com"]', img => img.src);
        console.log("🖼️  Product Image URL:", productImage);

    } catch (err) {
        console.error("🔥 Error occurred:", err.message);
    } finally {
        if (browser) {
            console.log("🛑 Closing browser...");
            await browser.close();
        }
        console.log("✅ Scraping complete.");
    }
}

export default scrapeMyntraProduct;