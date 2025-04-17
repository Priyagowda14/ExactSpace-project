const fs = require('fs');
const puppeteer = require('puppeteer');

const url = process.env.SCRAPE_URL;

(async () => {
  if (!url) {
    console.error("SCRAPE_URL not set");
    process.exit(1);
  }

  try {
    const browser = await puppeteer.launch({
      headless: true, // Use true for headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium', // Use system-installed Chromium
    });

    const page = await browser.newPage();
    await page.goto(url);

    // Log the page title for debugging
    const title = await page.title();
    console.log(`Page Title: ${title}`);

    const data = await page.evaluate(() => {
      return {
        title: document.title,
        heading: document.querySelector('h1')?.innerText || "No <h1> found",
      };
    });

    // Save the scraped data
    fs.writeFileSync('/app/scraped_data.json', JSON.stringify(data, null, 2));
    console.log('Scraping completed and data saved!');

    await browser.close();
  } catch (err) {
    console.error("Error during scraping:", err);
    process.exit(1);
  }
})();

