// https://github.com/GoogleChrome/puppeteer
import puppeteer from 'puppeteer';

async function scrape() {
  const headless = false;
  const browser = await puppeteer.launch({ headless, slowMo: 50 });
  const page = await browser.newPage();
  await page.bringToFront();

  // TODO: Switch by process.argv[2] - either -f or -h (flats or houses)

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

    await page.waitForNavigation();

    // Iterate the posts
    for (const propertyDiv of (await page.$$('.property'))) {
      // TODO: Open post detail to have all data
      // TODO: In post detail, use $.evaluate to access textContent on all items
      // TODO: Wrap in do-while and control the while loop by existence of Next button
    }

    // TODO: Write out posts to JSON
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
