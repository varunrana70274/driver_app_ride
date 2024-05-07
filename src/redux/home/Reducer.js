import {
  HOME_KEY,
  ARRAY_OF_LATLONG,
  HOME_UPDATE,
  HOME_RESET,
  HOME_REGION,
  CALL_COMPONENT_DID_MOUNT,
  MAP_REF,
  IS_ADMIN_CHAT_SCREEN,
} from '../Types';

export const INIT_STATE = {
  [HOME_KEY]: {
    [HOME_REGION]: {
      latitude: 9.082,
      longitude: 8.6753,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    [CALL_COMPONENT_DID_MOUNT]: 0,
    [MAP_REF]: null,
    [ARRAY_OF_LATLONG]: [],
    [IS_ADMIN_CHAT_SCREEN]: null,
  },
};

export default (state = INIT_STATE, action) => {
  // console.log('reducer data is ===>>>>', { ...state, ...action.payload });
  switch (action.type) {
    case HOME_UPDATE:
      return {...state, [HOME_KEY]: action.payload};
    case HOME_RESET:
      return {...state, [HOME_KEY]: action.payload};
    default:
      return state;
  }
};
