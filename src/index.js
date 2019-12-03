import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { fromJS } from 'immutable';
import { rootReducer } from './services';
import routes from './routes';

const store = createStore(
  rootReducer,
  fromJS(window.INITIAL_STATE || {}),
  composeWithDevTools(applyMiddleware(thunk)));

window.store = store;

ReactDom.hydrate(
  <Provider
    store={store} >
    <BrowserRouter >
      <div > {renderRoutes(routes)} </div >
    </BrowserRouter >
  </Provider >,
  document.getElementById('root')
);
