// require('es6-promise').polyfill();
// require('isomorphic-fetch');
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider }from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import serialize from 'serialize-javascript';
import routes from '/src/routes';
// import { reactor } from './services';

// const USER_ID = 'spE2hod1yWMGHit11N7NbcAn0E23';
// const CACHE = {
//   data: null
// };

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');

const ssr = (req, store) => {
  // let data = CACHE.data;
  // if (!data) {
  //   data = await reactor.getData(USER_ID);
  //   setTimeout(() => {
  //     CACHE.data = null;
  //   }, 60000 * 10); // 10 minutes
  // }
  const content = renderToString(
    <Provider store={store} >
      <StaticRouter location={req.path} context={{}} >
        <div >{renderRoutes(routes)}</div >
      </StaticRouter >
    </Provider >
  );
  const htmlFinal = html.replace('<div id="root"></div>', `<div id="root">${content}</div><script>window.INITIAL_STATE = ${serialize(store.getState())}</script>`);
  return htmlFinal;
};

export default ssr;
