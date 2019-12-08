"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _autoBind = _interopRequireDefault(require("auto-bind"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouter = require("react-router");

var _styles = _interopRequireDefault(require("./styles.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class EyeInTheSky extends _react.PureComponent {
  constructor(props) {
    super(props);
    (0, _autoBind.default)(this);
    this.pupil = _react.default.createRef();
    this.eye = _react.default.createRef();
  }

  componentDidMount() {
    this.bindEvents();
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  bindEvents() {
    window.addEventListener('mousemove', this.follow, true);
    window.addEventListener('touchstart', this.follow, true);
  }

  unbindEvents() {
    window.removeEventListener('mousemove', this.follow);
    window.removeEventListener('touchstart', this.follow);
  }

  follow(e) {
    const eye = this.eye.current;
    const top = eye.offsetTop;
    const left = eye.offsetLeft;
    const height = eye.offsetHeight;
    const width = eye.offsetWidth;
    const pageX = e.clientX || e.touches[0].clientX;
    const pageY = e.clientY || e.touches[0].clientY;
    let className = '';

    if (pageY > top + height) {
      className += 's';
    } else if (pageY < top) {
      className += 'n';
    }

    if (pageX > left + width) {
      className += 'e';
    } else if (pageX < left) {
      className += 'w';
    }

    eye.className = className;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      frame
    } = this.props;

    if (frame !== prevProps.frame) {
      this.blink();
    }
  }

  blink() {
    const {
      blink
    } = this.props;
    if (!blink) return;
    const eye = this.eye.current;
    clearTimeout(this.to);
    eye.classList.remove(_styles.default.blink);
    this.to = setTimeout(() => {
      eye.classList.add(_styles.default.blink);
    }, 10);
  }

  render() {
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("div", {
      id: "eye-in-the-sky",
      ref: this.eye
    }, _react.default.createElement("div", {
      className: (0, _classnames.default)('pupil'),
      ref: this.pupil
    })));
  }

}

EyeInTheSky.propTypes = {
  match: _propTypes.default.object.isRequired,
  frame: _propTypes.default.number.isRequired,
  blink: _propTypes.default.bool.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  frame: parseInt(ownProps.match.params.frame)
});

const mapDispatchToProps = {}; // eslint-disable-line

var _default = (0, _redux.compose)(_reactRouter.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(EyeInTheSky);

exports.default = _default;