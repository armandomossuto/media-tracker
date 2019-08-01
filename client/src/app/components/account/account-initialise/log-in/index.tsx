import * as React from 'react';
import { useState } from 'react';

// Types
import { UserLogIn, LogInNotification, UserLogInResponse } from './types';
import { AccountInitialiseStatus, AccountInitialiseProps } from '../types';
import { SessionStatus } from 'types';

// Utilities and state actions 
import { simpleFetch } from 'utils/fetch'
import { useSessionState, setAccountInfo, setAccountStatus } from 'state'
import { createAuthenticationCookie } from 'utils/cookies';

/**
 * Account Log In Page component
 */
const LogIn = ({ setAccountIntialiseStatus }: AccountInitialiseProps) => {

  const [sessionState, sessionStateDispatch] = useSessionState();

  const initialLogInInfo: UserLogIn = {
    username: '',
    password: ''
  }

  // Keeps track of the information typed by the user in the inputs
  const [ logInInfo, setLogInInfo] = useState(initialLogInInfo);

  // For showing a small text notification
  const [notification, setNotification] = useState<LogInNotification>(LogInNotification.initial);

  /**
   * Changes to the accout creation component
   */
  const changeToCreateAccount = () => setAccountIntialiseStatus(AccountInitialiseStatus.create);

  /**
   * Handles Input Changes to update the values
   */
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, elementName: string) => {
    const updatedLogInInfo = { ...logInInfo  };
    updatedLogInInfo[elementName] = e.target.value;
    setLogInInfo(updatedLogInInfo);
    setNotification(LogInNotification.initial);
  }

  /**
   * Sends Account Information to the server
   */
  const onSubmitAccount = () => {
    // Validating that the user introduced an username
    if (logInInfo.username.length < 1) {
      setNotification(LogInNotification.noUsername);
    } else if (logInInfo.password.length < 6) {
      // Validating the password length before submiting any request
      setNotification(LogInNotification.shortPassword);
    } else {
      simpleFetch('api/user/login', 'POST', logInInfo)
        .then((data: UserLogInResponse) => {
          sessionStateDispatch(setAccountInfo(data.userInformation));
          sessionStateDispatch(setAccountStatus(SessionStatus.ok));
          createAuthenticationCookie(data.userToken);
        })
        .catch((error: Response) => {
          if(error.status === 401) {
            setNotification(LogInNotification.invalid);
          } else {
            setNotification(LogInNotification.error);
          }
        });
    }
  }

  const { username, password } = logInInfo;

  return (
    <div className="log-in">
      <h2> Log in </h2>
      <div className="log-in__element">
        <p>Username: </p>
        <input
          type="text"
          className="log-in__element__input"
          onChange={e => onInputChange(e, 'username')}
          value={username}
        ></input>
      </div>
      <div className="log-in__element">
        <p>Password: </p>
        <input
          type="password"
          className="log-in__element__input"
          onChange={e => onInputChange(e, 'password')}
          value={password}
        ></input>
      </div>
      <div className="log-in__notification">
        {notification}
      </div>
      <button
        className="log-in__submit"
        onClick={onSubmitAccount}
      >
        Submit
      </button>
      <div className="log-in__redirect-message">
        If you don&quot;t have an account <span onClick={changeToCreateAccount} className="log-in__redirect-message__trigger">click here</span> to create one
      </div>
    </div>
  )
}

export default LogIn;