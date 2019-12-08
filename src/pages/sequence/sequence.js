import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { scrollSnap, device } from '/src/services';
import { EyeInTheSky } from '/src/shared';
import { withRouter } from 'react-router';
import styles from './styles.scss';
import SequenceMobile from './sequence-mobile';

class Sequence extends React.PureComponent {
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
    const { isMobile } = this.props;
    if (prevProps.isMobile !== isMobile) {
      this.updateFrameCount();
    }
  }

  updateFrameCount() {
    const { isMobile, setLastFrame } = this.props;
    setLastFrame(isMobile ? 4 : 2);
  }

  render() {
    const { isMobile } = this.props;
    const { frame, forward } = this.state;
    const animation = {
      [styles.comeUp]: forward,
      [styles.comeDown]: !forward
    };
    return (
      <div className={styles.container} >
        <div className={styles.art} >
          <EyeInTheSky blink={isMobile ? forward ? (frame / 2) % 1 !== 0 : (frame / 2) % 1 === 0 : true} />
        </div >
        {isMobile ? (
          <SequenceMobile
            forward={forward}
            frame={frame}
            animation={animation}
          />
        ) : (
          <Fragment >
            {frame === 1 && (
              <div className={cx(styles.content, animation)} >
                <h1 >A new approach in interventional Glaucoma A new approach Leader</h1 >
                <p >MIMS is the at the front of the IG... … a 1.5M procedure,, without stents.... with afficacy similar
                    to....
                    that allows for the most effective IOP management early on..</p >
                <button type="button" >button</button >
              </div >
            )}
            {frame === 2 && <div className={cx(styles.content, animation)} >
              <h1 >Stent-less, Simple & Fast Glaucoma Treatment</h1 >
              <p >MIMS is the at the front of the IG... … a 1.5M procedure,, without stents.... with afficacy similar
                  to....
                  that allows for the most effective IOP management early on..</p >
            </div >}
          </Fragment >
        )}
      </div >
    );
  }
}

Sequence.propTypes = {
  setLastFrame: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  frame: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  frame: parseInt(ownProps.match.params.frame),
  isMobile: device.selectors.type(state) === 'mobile'
});

const mapDispatchToProps = {
  setLastFrame: scrollSnap.actions.setLastFrame
};

export default compose(
  scrollSnap.HOC,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Sequence);
