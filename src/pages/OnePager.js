import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { scrollSnap } from '/src/services';

class OnePager extends React.PureComponent {
  constructor(props) {
    props.setLastFrame(2);
    super(props);
  }

  render() {
    return (
      <div >
        <h1 >One Pager</h1 >
      </div >
    );
  }
}

OnePager.propTypes = {
  setLastFrame: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = {
  setLastFrame: scrollSnap.actions.setLastFrame
}; // eslint-disable-line

export default compose(
  scrollSnap.HOC,
  connect(mapStateToProps, mapDispatchToProps)
)(OnePager);
