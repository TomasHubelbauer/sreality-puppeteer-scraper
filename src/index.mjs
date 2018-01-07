import puppeteer from 'puppeteer'; // https://github.com/GoogleChrome/puppeteer
import commander from 'commander'; // https://github.com/tj/commander.js
import fs from 'fs';
import util from 'util';
import url from 'url';

fs.writeFileAsync = util.promisify(fs.writeFile);

const headless = false;

commander
  .command('flat [place]')
  .alias('f')
  .description('Searches for flats')
  .option('--pf, --price-from [amount]', 'Price from')
  .option('--pt, --price-to [amount]', 'Price to')
  .option('--sf, --story-from [story]', 'Story from')
  .option('--st, --story-to [story]', 'Story to')
  .option('--af, --area-from [floor]', 'Floor area from')
  .option('--at, --area-to [floor]', 'Floor area to')
  .action(scrapeFlats);

// TODO: Read from `package.json`
commander.version('1.0.0').parse(process.argv);

async function scrapeFlats(place, { priceFrom, priceTo, storyFrom, storyTo, areaFrom, areaTo }) {
  const browser = await puppeteer.launch({ headless, slowMo: 20, args: [ '--auto-open-devtools-for-tabs', '--start-maximized' ] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 1280, height: 1024 });
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

  if (priceFrom) {
    const priceFromInput = fromInputs[0];
    await priceFromInput.focus();
    await page.keyboard.type(priceFrom);
  }

  if (priceTo) {
    const priceToInput = toInputs[0];
    await priceToInput.focus();
    await page.keyboard.type(priceTo);
  }

  if (storyFrom) {
    const storyFromInput = fromInputs[1];
    await storyFromInput.focus();
    await page.keyboard.type(storyFrom);
  }

  if (storyTo) {
    const storyToInput = toInputs[1];
    await storyToInput.focus();
    await page.keyboard.type(storyTo);
  }

  if (areaFrom) {
    const areaFromInput = fromInputs[2];
    await areaFromInput.focus();
    await page.keyboard.type(areaFrom);
  }

  if (areaTo) {
    const areaToInput = toInputs[2];
    await areaToInput.focus();
    await page.keyboard.type(areaTo);
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

async function scrapeHouses(place, {}) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 20, args: [ '--auto-open-devtools-for-tabs', '--start-maximized' ] });
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto('https://sreality.cz/hledani/domy');
  // TODO.
}
