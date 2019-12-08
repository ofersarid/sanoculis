"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _reactRouterConfig = require("react-router-config");

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _reduxDevtoolsExtension = require("redux-devtools-extension");

var _immutable = require("immutable");

var _services = require("./services");

var _routes = _interopRequireDefault(require("./routes"));

require("./global.scss");

require("./fonts/simpler-pro/font.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const store = (0, _redux.createStore)(_services.rootReducer, (0, _immutable.fromJS)(window.INITIAL_STATE || {}), (0, _reduxDevtoolsExtension.composeWithDevTools)((0, _redux.applyMiddleware)(_reduxThunk.default)));
window.store = store;

_reactDom.default.render(_react.default.createElement(_reactRedux.Provider, {
  store: store
}, _react.default.createElement(_reactRouterDom.BrowserRouter, {
  basename: "/"
}, _react.default.createElement("div", null, " ", (0, _reactRouterConfig.renderRoutes)(_routes.default), " "))), document.getElementById('root'));