const fs = require('fs');
require('dotenv').config();
const puppeteer = require('puppeteer');

const settingsFile = '.env';
fs.access(settingsFile, fs.constants.F_OK | fs.constants.R_OK, (err) => {
  if (err) {
    console.error("Settings file '.env' is missing. See Readme file");
    process.exit(1);
  } 
});

(async () => {
    //const browser = await puppeteer.launch({
    //headless: false,
    //  executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome' // This must match your local installation of Chrome
    //});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const direct_login = false; // Login direct via club login url

    // Login page
    if (direct_login) {
        // Alt 1: Sjövalla Login
        await page.goto('https://login.idrottonline.se/authn/authenticate?serviceProviderId=nav-bar&organisationid=3043&sportid=0&title=Sj%c3%b6valla+FK&welcomemessagehint=Organisation&epipagelinkhref=https%3a%2f%2fwww.sjovalla.se%2f&epipagelinktext=Sj%c3%b6valla+FK');
        
        // Insert login credentials - from file '.env' via module 'dotenv'
        console.log("Log in as: " + process.env.PersonUsername);
        await page.type("#userName", process.env.PersonUsername);
        await page.type("input[type=password]", process.env.PersonPassword);

        await page.screenshot({path: 'io-1.png'});
        try {
            const [response] = await Promise.all([
                page.click("button.rf-login-button"),
                // Add or if only member of one club...
                // page.waitForResponse(response => response.url().startsWith('https://topbar.idrottonline.se/account/chooseorganisation') && response.status() === 200)
                page.waitForResponse(response => response.url() === 'https://www.sjovalla.se/' && response.status() === 200)
            ]);
        } catch (e) {
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.screenshot({path: 'io-err.png'});
                console.error("Could not login", e);
            }
        }
        console.log("Logged in");
    } else {

        // Alt 2: Generic Idrott Online login
        // TODO: Not completely done yet
        await page.goto('https://login.idrottonline.se');

        // Insert login credentials - from file '.env' via module 'dotenv'
        console.log("Log in as: " + process.env.PersonUsername);
        await page.type("#userName", process.env.PersonUsername); 
        await page.type("input[type=password]", process.env.PersonPassword);

        await page.screenshot({path: 'private/io-1.png'});
        const [response] = await Promise.all([
            page.click("button.rf-login-button"),
            // Add or if only member of one club...
            page.waitForResponse(response => response.url().startsWith('https://topbar.idrottonline.se/account/chooseorganisation') && response.status() === 200),
            page.waitForSelector('div.alert-info')
            // Du måste välja en organisation som du har behörighet till för att logga in.
        ]);

        // Enter org to OrganisationSelect2
        console.log("Enter org");
        await page.screenshot({path: 'private/io-1.1.png'});
        const [org_response] = await Promise.all([
            page.select('#OrganisationSelect2', '3043'),
            page.click("button.rf-login-button"),
            page.waitForResponse(response => response.url().startsWith('https://www.sjovalla.se') && response.status() === 200)
        ]);
        await page.screenshot({path: 'private/io-1.2.png'});

        // Cookie click
        const [cookie_consent_response] = await Promise.all([
            page.click("#ioui-cookie-info-modal button.btn-primary")
        ]);
        await page.screenshot({path: 'private/io-1.2.png'});
    }

    //console.log("Logged in as: " + user)
    await page.screenshot({path: 'private/io-2.png'});

    await browser.close();
})();