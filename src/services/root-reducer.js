import { combineReducers } from 'redux-immutable';
import reactor from './reactor';
import scrollSnap from './scroll-snap';
import device from './device';

const rootReducer = combineReducers({
  reactor: reactor.reducer,
  scrollSnap: scrollSnap.reducer,
  device: device.reducer,
});

export default rootReducer;
