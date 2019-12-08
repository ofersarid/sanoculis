require('babel-polyfill');
const functions = require('firebase-functions');
const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  // res.header('Cache-Control', 'private, max-age=300');
  next();
});


// Init code that gets run before all request handlers.
// app.all('*', async (req, res, next) => {
//   res.locals.browser = await puppeteer.launch({
//     args: ['--no-sandbox', '--disable-web-security'],
//     headless: false,
//   });
//   next(); // pass control on to router.
// });

// const RENDER_CACHE = new Map();

const data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const hash = data.match(/src\..*\.js/)[0].split('.')[1];

// const data = fs.readFile(path.join(__dirname, 'index.html'), 'utf8');

async function ssr(url) {
  // if (RENDER_CACHE.has(url)) {
  //   return {
  //     html: RENDER_CACHE.get(url),
  //     ttRenderMs: 0
  //   };
  // }

  const start = Date.now();

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-web-security'],
    headless: false,
  });
  const page = await browser.newPage();
  try {
    // networkidle0 waits for the network to be idle (no requests for 500ms).
    // The page's JS has likely produced markup by this point, but wait longer
    // if your site lazy loads, etc.
    await page.setContent(data, { waitUntil: 'networkidle0' });
    await page.evaluate((url) => {
      const base = document.createElement('base');
      base.href = url;
      // Add to top of head, before all other resources.
      document.head.prepend(base);
    }, url);
    const html = await page.content();
    console.log(html);
    // await page.waitForSelector('#app'); // ensure #posts exists in the DOM.
  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  // RENDER_CACHE.set(url, html); // cache rendered page.

  return {
    html,
    ttRenderMs
  };
}

app.get('**', async function (req, res) {
  const { html, ttRenderMs } = await ssr(`${req.protocol}://${req.get('x-forwarded-host')}`);
  // const { html, ttRenderMs } = await ssr('https://ofersarid.github.io/sanoculis/');
  // Add Server-Timing! See https://w3c.github.io/server-timing/.
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).send(html); // Serve prerendered page as response.





  // res.status(200).send(data);
  // return res.status(200).send(data);
  const fullUrl = req.protocol + '://' + req.get('host');
  // if (!url) {
  //   return res.status(400).send(
  //     'Please provide a URL. Example: ?url=https://example.com');
  // }
  const browser = res.locals.browser;
  try {
    const page = await browser.newPage();
    await page.setContent(data, { waitUntil: 'networkidle2' });
    await page.evaluate((fullUrl) => {
      const base = document.createElement('base');
      base.href = fullUrl;
      // Add to top of head, before all other resources.
      document.head.prepend(base);
    }, fullUrl);
    // await page.addScriptTag({
    //   url: `src.${hash}.js`,
    // });
    const content = await page.content();
    console.log(content);
    await page.waitForSelector('#app');
    // Inject <base> on page to relative resources load properly.
    // const evaluated = await page.evaluate(() => {
    //   return document;
    // });

    // let html = await page.content();
    // res.status(200).send(html);

    // Remove scripts and html imports. They've already executed.
    const root = await page.evaluate(() => {
      return document.getElementById('root');
    });
    // html = html.replace('</body>', `<script src="src.${hash}" /></body>`);
    // await page.close();

    res.status(200).send(data.replace('<div id="root"></div>', root));
  } catch (e) {
    res.status(500).send(e.toString());
  }

  // await browser.close();
});

// app.listen(8080);

exports.ssr = functions.runWith({
  memory: '2GB',
  timeoutSeconds: 60
}).https.onRequest(app);
