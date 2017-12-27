# SReality Puppeteer Scraper

Scrapes SReality.cs using Puppeteer and reports new and updated posts for a given search.

## Running

```sh
cd src
nvm use
node --experimental-modules index.mjs # Or `nodemon` for file change watching
```

Combine with `cron` to execute periodically and e.g. send email reports…

## Studying

See [doc/notes.md](doc/notes.md).

## Contributing

See [doc/tasks.md](doc/tasks.md).
