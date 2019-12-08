import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import serialize from 'serialize-javascript';
import routes from './routes';
// import { reactor } from './services';

// const USER_ID = 'spE2hod1yWMGHit11N7NbcAn0E23';
// const CACHE = {
//   data: null
// };

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

  const html = `
      <html>
        <head>
        <link rel="stylesheet" type="text/css" href="all.css" />
      </head>
        <body>
            <div id="root">${content}</div>
            <script>window.INITIAL_STATE = ${serialize(store.getState())}</script>
            <script src="client.js"></script>
        </body>
      </html>
    `;

  return html;
};

export default ssr;
