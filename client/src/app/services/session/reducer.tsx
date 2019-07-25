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

    case SessionActionType.SET_TOKENS: {
      const { refreshToken, accessToken } = action.payload;
      const newAccountInfo = {...state.accountInfo, refreshToken, accessToken };
      createAuthenticationCookie({ userId: newAccountInfo.id, refreshToken, accessToken });
      return {
        ...state,
        accountInfo: newAccountInfo
      }
    }

    default:
      return state;
  }
};

export default reducer;