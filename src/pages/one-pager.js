import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { scrollSnap } from '/src/services';
import { withRouter } from 'react-router';
import styles from './one-pager.scss';

class OnePager extends React.PureComponent {
  constructor(props) {
    props.setLastFrame(2);
    super(props);
    this.state = {
      forward: true,
      frame: props.frame
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      forward: nextProps.frame >= prevState.frame,
      frame: nextProps.frame
    };
  }

  render() {
    const { frame } = this.props;
    const { forward } = this.state;
    const animation = {
      [styles.comeUp]: forward,
      [styles.comeDown]: !forward
    };
    return (
      <div className={styles.container} >
        <div className={styles.art} ></div >
        {frame === 1 && (
          <div className={cx(styles.content, animation)} >
            <h1 >A new approach in interventional Glaucoma A new approach Leader</h1 >
          </div >
        )}
        {frame === 2 && (
          <div className={cx(styles.content, animation)} >

            <p >MIMS is the at the front of the IG... … a 1.5M procedure,, without stents.... with afficacy similar
                to....
                that allows for the most effective IOP management early on..</p >
            <button type="button" >button</button >
          </div >
        )}
      </div >
    );
  }
}

OnePager.propTypes = {
  setLastFrame: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  frame: PropTypes.number.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  frame: parseInt(ownProps.match.params.frame)
});

const mapDispatchToProps = {
  setLastFrame: scrollSnap.actions.setLastFrame
};

export default compose(
  scrollSnap.HOC,
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(OnePager);
