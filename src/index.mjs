// https://github.com/GoogleChrome/puppeteer
import puppeteer from 'puppeteer';

async function scrape() {
  const headless = false;
  const browser = await puppeteer.launch({ headless, slowMo: 50 });
  const page = await browser.newPage();
  await page.bringToFront();

  // Scrape flats
  try {
    // Go to flat search page
    await page.goto('https://sreality.cz/hledani/byty');

    // Type "Praha" to place input
    const placeInput = await page.$(`input[placeholder='město, městská část, ulice']`);
    await page.keyboard.type('Praha');
    await page.keyboard.press('Enter');

    // TODO: Enter price from-to input values

    // TODO: Enter floor from-to input values

    // Click the search button
    (await page.$('button[type=submit]')).click();

    // Iterate the posts
    for (const propertyDiv of (await page.$$('.property'))) {
      // TODO: Open post detail to have all data
      const nameSpan = await propertyDiv.$('.name');
      console.log('nameSpan', nameSpan);
      const name = await nameSpan.$('*');
      console.log('name', name);
    }

    // TODO: Click next page and jump back or continue

    // TODO: Update post database (SQLite? Git?)
  } catch (e) {
    console.log(e);
  }

  // TODO: Scrape houses

  // Give time to use Developer Tools when developing
  if (!headless) {
    await page.waitFor(60000);
  }

  await browser.close();
}

scrape();
