import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { DynamicFontBox } from '/src/shared';
import styles from './styles.scss';

class SequenceMobile extends React.PureComponent {
  render() {
    const { frame, animation } = this.props;
    return (
      <Fragment>
        {frame === 1 && (
          <DynamicFontBox className={cx(styles.content, styles.header, animation)} >
            <h1 >A new approach in interventional Glaucoma A new approach Leader</h1 >
          </DynamicFontBox >
        )}
        {frame === 2 && (
          <div className={cx(styles.content, animation)} >
            <p >MIMS is the at the front of the IG... … a 1.5M procedure,, without stents.... with afficacy similar
                to....
                that allows for the most effective IOP management early on..</p >
            <button type="button" >button</button >
          </div >
        )}
        {frame === 3 && (
          <DynamicFontBox className={cx(styles.content, styles.header, animation)} >
            <h1 >Stent-less, Simple & Fast Glaucoma Treatment</h1 >
          </DynamicFontBox >
        )}
        {frame === 4 && (
          <div className={cx(styles.content, animation)} >
            <p >MIMS is the at the front of the IG... … a 1.5M procedure,, without stents.... with afficacy similar
                to....
                that allows for the most effective IOP management early on..</p >
          </div >
        )}
      </Fragment>
    );
  }
}

SequenceMobile.propTypes = {
  animation: PropTypes.object.isRequired,
  frame: PropTypes.number.isRequired,
  forward: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => ({}); // eslint-disable-line

const mapDispatchToProps = {}; // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SequenceMobile);
