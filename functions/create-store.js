const redux = require('redux');
const thunk = require('redux-thunk');
const services = require('./services');

exports.default = () => redux.createStore(services.rootReducer, redux.applyMiddleware(thunk));
