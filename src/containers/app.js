import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { withRouter } from 'react-router';
import { device, reactor } from '/src/services';

// import styles from './app.scss';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    props.fetch('XRvqCiyrR7OOMLGohh9QvnrUOkO2');
    if (!props.frame) {
      props.history.push('1');
    }
  }

  render() {
    const { route } = this.props;
    return (
      <div id="app" >
        {renderRoutes(route.routes)}
      </div >
    );
  }
}

App.propTypes = {
  route: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  frame: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  frame: parseInt(ownProps.match.params.frame)
});

const mapDispatchToProps = {
  fetch: reactor.actions.fetch
};

export default compose(
  // reduxRouter.HOC,
  device.HOC,
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(App);
