"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _immutable = require("immutable");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouter = require("react-router");

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const CONST = {
  LOCATION_CHANGE: 'ROUTER/LOCATION_CHANGE'
};
const initialState = (0, _immutable.fromJS)({
  hash: '',
  pathname: '',
  frame: '1',
  search: '',
  state: '',
  direction: 'still'
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONST.LOCATION_CHANGE:
      if (!action.route.frame) return state;
      const currentFrame = state.getIn(['frame']);
      const nextFrame = action.route.frame;

      if (nextFrame !== currentFrame) {
        const newRoute = Object.assign({
          direction: nextFrame > currentFrame ? 'forwards' : nextFrame < currentFrame ? 'backwards' : state.get('direction')
        }, action.route);
        return (0, _immutable.fromJS)(newRoute);
      }

      return state.mergeDeep((0, _immutable.fromJS)(action.route));

    default:
      return state;
  }
};

const selectors = {
  pathname: state => state.getIn(['router', 'pathname']),
  frame: state => parseInt(state.getIn(['router', 'frame'])),
  direction: state => state.getIn(['router', 'direction'])
};
const actions = {
  updateLocation: route => ({
    type: CONST.LOCATION_CHANGE,
    route
  })
};

const HOC = WrappedComponent => {
  class ReduxRouter extends _react.PureComponent {
    constructor(props) {
      super(props);
      props.update(props.location);
      this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (!(0, _isEqual.default)(nextProps.location.pathname, prevState.pathname)) {
        nextProps.update(Object.assign({}, {
          frame: nextProps.location.pathname.split('/').pop()
        }, nextProps.location));
      }

      return {
        pathname: nextProps.location.pathname
      };
    }

    render() {
      return _react.default.createElement(WrappedComponent, this.props);
    }

  }

  ReduxRouter.propTypes = {
    location: _propTypes.default.shape({
      hash: _propTypes.default.string.isRequired,
      pathname: _propTypes.default.string.isRequired,
      search: _propTypes.default.string.isRequired,
      state: _propTypes.default.object
    }).isRequired,
    update: _propTypes.default.func.isRequired,
    children: _propTypes.default.any,
    params: _propTypes.default.object
  };

  const mapDispatchToProps = dispatch => ({
    update: (...props) => dispatch(actions.updateLocation(...props))
  });

  return (0, _redux.compose)((0, _reactRedux.connect)(() => ({}), mapDispatchToProps), _reactRouter.withRouter)(ReduxRouter);
};

var _default = {
  reducer,
  actions,
  selectors,
  HOC
};
exports.default = _default;