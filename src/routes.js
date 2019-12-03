import { reactor } from './services';
import { App } from './containers';
import { OnePager } from './pages';

export default [{
  component: App,
  loadData: store => store.dispatch(reactor.actions.fetch('XRvqCiyrR7OOMLGohh9QvnrUOkO2')),
  routes: [{
    path: '/:frame',
    component: OnePager,
    exact: true,
  }],
}];
