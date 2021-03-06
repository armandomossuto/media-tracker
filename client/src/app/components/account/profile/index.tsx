import * as React from 'react';
import { useState } from 'react';

// Custom state hooks
import { useSessionState, setAccountInfo } from 'state';

// Types
import { User } from 'types';
import { UpdateUser, UpdateAccountNotification, UpdatedElements, UserView } from './types';
import { UserCreate } from '../account-initialise/create/types';

// Utils
import { fetchRequest } from 'utils/fetch';
import Elements from './elements';
import UpdateBox from './update-box';

const Profile: React.FunctionComponent = () => {

  // We use the Session State hook for having access to the current Account Information and using the dispatcher after an update was successful
  const [{ accountInfo }, sessionStateDispatch] = useSessionState();

  // Acount Information to be showed in this screen
  const accountInfoView = new UserView(accountInfo);


  // Keeps track of the information of the new Account Info typed by the user in the inputs
  const [newAccountInfo, setNewAccountInfo] = useState<UserCreate>({
    email: '',
    username: '',
    password: '',
  });

  // For showing a small text notification in case something goes wrong
  const [notification, setNotification] = useState<UpdateAccountNotification>(UpdateAccountNotification.initial);

  // For requesting the user the current password before making any updates
  const [currentPassword, setCurrentPassword] = useState<string>('');

  /**
   * Handles Input Changes to update the values of the new account info
   * @param elementName - Name of the element that we will update the value
   */
  const onNewValuesInputChange = (value: string, elementName: string): void => {
    const updatedAccountInfo = { ...newAccountInfo };
    updatedAccountInfo[elementName] = value;
    setNewAccountInfo(updatedAccountInfo);
    setNotification(UpdateAccountNotification.initial);
  }

  /**
   * @returns An object with only those elements that are not empty
   */
  const determineUpdatedElements = (newInfo: UserCreate): UpdatedElements => {
    const updatedElements: UpdatedElements = {};

    // We will only add those values that are not empty
    Object.entries(newInfo).forEach(entry => {
      if (entry[1]) {
        updatedElements[entry[0]] = entry[1];
      }
    });

    return updatedElements;
  }

  // Object with all elements that we are going to update
  const updatedElements: UpdatedElements = determineUpdatedElements(newAccountInfo);

  // Whether or not we have a new value to update
  const doWeHaveANewValue: boolean = Object.entries(updatedElements).length !== 0;

  /**
   * Sends Updated Account Information to the server
   */
  const onSubmitUpdateAccount = () => {
    // Validating that there is a change to update and if not, do nothing
    // Submit button is only available if there is a change, but adding this step just in case
    if (!doWeHaveANewValue) {
      return;
    }

    // If the current password is invalid, we show incorrent password notification without the need to make a request to the server
    if (currentPassword.length < 6) {
      return setNotification(UpdateAccountNotification.incorrectCurrentPassword);
    }

    // Using UpdateUser class for creating the Object that we are going to send to the server
    const updateUser = new UpdateUser(accountInfo.id, currentPassword, updatedElements);

    // If new password is incorrect, we display notification message
    if (!updateUser.validateNewPassword()) {
      return setNotification(UpdateAccountNotification.shortPassword);
    }

    // If email is incorrect. We display notification message
    if (!updateUser.validateNewEmail()) {
      return setNotification(UpdateAccountNotification.invalidEmail);
    }

    // Validating if the user is trying to change to the email already configured
    if (updatedElements.email === accountInfo.email) {
      return setNotification(UpdateAccountNotification.sameEmail);
    }

    // Validating if the user is trying to change to the username already configured
    if (updatedElements.username === accountInfo.username) {
      return setNotification(UpdateAccountNotification.sameUsername);
    }

    // If it passes all validations, then we make the fetch request to the server
    fetchRequest('api/user/edit', 'POST', sessionStateDispatch, updateUser)
      .then((data: User) => {
        // If evrything is OK, we update the account information and reset this component internal state
        sessionStateDispatch(setAccountInfo(data));
        setNewAccountInfo({
          email: '',
          username: '',
          password: '',
        });
        setCurrentPassword('');
        setNotification(UpdateAccountNotification.successful);
      })
      .catch(error => {
        switch (error.status) {
          case 403:
            setNotification(UpdateAccountNotification.incorrectCurrentPassword);
            break;

          case 409:
            setNotification(UpdateAccountNotification.duplicatedKey);
            break;

          default:
            setNotification(UpdateAccountNotification.error);
        }
      })
  }

  return (
    <div className="profile">
      <h2 className="profile__title">User Settings</h2>
      <Elements
        accountInfoView={accountInfoView}
        updatedElements={updatedElements}
        onElementsChange={onNewValuesInputChange}
      />
      {doWeHaveANewValue
        ? <UpdateBox
          notification={notification}
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          onSubmitUpdateAccount={onSubmitUpdateAccount}
        />
        : null
      }
      {notification === UpdateAccountNotification.successful
        ? <div className="profile__success-notification"> {notification} </div>
        : null
      }
    </div>
  )
}

export default Profile;