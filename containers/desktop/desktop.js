import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import styles from './styles.scss';
import { EyeInTheSky, ScrollSnap } from '../../shared';

const Desktop = ({ animation, frame }) => {
  return (
    <div className={styles.container} >
      <div className={styles.art} >
        <EyeInTheSky blink />
      </div >
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
      <ScrollSnap total={2} />
    </div >
  );
};

export default compose()(Desktop);
