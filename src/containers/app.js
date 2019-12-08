import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { withRouter } from 'react-router';
import { device, reactor, Card } from '/src/services';
import logo from '/src/images/logo.svg';

// import styles from './app.scss';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    props.fetch('XRvqCiyrR7OOMLGohh9QvnrUOkO2');
    if (props.history.location.pathname === '/') {
      props.history.push('1');
    }
  }

  render() {
    const { route } = this.props;
    return (
      <div id="app" >
        {renderRoutes(route.routes)}
        <Card
          logo={logo}
          firstLine="Lorem Ipsum"
          secondLine="Lorem Ipsum"
          thirdLine="Lorem Ipsum"
        />
      </div >
    );
  }
}

App.propTypes = {
  route: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({}); // eslint-disable-line

const mapDispatchToProps = {
  fetch: reactor.actions.fetch
};

export default compose(
  // reduxRouter.HOC,
  device.HOC,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
