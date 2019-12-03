import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

const CONST = {
  LOCATION_CHANGE: 'ROUTER/LOCATION_CHANGE',
};

const initialState = fromJS({
  hash: '',
  pathname: '',
  frame: '1',
  search: '',
  state: '',
  direction: 'still',
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONST.LOCATION_CHANGE:
      if (!action.route.frame) return state;
      const currentFrame = state.getIn(['frame']);
      const nextFrame = action.route.frame;
      if (nextFrame !== currentFrame) {
        const newRoute = Object.assign({
          direction: nextFrame > currentFrame ? 'forwards' : nextFrame < currentFrame ? 'backwards' : state.get('direction'),
        }, action.route);
        return fromJS(newRoute);
      }
      return state.mergeDeep(fromJS(action.route));

    default:
      return state;
  }
};

const selectors = {
  pathname: state => state.getIn(['router', 'pathname']),
  frame: state => parseInt(state.getIn(['router', 'frame'])),
  direction: state => state.getIn(['router', 'direction']),
};

const actions = {
  updateLocation: route => ({
    type: CONST.LOCATION_CHANGE,
    route,
  })
};

const HOC = (WrappedComponent) => {
  class ReduxRouter extends PureComponent {
    constructor(props) {
      super(props);
      props.update(props.location);
      this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (!isEqual(nextProps.location.pathname, prevState.pathname)) {
        nextProps.update(Object.assign({}, { frame: nextProps.location.pathname.split('/').pop() }, nextProps.location));
      }
      return {
        pathname: nextProps.location.pathname,
      };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  ReduxRouter.propTypes = {
    location: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
      state: PropTypes.object,
    }).isRequired,
    update: PropTypes.func.isRequired,
    children: PropTypes.any,
    params: PropTypes.object,
  };

  const mapDispatchToProps = dispatch => ({
    update: (...props) => dispatch(actions.updateLocation(...props)),
  });

  return compose(
    connect(() => ({}), mapDispatchToProps),
    withRouter,
  )(ReduxRouter);
};

export default {
  reducer,
  actions,
  selectors,
  HOC,
};
