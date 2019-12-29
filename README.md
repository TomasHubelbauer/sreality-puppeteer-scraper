# SReality Puppeteer Scraper

Scrapes SReality.cs using Puppeteer and reports new and updated posts for a given search.

Check out https://github.com/TomasHubelbauer/sreality as well.

## Running

```sh
cd src
nvm use
yarn flat help
yarn house help
# Or `nodemon` for file change watching
node --experimental-modules index.mjs help
```

Use `yarn flat:demo` or `yarn house:demo` for prefilled search criteria showcase.

Combine with `cron` to execute periodically and e.g. send email reports…

## Contributing

See [dev plan](doc/tasks.md).

## Studying

See [dev log](doc/notes.md).
