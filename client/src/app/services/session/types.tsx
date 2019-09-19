import { EnumLiteralsOf } from 'types/index';

/**
 * Manages the status of the Session
 * @param loading For waiting for an async task result
 * @param notInitialised Default status when entering the app
 * @param notLogged After initialising, if no tokens are available
 * @param ok User is properly logged in: tokens are present in the cookies
 */
export const SessionStatus = Object.freeze({
  notInitialised: 'notInitialised' as 'notInitialised',
  notLogged: 'notLogged' as 'notLogged',
  ok: 'ok' as 'ok',
})

export type SessionStatus = EnumLiteralsOf<typeof SessionStatus>

/**
 * Session State shared in the App
 * @param {AccountInfo} accountInfo Account Information 
 * @param {SessionState} status Status of the Session
 */
export type SessionState = {
  accountInfo: User;
  status: SessionStatus;
}

/**
 * User information
 */
export interface User {
  id: string;
  username: string;
  email: string;
  creationDate: Date;
  modificationDate: Date;
  [key: string]: string | Date;
}

/**
 * User tokens
 */
export type UserAccessToken = {
  accessToken: string;
  userId?: string;
}

/**
 * Action types for the session state reducer
 */
export const SessionActionType = Object.freeze({
  SET_INFO: 'SET_INFO' as 'SET_INFO',
  CHANGE_STATUS: 'CHANGE_STATUS' as 'CHANGE_STATUS',
  SET_TOKENS: 'SET_TOKENS' as 'SET_TOKENS'
})

export type SessionActionType = EnumLiteralsOf<typeof SessionActionType>

/**
 * Session Actions result for the session state reducer
 */
export type SessionAction = { 
  type: SessionActionType;
  payload: any;
};

/**
 * Action function type for the session reducer
 */
export type SessionActionCreator = (message: any) => (SessionAction)

/**
 * Type of the object to be sent to the server for updating the user information
 */
export type UpdateUser = {
  id: string;
  password: string;
  newAccountInformation: User;
}
