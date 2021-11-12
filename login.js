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

var cancel = async function(msg) {
    console.log("Cancelling - " + msg);
    await browser.close();
};

var paus = async function(response, time) {
    [response] = await Promise.all([
        new Promise((resolve, reject) => setTimeout(resolve, time))
    ]);
};

(async () => {
    //const browser = await puppeteer.launch({
    //headless: false,
    //  executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome' // This must match your local installation of Chrome
    //});
    /*const browser = await puppeteer.launch({
        headless: false
    });*/
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
    await page.setCookie(
        {name:"io.acceptCookies", value: "true", path: "/", domain: ".idrottonline.se"},
        {name:"topbar-login-chosenorganisationid", value: "3043", path: "/", domain: ".idrottonline.se"});

    // Abort images, to speed up process
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'image') {
            request.abort();
        /*} else if (request._url.startsWith("https://quantcast.mgr.consensu.org") ) {
            console.log("Abort cookie consent");
            request.abort();*/
        } else if (request.resourceType() === 'document') {
            //console.log(`Page: ${request._url}`, request);
            console.log(`Page: ${request._url}`);
            request.continue();
        } else {
            request.continue();
        }
    });

    try {

        // Go to login page
        //await page.goto('https://ioa.idrottonline.se/');
        //await page.goto('https://login.idrottonline.se/authn/authenticate?serviceProviderId=nav-bar');
        //await page.goto('https://login.idrottonline.se/');
        //await page.goto('https://orientering.sjovalla.se/');
        await page.goto('https://login.idrottonline.se/');

        /*
        https://login.idrottonline.se/

        submitChooseOrganisation: function () {

                var d = $.Deferred();
                var organisationData = $('#OrganisationSelect2').select2('data') || [],
                    org = organisationData[0] || {};

                var data = JSON.stringify({
                    PersonId: chooseOrganisation.getPersonId(),
                    OrganisationId: org.Id || org.id,
                    SportId: org.SportId || org.sportId || org.sportid,
                    OrganisationUrl: org.Url || org.url,
                    HomePage: chooseOrganisation.getHomePage(),
                    AppGuid: chooseOrganisation.getAppGuid(),
                    IncomingPage: chooseOrganisation.getIncomingPage()
                });

                $.ajax({
                    url: "/account/chooseorganisation",
                    contentType: "application/json; charset=utf-8",
                    data: data,
                    type: "POST"
                }).done(function (result) {
                    d.resolve(result)
                });
                return d.promise();
            }

            To trigger logging in, execute:

            chooseOrganisation.submit(chooseOrganisation.submitChooseOrganisation)

        */
        
        console.log("### Surfa till inloggning");
        let [response] = await Promise.all([
            //page.waitForSelector('#IdrottOnline-LoginBoxTarget'),
            //page.click("#IdrottOnline-LoginBoxTarget"),
            //page.waitForResponse(response => response.url().startsWith('https://login.idrottonline.se/authn/authenticate?serviceProviderId=nav-bar') && response.status() === 200),
            page.waitForSelector('#userName').then(() => {
                console.log('Inloggningsfält klart');
            }),
            page.waitForSelector('input[type=password]').then(() => {
                console.log('Lösenordsfält klart');
            })
            /*page.waitForSelector('#userName').then(async () => {
                await page.type("#userName", process.env.PersonUsername); 
                console.log('Something here');
                await page.$eval('#userName', el => el.value = 'Test');
                const username = await page.evaluate(() => {
                    const f = document.querySelector('#userName');
                    return f;
                });
                console.log("username entered:", username);
            }),
            page.waitForSelector('input[type=password]')*/
            //Inloggning - 
            /*await page.waitForFunction(
                text => document.querySelector('body').innerText.includes(text),
                {},
                "Inloggning för Sjövalla FK - Orientering"
            )*/
        ]);

        /*[response] = await Promise.all([
            new Promise((resolve, reject) => setTimeout(resolve, 15000))
        ]);*/
        console.log("### Börja logga in");
        //await paus(response, 7000);

        // Insert login credentials - from file '.env' via module 'dotenv'
        console.log("### Log in as: " + process.env.PersonUsername);
        await page.type("#userName", process.env.PersonUsername, { delay: 100 }); 
        await page.type("input[type=password]", process.env.PersonPassword, { delay: 100 });

        await page.screenshot({path: 'private/io-1.0.png'});
        [response] = await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle2'}),
            page.click("button.rf-login-button"),
            page.waitForResponse(response => response.url().startsWith('https://topbar.idrottonline.se/account/chooseorganisation') && response.status() === 200),
            //page.waitForSelector('div.alert-info'),
            page.waitForNavigation({waitUntil: 'networkidle2'}),
            page.setCookie(
                {name:"io.acceptCookies", value: "true", path: "/", domain: ".idrottonline.se"},
                {name:"topbar-login-chosenorganisationid", value: "3043", path: "/", domain: ".idrottonline.se"
            })
            //page.waitForNavigation()
            // Du måste välja en organisation som du har behörighet till för att logga in.
        ]);

        //console.log(document.location);

        await page.waitForTimeout(3000);
        await page.screenshot({path: 'private/io-1.1.png'});
        //await page.waitForSelector('div.alert-info');
        if (false) {
            await page.waitForTimeout(2000);
            await page.evaluate(() => {
                // TODO handle hard-coded values better...
                var data = JSON.stringify({
                    PersonId: chooseOrganisation.getPersonId(),
                    OrganisationId: "3043",
                    SportId: 0,
                    OrganisationUrl: "https://www.sjovalla.se/",
                    HomePage: "",
                    AppGuid: chooseOrganisation.getAppGuid(),
                    IncomingPage: chooseOrganisation.getIncomingPage()
                });

                //chooseOrganisation.submit(chooseOrganisation.submitChooseOrganisation)
            });
            await page.waitForTimeout(5000);
        }
        // $("#login-button")
        //await page.screenshot({path: 'private/io-2.0.png'});
        console.log("page", page);
        console.log("response", response);
        [response] = await Promise.all([
            page.waitForNavigation(),
            page.click("#login-button")
        ]);

        // Enter org to OrganisationSelect2
        //console.log(`Select organisation nr: ${process.env.OrganisationNr}`);
        await page.screenshot({path: 'private/io-2.1.png'});
        /*[response] = await Promise.all([
            page.select('select#OrganisationSelect2', process.env.OrganisationOL),
            //page.waitForSelector('#select2-OrganisationSelect2-container', {visible:true}).then(
            //    page.select('select#OrganisationSelect2', process.env.OrganisationOL)
            //),
            //page.waitForSelector('#select2-OrganisationSelect2-container', {visible:true}),
            //page.tap('#select2-OrganisationSelect2-container'),
            //page.waitForSelector('#select2-OrganisationSelect2-results li:nth-child(6) div', {visible:true}),
            //page.tap('#select2-OrganisationSelect2-results li:nth-child(6) div'), // Orientering
            //+page.click("button.rf-login-button"),
            //new Promise((resolve, reject) => setTimeout(resolve, 3000))//,
            //page.waitForResponse(response => response.url().startsWith('https://www.sjovalla.se') && response.status() === 200),
            //page.waitForResponse(response => response.url().startsWith('https://topbar.idrottonline.se') && response.status() === 200),
            //+page.waitForResponse(response => response.url().startsWith('https://topbar.idrottonline.se/account/chooseorganisation') && response.status() === 200),
            //+page.waitForNavigation({waitUntil: 'networkidle2'}),
            //+page.select('select#OrganisationSelect2', process.env.OrganisationOL),
            //'#select2-OrganisationSelect2-container'
            await page.waitForFunction(
                text => document.querySelector('body').innerText.includes(text),
                {},
                text
            ),
            //+page.click("button.rf-login-button")
        ]);*/

        console.log(`Selected organisation`);
        await page.screenshot({path: 'private/io-2.2.png'});

        /*[response] = await Promise.all([
            page.click("button.rf-login-button")
        ]);*/

        console.log("Probably signed in!");
        await page.screenshot({path: 'private/io-2.3.png'});

        //const finalResponse = await page.waitForResponse(response => response.url().startsWith('https://www.sjovalla.se') && response.status() === 200);

        // Cookie click
        /*[response] = await Promise.all([
            page.click("#ioui-cookie-info-modal button.btn-primary")
        ]);
        await page.screenshot({path: 'private/io-1.2.png'});
        */

        //console.log("Logged in as: " + user)
        //await page.screenshot({path: 'private/io-2.png'});

        // Wait a moment
        /*[response] = await Promise.all([
            new Promise((resolve, reject) => setTimeout(resolve, 15000))
        ]);*/
        await browser.close();
    } catch (err) {
        if (err instanceof puppeteer.errors.TimeoutError) {
          // Do something if this is a timeout.
          console.log("Timeout Error", err);
        } else {
          // Other error
          console.log("Error: ", err);
        }
        await browser.close();
    }
    console.log("End of code");
    //await browser.close();
})();