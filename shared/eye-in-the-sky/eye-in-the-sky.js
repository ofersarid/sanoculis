import React, { PureComponent, Fragment } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import autoBind from 'auto-bind';
import { withRouter } from 'next/router';
import styles from './styles.scss';

class EyeInTheSky extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.pupil = React.createRef();
    this.eye = React.createRef();
  }

  componentDidMount() {
    this.bindEvents();
    this.blink();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { router } = this.props;
    const frame = parseInt(router.query.frame);
    const prevFrame = parseInt(prevProps.router.query.frame);
    if (frame !== prevFrame) {
      this.blink();
    }
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
    clearTimeout(this.reset);
    const eye = this.eye.current;
    if (!eye) return;
    if (!e.clientX && !e.touches) return;
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
    this.reset = setTimeout(() => {
      eye.className = '';
    }, 3000);
  }

  blink() {
    const { blink } = this.props;
    if (!blink) return;
    const eye = this.eye.current;
    clearTimeout(this.to);
    eye.classList.remove(styles.blink);
    this.to = setTimeout(() => {
      eye.classList.add(styles.blink);
    }, 10);
  }

  render() {
    return (
      <Fragment >
        <div id="eye-in-the-sky" ref={this.eye} >
          <div className={cx('pupil')} ref={this.pupil} />
        </div >
      </Fragment >
    );
  }
}

export default compose(withRouter)(EyeInTheSky);
