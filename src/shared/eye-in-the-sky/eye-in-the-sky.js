import React, { PureComponent, Fragment } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
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
    const { frame } = this.props;
    if (frame !== prevProps.frame) {
      this.blink();
    }
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

EyeInTheSky.propTypes = {
  match: PropTypes.object.isRequired,
  frame: PropTypes.number.isRequired,
  blink: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  frame: parseInt(ownProps.match.params.frame)
});

const mapDispatchToProps = {}; // eslint-disable-line

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(EyeInTheSky);
