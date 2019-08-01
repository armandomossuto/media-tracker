import * as React from 'react';
import { useState } from 'react';

// Types
import { UserCreate, CreateAccountNotification }  from './types';
import { AccountInitialiseProps, AccountInitialiseStatus } from "../types";
import { SessionStatus } from 'types';
import { UserLogInResponse } from '../log-in/types';

// Utilities and state actions 
import { useSessionState, setAccountInfo, setAccountStatus } from 'state'
import { validateEmail } from 'utils/validations';
import { simpleFetch } from 'utils/fetch';
import { createAuthenticationCookie } from 'utils/cookies';

const Create = ({ setAccountIntialiseStatus }: AccountInitialiseProps) => {

  // Session State dispatcher
  const [, sessionStateDispatch ] = useSessionState();

  /**
   * Keeps track of the information typed by the user in the inputs
   */
  const [newAccountInfo, setNewAccountInfo] = useState<UserCreate>({
    username: '',
    email: '',
    password: ''
  });

  /**
   * For showing a small text notification
   */
  const [notification, setNotification] = useState<CreateAccountNotification>(CreateAccountNotification.initial);

  /**
  * Handles Input Changes to update the values
  */
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, elementName: string) => {
    const updatedAccountInfo = { ...newAccountInfo };
    updatedAccountInfo[elementName] = e.target.value;
    setNewAccountInfo(updatedAccountInfo);
    setNotification(CreateAccountNotification.initial);
  }

  /**
   * Sends Account Information to the server
   */
  const onSubmitAccount = () => {
     // Validating that the user introduced an username
     if (newAccountInfo.username.length < 1) {
      setNotification(CreateAccountNotification.noUsername);
    } else if (newAccountInfo.password.length < 6) {
      // Password submitted is incorrect. We display notification message
      setNotification(CreateAccountNotification.shortPassword);
    } else if (!validateEmail(newAccountInfo.email)) {
      // Email is incorrect. We display notification message
      setNotification(CreateAccountNotification.invalidEmail);
    } else {
      simpleFetch('api/user', 'POST', newAccountInfo )
        .then((data: UserLogInResponse) => {
          sessionStateDispatch(setAccountInfo(data.userInformation));
          sessionStateDispatch(setAccountStatus(SessionStatus.ok));
          createAuthenticationCookie(data.userToken);
        })
        .catch(error => {
          if(error.status === 409) {
            setNotification(CreateAccountNotification.duplicatedKey);
          } else {
            setNotification(CreateAccountNotification.error);
          }
        })
    }
  }

  /**
   * Calls for change status action that will redirect to LogIn Component
   */
  const onClickLogInAccount = () => setAccountIntialiseStatus(AccountInitialiseStatus.logIn);

  const { username, email, password } = newAccountInfo;

  return (
    <div className="create-account">
      <h2> Create an account </h2>
      <div className="create-account__element">
        <p>Username: </p>
        <input
          type="text"
          className="create-account__element__input"
          onChange={e => onInputChange(e, 'username')}
          value={username}
        ></input>
      </div>
      <div className="create-account__element">
        <p>E-mail: </p>
        <input
          type="text"
          className="create-account__element__input"
          onChange={e => onInputChange(e, 'email')}
          value={email}
        ></input>
      </div>
      <div className="create-account__element">
        <p>Password: </p>
        <input
          type="password"
          className="create-account__element__input"
          onChange={e => onInputChange(e, 'password')}
          value={password}
        ></input>
      </div>
      <div className="create-account__notification">
        {notification}
      </div>
      <button
        className="create-account__submit"
        onClick={onSubmitAccount}
      >
        Create Account
      </button>
      <div className="create-account__redirect-message">
        If you already have an account
        <span onClick={onClickLogInAccount} className="create-account__redirect-message__trigger"> click here </span>
        to go to the Log In screen
      </div>
    </div>
  )
}


export default Create;