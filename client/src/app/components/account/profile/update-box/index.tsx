import * as React from 'react';
import { UpdateBoxProps } from '../types';

/**
 * Footer of the profile page, with the notifications, current password input and submit button 
 */
const UpdateBox: React.FunctionComponent<UpdateBoxProps> = ({ notification, onSubmitUpdateAccount, currentPassword, setCurrentPassword }: UpdateBoxProps) =>
  <div className="profile__update-box">
    <div>In order to process the change, please submit your password:</div>
    <input
      type="password"
      className="profile__update-box__password-input"
      onChange={(e): void => setCurrentPassword(e.target.value)}
      value={currentPassword}
    ></input> 
    <div className="profile__update-box__bottom-container">
      <div className="profile__update-box__notification">
        {notification}
      </div>
      <button
        className="profile__update-box__submit"
        onClick={(): void => onSubmitUpdateAccount()}
      >
        Submit
      </button>
    </div>
  </div>

export default UpdateBox;