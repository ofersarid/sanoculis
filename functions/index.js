const functions = require('firebase-functions');
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
// app.use(express.static(__dirname + '/public'));
app.use(function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  // res.header('Cache-Control', 'private, max-age=300');
  next();
});


// Init code that gets run before all request handlers.
app.all('*', async (req, res, next) => {
  res.locals.browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
  });
  next(); // pass control on to router.
});

app.get('**', async function (req, res) {
  const url = 'https://ofersarid.github.io/sanoculis';
  // if (!url) {
  //   return res.status(400).send(
  //     'Please provide a URL. Example: ?url=https://example.com');
  // }
  const browser = res.locals.browser;
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Inject <base> on page to relative resources load properly.
    // await page.evaluate(url => {
    //   const base = document.createElement('base');
    //   base.href = url;
    //   document.head.prepend(base); // Add to top of head, before all other resources.
    // }, url);

    // Remove scripts and html imports. They've already executed.
    // await page.evaluate(() => {
    //   const elements = document.querySelectorAll('script, link[rel="import"]');
    //   elements.forEach(e => e.remove());
    // });

    const html = await page.content();
    // await page.close();

    res.status(200).send(html);
  } catch (e) {
    res.status(500).send(e.toString());
  }

  await browser.close();
});

exports.ssr = functions.runWith({
  memory: '2GB',
  timeoutSeconds: 60
}).https.onRequest(app);
