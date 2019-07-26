// Importing action types
import { SessionAction, SessionState, SessionActionType } from './types';
import { initialState } from './store';
import { createAuthenticationCookie } from 'utils/cookies'

const reducer: React.Reducer<SessionState, SessionAction> = (state = initialState, action) => {
  switch (action.type) {

    case SessionActionType.CHANGE_STATUS:
      return {
        ...state,
        status: action.payload,
      };

    case SessionActionType.SET_INFO:
      return {
        ...state,
        accountInfo: action.payload,
      }

    default:
      return state;
  }
};

export default reducer;