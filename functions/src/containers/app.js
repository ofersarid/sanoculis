"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _redux = require("redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _reactRouterConfig = require("react-router-config");

var _reactRouter = require("react-router");

var _services = require("/src/services");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import styles from './app.scss';
class App extends _react.default.PureComponent {
  constructor(props) {
    super(props);
    props.fetch('XRvqCiyrR7OOMLGohh9QvnrUOkO2');

    if (props.history.location.pathname === '/') {
      props.history.push('1');
    }
  }

  render() {
    const {
      route
    } = this.props;
    return _react.default.createElement("div", {
      id: "app"
    }, (0, _reactRouterConfig.renderRoutes)(route.routes));
  }

}

App.propTypes = {
  route: _propTypes.default.object.isRequired,
  fetch: _propTypes.default.func.isRequired,
  history: _propTypes.default.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({}); // eslint-disable-line


const mapDispatchToProps = {
  fetch: _services.reactor.actions.fetch
};

var _default = (0, _redux.compose)( // reduxRouter.HOC,
_services.device.HOC, _reactRouter.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(App);

exports.default = _default;