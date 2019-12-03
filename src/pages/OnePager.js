import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

class App extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div >
        <h1>One Pager</h1>
      </div >
    );
  }
}

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = {}; // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(App);
