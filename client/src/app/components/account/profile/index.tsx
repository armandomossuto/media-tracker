import * as React from 'react';
import { useState } from 'react';

// Custom state hooks
import { useSessionState, setAccountInfo } from 'state';

// Types
import { User } from 'types';
import { UpdateUser, UpdateAccountNotification, UpdatedElements, ChangeEnum, changeEnum, UserView } from './types';
import { UserCreate } from '../account-initialise/create/types';

// Utils
import { fetchRequest } from 'utils/fetch';
import { object } from 'prop-types';
import AddValueInput from 'components/common/add-value-input';
import ShowButton from 'components/common/add-value-input/show-button';

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
  const onNewValuesInputChange = (value: string, elementName: string) => {
    debugger
    const updatedAccountInfo = { ...newAccountInfo };
    updatedAccountInfo[elementName] = value;
    setNewAccountInfo(updatedAccountInfo);
    setNotification(UpdateAccountNotification.initial);
  }

  /**
   * @returns An object with only those elements that are not empty
   */
  const determineUpdatedElements = (newInfo: UserCreate) => {
    const updatedElements: UpdatedElements = {};

    // We will only add those values that are not empty
    Object.entries(newInfo).forEach(entry => { 
      if(entry[1])
      {
        updatedElements[entry[0]] = entry[1];
      }
    });

    return updatedElements;
  }

  // Object with all elements that we are going to update
  const updatedElements: UpdatedElements = determineUpdatedElements(newAccountInfo);
  
  // Whether or not we have a new value to update
  const doWeHaveANewValue: boolean = !!updatedElements

  /**
   * Sends Updated Account Information to the server
   */
  const onSubmitUpdateAccount = () => {
    // Validating that there is a change to update and if not, do nothing
    if (!doWeHaveANewValue) {
     return;
    }

    // If the current password is invalid, we show incorrent password notification without the need to make a request to the server
    if(currentPassword.length < 6) {
      return setNotification(UpdateAccountNotification.incorrectCurrentPassword);
    }
    
    // Using UpdateUser class for creating the Object that we are going to send to the server
    const updateUser = new UpdateUser(accountInfo.id, currentPassword, updatedElements);
  
   if (updateUser.validateNewPassword()) {
    // Password submitted is incorrect. We display notification message
    setNotification(UpdateAccountNotification.shortPassword);
  } else if (updateUser.validateNewEmail()) {
     // Email is incorrect. We display notification message
     setNotification(UpdateAccountNotification.invalidEmail);
   } else {
     fetchRequest('api/user/edit', 'POST', sessionStateDispatch, updateUser)
       .then((data: User) => {
         sessionStateDispatch(setAccountInfo(data));
       })
       .catch(error => {
         switch(error.status) {
          case 401:
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
 }

  return(
    <div className="profile">
      <h2>Account Information</h2>

      {Object.keys(accountInfoView).map(elementName =>
        <div className="profile__element" key={`profile-element-${elementName}`}>
          <div className="profile__element__name">
            {elementName}
          </div>
          <div className="profile__element__value">
            {accountInfoView[elementName]}
          </div>
          {changeEnum[elementName] 
          ? <AddValueInput 
              onAddValue={(value: string) => onNewValuesInputChange(value, elementName)}
              showButton={true}
            />
          : null
          }
        </div>
      )}

      <div className="profile_notification">
        {notification}
      </div>

      {doWeHaveANewValue
        ? (<button
            className="profile__submit"
            onClick={onSubmitUpdateAccount}
           >
            Submit
          </button>)
        : null
      }
      
    </div>
  )
}
  
export default Profile;