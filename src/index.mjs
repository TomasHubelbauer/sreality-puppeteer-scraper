import puppeteer from 'puppeteer'; // https://github.com/GoogleChrome/puppeteer
import fs from 'fs';
import util from 'util';
import url from 'url';

fs.writeFileAsync = util.promisify(fs.writeFile);

async function scrape() {
  const headless = false;
  const browser = await puppeteer.launch({ headless, slowMo: 50, args: [ '--auto-open-devtools-for-tabs', '--start-maximized' ] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 1280, height: 1024 });

  try {
    switch (process.argv[2]) {
      case 'flat': {
        // TODO: Read search values from command line arguments
        const place = 'Praha';
        const details = {
          priceFrom: '3000000',
          priceTo: '6000000',
          storyFrom: '2',
          storyTo: null,
          areaFrom: '60',
          areaTo: null,
        };
        await scrapeFlats(headless, browser, page, place, details);
        break;
      }
      case 'house': {
        // TODO: Read search values from command line arguments
        const place = 'Praha';
        const details = {

        };
        await scrapeHouses(headless, browser, page, place, details);
        break;
      }
      default: {
        console.error(`Unknown search type ${process.argv[2]}.`);
      }
    }
  } catch (error) {
    console.log(error);
    await browser.close();
  }
}

async function scrapeFlats(headless, browser, page, place, details) {
  await abort3rdPartyRequests(page);
  await page.goto('https://sreality.cz/hledani/byty');

  const placeInput = await page.$(`input[placeholder='město, městská část, ulice']`);
  await placeInput.focus();
  await page.keyboard.type(place);
  await page.keyboard.press('Enter');
  if (!headless) {
    await page.waitForSelector('[id^=typeahead]');
    await page.keyboard.press('Escape');
  }

  const fromInputs = await page.$$(`input[placeholder='od:']`);
  const toInputs = await page.$$(`input[placeholder='do:']`);

  if (details.priceFrom) {
    const priceFromInput = fromInputs[0];
    await priceFromInput.focus();
    await page.keyboard.type(details.priceFrom);
  }

  if (details.priceTo) {
    const priceToInput = toInputs[0];
    await priceToInput.focus();
    await page.keyboard.type(details.priceTo);
  }

  if (details.storyFrom) {
    const storyFromInput = fromInputs[1];
    await storyFromInput.focus();
    await page.keyboard.type(details.storyFrom);
  }

  if (details.storyTo) {
    const storyToInput = toInputs[1];
    await storyToInput.focus();
    await page.keyboard.type(details.storyTo);
  }

  if (details.areaFrom) {
    const areaFromInput = fromInputs[2];
    await areaFromInput.focus();
    await page.keyboard.type(details.areaFrom);
  }

  if (details.areaTo) {
    const areaToInput = toInputs[2];
    await areaToInput.focus();
    await page.keyboard.type(details.areaTo);
  }

  await (await page.$('button[type=submit]')).click();
  await page.waitForSelector('h1.page-title'); // Wait for search results to appear.

  const results = [];
  let hasNextPage = false;

  do {
    console.log('Processing a page of search results…');
    for (const propertyDiv of (await page.$$('.property'))) {
      const postPage = await browser.newPage();
      await abort3rdPartyRequests(postPage);

      const result = {};

      result.link = await page.evaluate(titleA => titleA.href, await propertyDiv.$('a.title'));
      console.log('Obtained link:', result.link);
      await postPage.goto(result.link);
      console.log('Processing a post page…');

      result.title = await page.$eval('span[itemprop=name]>span.name', element => element.textContent);
      console.log('Obtained title:', result.title);

      result.location = await page.$eval('span.location-text', element => element.textContent);
      console.log('Obtained location:', result.location);

      result.price = await page.$eval('span.norm-price', element => element.textContent);
      console.log('Obtained price:', result.price);

      result.description = await page.$eval('div.description', element => element.textContent);
      console.log('Obtained description:', result.description);

      await postPage.close();
      results.push(result);
    }

    // TODO: Compute `hasNextPage` based on button presence in the page.
  } while (hasNextPage);

  await fs.writeFileAsync('results.json', results, { encoding: 'utf8' });
  await browser.close();
}

async function scrapeHouses(headless, browser, page) {
  // TODO.
}

const allowedHosts = [
  'sreality.cz',
  'www.sreality.cz',
  'api.mapy.cz',
  'mapserver.mapy.cz',
  'login.szn.cz',
  'h.imedia.cz' // Required to prevent postMessage origin error
];

// Speed up browsing by disabling 3rd party scripts.
async function abort3rdPartyRequests(page) {
  return;
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    console.log('Inspecting:', request.url);
    const host = url.parse(request.url).host;
    if (!allowedHosts.includes(host)) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

scrape();
