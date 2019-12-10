require('babel-polyfill');
const functions = require('firebase-functions');
const express = require('express');
const ssr = require('./ssr');
const createStore = require('./create-store');

const app = express();
app.use(express.static(__dirname + '/public'));


app.get('*', async (req, res) => {
  const store = createStore();

  const promises = matchRoutes(routes, req.path).map(({ route }) => {
    return route.loadData ? route.loadData(store) : null;
  });

  Promise.all(promises).then(() => {
    const response = ssr(req, store);
    res.send(response);
  });

});

exports.ssr = functions.runWith({
  memory: '2GB',
  timeoutSeconds: 60
}).https.onRequest(app);
