import {combineReducers} from 'redux';
import {DESTROY_SESSION} from '../Types';
// Combine all reducers.
const appReducer = combineReducers({
  ride: (state = {}) => state,
});
const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  if (action.type === DESTROY_SESSION) state = undefined;

  return appReducer(state, action);
};
export default rootReducer;
