import * as React from 'react';
import { UpdateBoxProps } from '../types';

const UpdateBox = ({ notification, onSubmitUpdateAccount, currentPassword, setCurrentPassword }: UpdateBoxProps) =>
  <div className="profile__update-box">
    <div>In order to process the change, please submit your password:</div>
    <input
      type="password"
      className="log-in__element__profile__update-box__password-input"
      onChange={(e) => setCurrentPassword(e.target.value)}
      value={currentPassword}
    ></input> 
    <div className="profile__update-box__bottom-container">
      <div className="profile__update-box__notification">
        {notification}
      </div>
      <button
        className="profile__update-box__submit"
        onClick={() => onSubmitUpdateAccount()}
      >
        Submit
      </button>
    </div>
  </div>

export default UpdateBox;