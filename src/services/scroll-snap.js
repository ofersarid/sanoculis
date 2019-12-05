import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import autoBind from 'auto-bind';

const CNS = {
  DISABLE: 'SNAP_SCROLL/DISABLE',
  COUNT: 'SNAP_SCROLL/COUNT',
  RESET: 'SNAP_SCROLL/RESET',
  SET_LAST_FRAME: 'SNAP_SCROLL/SET_LAST_FRAME'
};

const initialState = fromJS({
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

const HOC = (WrappedComponent) => {
  class ScrollSnap extends Component {
    constructor(props) {
      super(props);
      autoBind(this);
      this.lock = false;
      this.$node = document.getElementById('root');
    }

    componentDidUpdate(prevProps) {
      const { frame, lastFrame, history } = this.props;
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
      const { lastFrame, location } = this.props;
      return nextProps.location.pathname !== location.pathname ||
        nextProps.lastFrame !== lastFrame;
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
        case 37: // left
          break;
        case 38: // up
          this.prev();
          break;
        case 39: // right
          break;
        case 40: // down
          this.next();
          break;
        default:
          break;
      }
    }

    disableScroll() {
      const { frame, disableScrollSnap, lastFrame } = this.props;
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
    };

    touchStartHandler(e) {
      this.lock = false;
      this.yDown = e.touches[0].clientY;
    };

    touchEndHandler(e) {
      this.yDown = null;
    }

    touchMoveHandler(e) {
      let yUp = e.touches[0].clientY;
      let delta = (this.yDown - yUp);
      if (Math.abs(delta) > THRESHOLD) {
        this.snap(delta > 0 ? -1 : 1);
      }
    };

    next() {
      const { disableNext, frame, history } = this.props;
      if (disableNext) return;
      const index = frame + 1;
      history.push(`${index}`);
    };

    prev() {
      const { disablePrev, frame, history } = this.props;
      if (disablePrev) return;
      const index = Math.max(0, frame - 1);
      history.push(`${index}`);
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  ScrollSnap.propTypes = {
    children: PropTypes.any,
    updateFrameIndex: PropTypes.func.isRequired,
    disableScrollSnap: PropTypes.func.isRequired,
    disableNext: PropTypes.bool.isRequired,
    disablePrev: PropTypes.bool.isRequired,
    count: PropTypes.func.isRequired,
    lastFrame: PropTypes.number.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    match: PropTypes.object.isRequired,
    frame: PropTypes.number.isRequired,
    history: PropTypes.object.isRequired
  };

  ScrollSnap.defaultProps = {
    orientation: 'vertical'
  };

  const mapStateToProps = (state, ownProps) => ({
    disableNext: selectors.disableNext(state),
    disablePrev: selectors.disablePrev(state),
    lastFrame: selectors.lastFrame(state),
    frame: parseInt(ownProps.match.params.frame),
  });

  const mapDispatchToProps = dispatch => ({
    updateFrameIndex: (...props) => dispatch(actions.updateFrameIndex(...props)),
    disableScrollSnap: (...props) => dispatch(actions.disable(...props)),
    count: (...props) => dispatch(actions.count(...props))
  });

  return compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
  )(ScrollSnap);
};

export default {
  selectors,
  actions,
  reducer,
  HOC,
};
