import React, { PureComponent } from 'react';
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
    this.state = {
      blink: true
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { frame } = this.props;
    if (frame !== prevProps.frame) {
      this.blink();
    }
  }

  blink() {
    this.setState({ blink: false });
    setTimeout(() => {
      this.setState({ blink: true });
    });
  }

  render() {
    const { blink } = this.state;
    return (
      <div className={cx('eye-in-the-sky', styles.container, { [styles.blink]: blink })} >
        <div className={cx('pupil', styles.pupil)} />
      </div >
    );
  }
}

EyeInTheSky.propTypes = {
  match: PropTypes.object.isRequired,
  frame: PropTypes.number.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  frame: parseInt(ownProps.match.params.frame)
});

const mapDispatchToProps = {}; // eslint-disable-line

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(EyeInTheSky);
