import { Component } from 'react';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import { device } from '../services';

const THRESHOLD = 20;

class ScrollSnap extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.lock = false;
  }

  componentDidMount() {
    const { router, total } = this.props;
    const frame = parseInt(router.query.frame);
    if (!frame || frame > total) {
      this.navigate(1);
    }
    this.$node = document.getElementById('__next');
    this.$node.addEventListener('wheel', this.mouseScrollHandler, true);
    this.$node.addEventListener('touchstart', this.touchStartHandler, true);
    this.$node.addEventListener('touchend', this.touchEndHandler, true);
    this.$node.addEventListener('touchmove', this.touchMoveHandler, true);
    window.addEventListener('keydown', this.onkeypress, true);
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

  snap(direction) {
    const { bizCard } = this.props;
    if (this.lock || bizCard) return;
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
    this.xDown = e.touches[0].clientX;
  };

  touchEndHandler(e) {
    this.yDown = null;
    this.xDown = null;
  }

  touchMoveHandler(e) {
    let yUp = e.touches[0].clientY;
    // let xUp = e.touches[0].clientX;
    // let deltaX = (this.xDown - xUp);
    // if (deltaX > 2) return;
    let deltaY = (this.yDown - yUp);
    if (Math.abs(deltaY) > THRESHOLD) {
      this.snap(deltaY > 0 ? -1 : 1);
    }
  };

  next() {
    const { disableNext, router, total } = this.props;
    const frame = parseInt(router.query.frame);
    if (disableNext) return;
    const index = Math.min(frame + 1, total);
    this.navigate(index);
  };

  prev() {
    const { disablePrev, router } = this.props;
    const frame = parseInt(router.query.frame);
    if (disablePrev) return;
    const index = Math.max(1, frame - 1);
    this.navigate(index);
  };

  navigate(index) {
    const { router } = this.props;
    router.push(`${router.pathname}?frame=${index}`, `${router.pathname}?frame=${index}`, { shallow: true });
  }

  render() {
    return null;
  }
}

export default compose(
  withRouter,
  connect(state => ({
    bizCard: device.selectors.type(state) === 'mobile' && device.selectors.orientation(state) === 'landscape'
  }))
)(ScrollSnap);
