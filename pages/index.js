import React from 'react';
import { useSelector, connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import styles from './styles.scss';
import { device } from '../services';
import { Desktop, Mobile } from '../containers';

let prevFrame = 1;

const Index = ({ router, isServer }) => {
  // const data = useSelector(state => reactor.selectors.pageData(state, 'test page'));
  const isMobile = useSelector(device.selectors.type) === 'mobile';
  const frame = parseInt(router.query.frame);
  const forward = frame >= prevFrame;
  const animation = frame !== prevFrame ? {
    [styles.comeUp]: forward,
    [styles.comeDown]: !forward
  } : {};
  prevFrame = frame;
  return isMobile ? <Mobile animation={animation} forward={forward} frame={frame} />
    : <Desktop animation={animation} frame={frame} />;
};

export default compose(withRouter, connect())(Index);
