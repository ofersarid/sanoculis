import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { fromJS } from 'immutable';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import combined from '../combined-reducers';
import Head from 'next/head';
import { reactor, device } from '../services';
import { Card } from '../shared';

const makeStore = (initialState, options) => {
  const store = createStore(combined, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
  return store;
};

class MyApp extends App {
  static async getInitialProps({ ctx }) {
    const data = await reactor.getData('XRvqCiyrR7OOMLGohh9QvnrUOkO2');
    ctx.store.dispatch(reactor.actions.storeData(data));
    ctx.store.dispatch(device.actions.ssr(ctx.req.headers['user-agent']));
    return {};
  }

  render() {
    const { Component, pageProps, store, isServer } = this.props;
    return (
      <Provider store={store} >
        <Head >
          <meta charSet="utf-8" />
          <link rel="icon" href={`/images/favicon.ico?v=${new Date().getTime()}`} />
          <title >Sanoculis</title >
          <meta name="description" content="Lorem Ipsum" />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
          />
          <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
        </Head >
        <Component {...pageProps} isServer={isServer} />
        <Card
          logo="/images/logo.svg"
          firstLine="Lorem Ipsum"
          secondLine="Lorem Ipsum"
          thirdLine="Lorem Ipsum"
        />
      </Provider >
    );
  }
}

export default compose(
  withRedux(makeStore, {
    serializeState: state => state.toJS(),
    deserializeState: state => fromJS(state)
  }),
  device.HOC
)(MyApp);
