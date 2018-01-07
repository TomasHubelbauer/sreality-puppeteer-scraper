# Tasks

## Ensure `help` commands work for main, `flat` and `house` commands

## Finalize flat detail scraping

## Implement house scraping

## Generate results JSON file

## Generate updates CSV file

## Finalize reading house scraping inputs from the CLI

## Introduce `$waitForAndEval`

Combine `waitForSelector` with `$eval` and report missing selectors for each
page element that is expected to be present.

Put the *Obtained …* `console.log`s in this method also to make the main scraping
function body leaner.

## Recognize next page input and advance pages

Check for next page button, if present, `click` it and `waitForNavigation`, then
set `hasNextPage` to `true` to keep scraping.

## Move Puppeteer utilities to `puppeteer-utils` module
