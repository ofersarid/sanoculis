"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxImmutable = require("redux-immutable");

var _reactor = _interopRequireDefault(require("./reactor"));

var _scrollSnap = _interopRequireDefault(require("./scroll-snap"));

var _device = _interopRequireDefault(require("./device"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rootReducer = (0, _reduxImmutable.combineReducers)({
  reactor: _reactor.default.reducer,
  scrollSnap: _scrollSnap.default.reducer,
  device: _device.default.reducer
});
var _default = rootReducer;
exports.default = _default;