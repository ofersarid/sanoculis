"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _services = require("/src/services");

var _shared = require("/src/shared");

var _reactRouter = require("react-router");

var _styles = _interopRequireDefault(require("./styles.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Sequence extends _react.default.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      forward: true,
      frame: props.frame
    };

    if (!props.frame) {
      props.history.push('1');
    }

    this.updateFrameCount();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      forward: nextProps.frame >= prevState.frame,
      frame: nextProps.frame
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      isMobile
    } = this.props;

    if (prevProps.isMobile !== isMobile) {
      this.updateFrameCount();
    }
  }

  updateFrameCount() {
    const {
      isMobile,
      setLastFrame
    } = this.props;
    setLastFrame(isMobile ? 2 : 1);
  }

  render() {
    const {
      isMobile
    } = this.props;
    const {
      frame,
      forward
    } = this.state;
    const animation = {
      [_styles.default.comeUp]: forward,
      [_styles.default.comeDown]: !forward
    };
    return _react.default.createElement("div", {
      className: _styles.default.container
    }, _react.default.createElement("div", {
      className: _styles.default.art
    }, _react.default.createElement(_shared.EyeInTheSky, {
      blink: isMobile ? frame / 2 % 1 !== 0 : true
    })), frame === 1 && (isMobile ? _react.default.createElement("div", {
      className: (0, _classnames.default)(_styles.default.content, animation)
    }, _react.default.createElement("h1", null, "A new approach in interventional Glaucoma A new approach Leader")) : _react.default.createElement("div", {
      className: (0, _classnames.default)(_styles.default.content, animation)
    }, _react.default.createElement("h1", null, "A new approach in interventional Glaucoma A new approach Leader"), _react.default.createElement("p", null, "MIMS is the at the front of the IG... \u2026 a 1.5M procedure,, without stents.... with afficacy similar to.... that allows for the most effective IOP management early on.."), _react.default.createElement("button", {
      type: "button"
    }, "button"))), frame === 2 && (isMobile ? _react.default.createElement("div", {
      className: (0, _classnames.default)(_styles.default.content, animation)
    }, _react.default.createElement("p", null, "MIMS is the at the front of the IG... \u2026 a 1.5M procedure,, without stents.... with afficacy similar to.... that allows for the most effective IOP management early on.."), _react.default.createElement("button", {
      type: "button"
    }, "button")) : null));
  }

}

Sequence.propTypes = {
  setLastFrame: _propTypes.default.func.isRequired,
  match: _propTypes.default.object.isRequired,
  frame: _propTypes.default.number.isRequired,
  isMobile: _propTypes.default.bool.isRequired,
  history: _propTypes.default.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  frame: parseInt(ownProps.match.params.frame),
  isMobile: _services.device.selectors.type(state) === 'mobile'
});

const mapDispatchToProps = {
  setLastFrame: _services.scrollSnap.actions.setLastFrame
};

var _default = (0, _redux.compose)(_services.scrollSnap.HOC, _reactRouter.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(Sequence);

exports.default = _default;