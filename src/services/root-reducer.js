import { combineReducers } from 'redux-immutable';
import reactor from './reactor';

const rootReducer = combineReducers({
  reactor: reactor.reducer,
});

export default rootReducer;
