"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _immutable = require("immutable");

var _redux = require("redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouter = require("react-router");

var _reactRedux = require("react-redux");

var _autoBind = _interopRequireDefault(require("auto-bind"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const CNS = {
  DISABLE: 'SNAP_SCROLL/DISABLE',
  COUNT: 'SNAP_SCROLL/COUNT',
  RESET: 'SNAP_SCROLL/RESET',
  SET_LAST_FRAME: 'SNAP_SCROLL/SET_LAST_FRAME'
};
const initialState = (0, _immutable.fromJS)({
  disable: {
    next: false,
    prev: false
  },
  lastFrame: 1
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CNS.DISABLE:
      return state.set('disable', action.disable);

    case CNS.SET_LAST_FRAME:
      return state.set('lastFrame', action.index);

    case CNS.RESET:
      return initialState;

    default:
      return state;
  }
};

const selectors = {
  disableNext: state => state.getIn(['scrollSnap', 'disable', 'next']),
  disablePrev: state => state.getIn(['scrollSnap', 'disable', 'prev']),
  count: state => state.getIn(['scrollSnap', 'count']),
  lastFrame: state => state.getIn(['scrollSnap', 'lastFrame'])
};
const actions = {
  disable: (disableNext, disablePrev) => dispatch => dispatch({
    type: CNS.DISABLE,
    disable: {
      next: disableNext,
      prev: disablePrev
    }
  }),
  count: count => ({
    type: CNS.COUNT,
    count
  }),
  reset: count => ({
    type: CNS.RESET,
    count
  }),
  setLastFrame: index => dispatch => dispatch({
    type: CNS.SET_LAST_FRAME,
    index
  })
};
const THRESHOLD = 10;

const HOC = WrappedComponent => {
  class ScrollSnap extends _react.Component {
    constructor(props) {
      super(props);
      (0, _autoBind.default)(this);
      this.lock = false;
      this.$node = document.getElementById('root');
    }

    componentDidUpdate(prevProps) {
      const {
        frame,
        lastFrame,
        history
      } = this.props;

      if (frame === 1) {
        document.body.style['overscroll-behavior'] = 'auto';
      } else {
        document.body.style['overscroll-behavior'] = 'contain';
      }

      if (lastFrame < frame) {
        history.push(`${lastFrame}`);
      }

      this.disableScroll();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      const {
        lastFrame,
        location
      } = this.props;
      return nextProps.location.pathname !== location.pathname || nextProps.lastFrame !== lastFrame;
    }

    componentDidMount() {
      this.$node.addEventListener('wheel', this.mouseScrollHandler, true);
      this.$node.addEventListener('touchstart', this.touchStartHandler, true);
      this.$node.addEventListener('touchend', this.touchEndHandler, true);
      this.$node.addEventListener('touchmove', this.touchMoveHandler, true);
      window.addEventListener('keydown', this.onkeypress, true);
      this.disableScroll();
    }

    componentWillUnmount() {
      this.$node.removeEventListener('wheel', this.mouseScrollHandler, true);
      this.$node.removeEventListener('touchstart', this.touchStartHandler, true);
      this.$node.removeEventListener('touchend', this.touchEndHandler, true);
      this.$node.removeEventListener('touchmove', this.touchMoveHandler, true);
      window.removeEventListener('keydown', this.onkeypress, true);
    }

    onkeypress(e) {
      switch (e.keyCode) {
        case 37:
          // left
          break;

        case 38:
          // up
          this.prev();
          break;

        case 39:
          // right
          break;

        case 40:
          // down
          this.next();
          break;

        default:
          break;
      }
    }

    disableScroll() {
      const {
        frame,
        disableScrollSnap,
        lastFrame
      } = this.props;

      if (frame > 1 && frame < lastFrame) {
        disableScrollSnap(false, false);
      } else if (frame === 1 && lastFrame > 1) {
        disableScrollSnap(false, true);
      } else if (frame === lastFrame && lastFrame > 1) {
        disableScrollSnap(true, false);
      } else {
        disableScrollSnap(true, true);
      }
    }

    snap(direction) {
      if (this.lock) return;
      this.lock = true;

      switch (direction) {
        case -1:
          this.next();
          break;

        case 1:
          this.prev();
          break;

        default:
          break;
      }
    }

    mouseScrollHandler(e) {
      clearTimeout(this.to);
      const delta = e.wheelDelta;

      if (Math.abs(delta) > THRESHOLD) {
        this.snap(delta < 0 ? -1 : 1);
      }

      this.to = setTimeout(() => {
        this.lock = false;
      }, 100);
    }

    touchStartHandler(e) {
      this.lock = false;
      this.yDown = e.touches[0].clientY;
    }

    touchEndHandler(e) {
      this.yDown = null;
    }

    touchMoveHandler(e) {
      let yUp = e.touches[0].clientY;
      let delta = this.yDown - yUp;

      if (Math.abs(delta) > THRESHOLD) {
        this.snap(delta > 0 ? -1 : 1);
      }
    }

    next() {
      const {
        disableNext,
        frame,
        history
      } = this.props;
      if (disableNext) return;
      const index = frame + 1;
      history.push(`${index}`);
    }

    prev() {
      const {
        disablePrev,
        frame,
        history
      } = this.props;
      if (disablePrev) return;
      const index = Math.max(0, frame - 1);
      history.push(`${index}`);
    }

    render() {
      return _react.default.createElement(WrappedComponent, this.props);
    }

  }

  ScrollSnap.propTypes = {
    children: _propTypes.default.any,
    updateFrameIndex: _propTypes.default.func.isRequired,
    disableScrollSnap: _propTypes.default.func.isRequired,
    disableNext: _propTypes.default.bool.isRequired,
    disablePrev: _propTypes.default.bool.isRequired,
    count: _propTypes.default.func.isRequired,
    lastFrame: _propTypes.default.number.isRequired,
    location: _propTypes.default.shape({
      pathname: _propTypes.default.string.isRequired
    }).isRequired,
    match: _propTypes.default.object.isRequired,
    frame: _propTypes.default.number.isRequired,
    history: _propTypes.default.object.isRequired
  };
  ScrollSnap.defaultProps = {
    orientation: 'vertical'
  };

  const mapStateToProps = (state, ownProps) => ({
    disableNext: selectors.disableNext(state),
    disablePrev: selectors.disablePrev(state),
    lastFrame: selectors.lastFrame(state),
    frame: parseInt(ownProps.match.params.frame)
  });

  const mapDispatchToProps = dispatch => ({
    updateFrameIndex: (...props) => dispatch(actions.updateFrameIndex(...props)),
    disableScrollSnap: (...props) => dispatch(actions.disable(...props)),
    count: (...props) => dispatch(actions.count(...props))
  });

  return (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), _reactRouter.withRouter)(ScrollSnap);
};

var _default = {
  selectors,
  actions,
  reducer,
  HOC
};
exports.default = _default;