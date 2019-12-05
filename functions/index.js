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
app.all('*', async (req, res, next) => {
  res.locals.browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
  });
  next(); // pass control on to router.
});

app.get('**', async function (req, res) {
  const data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  res.status(200).send(data);
  // return res.status(200).send(data);
  const hash = data.match(/src\..*\.js/)[0].split('.')[1];
  const url = 'https://ofersarid.github.io/sanoculis';
  // if (!url) {
  //   return res.status(400).send(
  //     'Please provide a URL. Example: ?url=https://example.com');
  // }
  const browser = res.locals.browser;
  try {
    const page = await browser.newPage();
    await page.setContent(data, { waitUntil: 'networkidle2' });
    await epage.waitFor('#app');
    // Inject <base> on page to relative resources load properly.
    const evaluated = await page.evaluate(() => {
      return document;
    });

    let html = await page.content();
    res.status(200).send(html);

    // Remove scripts and html imports. They've already executed.
    // await page.evaluate(() => {
    //   const elements = document.querySelectorAll('script, link[rel="import"]');
    //   elements.forEach(e => e.remove());
    // });

    console.log(evaluated);
    // html = html.replace('</body>', `<script src="src.${hash}" /></body>`);
    // await page.close();

    res.status(200).send(evaluated);
  } catch (e) {
    res.status(500).send(e.toString());
  }

  await browser.close();
});

exports.ssr = functions.runWith({
  memory: '2GB',
  timeoutSeconds: 60
}).https.onRequest(app);
