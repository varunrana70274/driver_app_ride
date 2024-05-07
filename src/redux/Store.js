import {createStore, applyMiddleware, compose} from 'redux';
import reducers from './Reducer';
import thunkMiddleware from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {createLogger} from 'redux-logger';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'home_key'],
};
const enhancers = [
  applyMiddleware(
    thunkMiddleware,
    createLogger({
      collapsed: true,
      predicate: () => __DEV__,
    }),
  ),
];
const enhancer = compose(...enhancers);
const persistedReducer = persistReducer(persistConfig, reducers);
export const store = createStore(persistedReducer, {}, enhancer);
export const persistor = persistStore(store);

// const next = store.dispatch
// store.dispatch = function dispatchAndLog(action) {
//   console.log('dispatching', action)
//   let result = next(action)
//   console.log('next state', store.getState())
//   return result
// }
