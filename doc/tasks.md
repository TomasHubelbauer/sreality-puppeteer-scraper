# Tasks

## Document `yarn flat` and `yarn house` CLI switches

## Finalize flat detail scraping

## Implement house scraping

## Generate results JSON file

## Generate updates CSV file

## Finalize reading flat scraping inputs from the CLI

## Finalize reading house scraping inputs from the CLI

## Tweak or ditch 3rd party request blocking

Depending on the trade-off of how hard it is to get it to not break the pages
versus the speed-up it may bring.

## Introduce `$waitForAndEval`

Combine `waitForSelector` with `$eval` and report missing selectors for each
page element that is expected to be present.

Put the *Obtained …* `console.log`s in this method also to make the main scraping
function body leaner.

## Recognize next page input and page

Check for next page button, if present, `click` it and `waitForNavigation`, then
set `hasNextPage` to `true` to keep scraping.

## Move Puppeteer utilities to `puppeteer-utils` module
