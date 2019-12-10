import React, { Fragment } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import styles from './styles.scss';
import { DynamicFontBox, EyeInTheSky, ScrollSnap } from '../../shared';

const Mobile = ({ animation, forward, frame }) => {
  return (
    <Fragment>
      <div className={styles.container} >
        <div className={styles.art} >
          <EyeInTheSky blink={forward ? (frame / 2) % 1 !== 0 : (frame / 2) % 1 === 0} />
        </div >
        {frame === 1 && (
          <DynamicFontBox className={cx(styles.content, styles.header, animation)} >
            <h1 >A new approach in intervention&shy;al Glaucoma A new approach Leader</h1 >
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
      </div >
      <ScrollSnap total={4} />
    </Fragment>
  );
};

export default compose(withRouter)(Mobile);
