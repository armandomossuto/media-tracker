import { User, SessionActionType, SessionStatus, SessionActionCreator, UserAccessToken } from './types';

export const setAccountInfo: SessionActionCreator = (accountInfo: User) => ({
    type: SessionActionType.SET_INFO,
    payload: accountInfo,
  });
  
  export const  setAccountStatus: SessionActionCreator = (status: SessionStatus) => ({
    type: SessionActionType.CHANGE_STATUS,
    payload: status,
  });

  export const  setTokens: SessionActionCreator = (tokens: UserAccessToken) => ({
    type: SessionActionType.CHANGE_STATUS,
    payload: tokens,
  });