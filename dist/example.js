const puppeteer = require("puppeteer");

console.log("Starting");

(async () => {
const browser = await puppeteer.launch({
    headless: true,
    args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox",
    ]
});

const page = await browser.newPage();
await page.goto("https://www.svt.se");
const ss = await page.screenshot({path: "/screenshot.png"});

console.debug("Saved screenshot", ss)
 
await page.close();
await browser.close();

})()
