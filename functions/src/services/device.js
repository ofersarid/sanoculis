"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _react = _interopRequireWildcard(require("react"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _autoBind = _interopRequireDefault(require("auto-bind"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const reducer = (state = (0, _immutable.fromJS)({
  type: 'mobile',
  orientation: 'portrait'
}), action) => {
  switch (action.type) {
    case 'DEVICE:CHANGE':
      const type = () => {
        switch (true) {
          case window.innerWidth >= 768 && window.innerWidth <= 1024 && window.innerHeight <= 1024:
            return 'tablet';

          case window.innerWidth > 1024 || window.innerWidth === 1024 && window.innerHeight > 1024:
            return 'desktop';

          default:
            return 'mobile';
        }
      };

      return (0, _immutable.fromJS)({
        type: type(),
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      });

    default:
      return state;
  }
};

const actions = {
  update: () => ({
    type: 'DEVICE:CHANGE'
  })
};
const selectors = {
  type: state => state.getIn(['device', 'type']),
  orientation: state => state.getIn(['device', 'orientation'])
};

const HOC = WrappedComponent => {
  class Device extends _react.PureComponent {
    constructor(props) {
      super(props);
      (0, _autoBind.default)(this);
      this.updateDB = (0, _debounce.default)(props.update, 300, {
        leading: false,
        trailing: true
      });
    }

    componentDidMount() {
      this.updateDB();
      this.bindEvents();
    }

    bindEvents() {
      window.addEventListener('orientationchange', () => {
        this.updateDB();
      });
      window.addEventListener('resize', () => {
        this.updateDB();
      });
    }

    render() {
      return _react.default.createElement(WrappedComponent, this.props);
    }

  }

  Device.propTypes = {
    update: _propTypes.default.func.isRequired
  };

  const mapDispatchToProps = dispatch => ({
    update: () => dispatch(actions.update())
  });

  return (0, _reactRedux.connect)(() => ({}), mapDispatchToProps)(Device);
};

var _default = {
  reducer,
  selectors,
  HOC
};
exports.default = _default;