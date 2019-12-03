import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { device, reactor } from '/src/services';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    props.fetch('XRvqCiyrR7OOMLGohh9QvnrUOkO2');
  }

  render() {
    const { route } = this.props;
    return (
      <div >
        <h1 >App Header</h1 >
        {renderRoutes(route.routes)}
      </div >
    );
  }
}

App.propTypes = {
  route: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = {
  fetch: reactor.actions.fetch,
};

export default compose(
  // reduxRouter.HOC,
  device.HOC,
  connect(mapStateToProps, mapDispatchToProps)
)(App);
