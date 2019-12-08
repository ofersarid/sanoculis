"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("./services");

var _containers = require("./containers");

var _pages = require("./pages");

var _default = [{
  component: Azpp,
  loadData: store => store.dispatch(_services.reactor.actions.fetch('XRvqCiyrR7OOMLGohh9QvnrUOkO2')),
  routes: [{
    path: '/:frame',
    component: _pages.Sequence,
    exact: true
  }]
}];
exports.default = _default;