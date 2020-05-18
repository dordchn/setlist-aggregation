#!/usr/bin/env node

const fs = require('fs');
const process = require('process');
const puppeteer = require('puppeteer');

if (process.argv.length < 3) {
  console.log(`Usage: ${process.argv[0]} <url of the artist's page on setlist.fm>`)
  process.exit(0);
}
const artistUrl = process.argv[2];

/***************************************************************/

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const result = [];

  // Load shows
  for (let i = 1; i < 5; i++) { // 5 pages
    await page.goto(artistUrl + `?page=${i}`);
    const shows = await page.evaluate(getShows);
    result.push(...shows);
  }

  // Load songs
  for (let show of result) {
    await page.goto(show.url);
    show.songs = await page.evaluate(getSongs);
  }

  await browser.close();
  console.log(result);
  fs.writeFileSync('./shows.js', 'export default ' + JSON.stringify(result), 'utf-8');
})();

/***************************************************************/

function getShows() {
  return Array.from(document.querySelectorAll('.setlistPreview')).map(e => ({
    name: e.querySelector('.summary').innerText,
    date: e.querySelector('.dateBlock').innerText.trim().replace(/\n/g, ' '),
    url: e.querySelector('.url').href
  }));

}

function getSongs() {
  return Array.from(document.querySelectorAll('.songLabel')).map(e => e.innerText)
}