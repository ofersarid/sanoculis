import { combineReducers } from 'redux-immutable';
import reactor from './reactor';
// import reduxRouter from './redux-router';
import scrollSnap from './scroll-snap';

const rootReducer = combineReducers({
  reactor: reactor.reducer,
  // router: reduxRouter.reducer,
  scrollSnap: scrollSnap.reducer,
});

export default rootReducer;
