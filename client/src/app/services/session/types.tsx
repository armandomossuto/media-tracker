import { EnumLiteralsOf } from 'types/index';

/**
 * Manages the status of the Session
 * @param loading For waiting for an async task result
 * @param notInitialised Default status when entering the app
 * @param notLogged After initialising, if no tokens are available
 * @param ok User is properly logged in: tokens are present in the cookies
 */
export type SessionStatus = EnumLiteralsOf<typeof SessionStatus>


export const SessionStatus = Object.freeze({
    notInitialised: 'notInitialised' as 'notInitialised',
    notLogged: 'notLogged' as 'notLogged',
    ok: 'ok' as 'ok',
})

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
export type User = {
    id: string,
    username: string,
    email: string,
    creationDate: Date,
    modificationDate: Date,
    accessToken: string,
    refreshToken: string
  }

  /**
   * User tokens
   */
  export type UserToken = {
    refreshToken: string,
    accessToken: string,
    userId?: string,
  }


  /**
   * Action types for the session state reducer
   */
  export type SessionActionType = EnumLiteralsOf<typeof SessionActionType>

  export const SessionActionType = Object.freeze({
      SET_INFO: 'SET_INFO' as 'SET_INFO',
      CHANGE_STATUS: 'CHANGE_STATUS' as 'CHANGE_STATUS',
      SET_TOKENS: 'SET_TOKENS' as 'SET_TOKENS'
  })

  /**
   * Session Actions result for the session state reducer
   */
  export type SessionAction = { type: SessionActionType, payload: any};

  /**
   * Action function type for the session reducer
   */
  export type SessionActionCreator = (message: any) => (SessionAction)


  /**
   * Type of the object to be sent to the server for updating the user information
   */
  export type UpdateUser = {
      id: string,
      password: string,
      newAccountInformation: User
  }