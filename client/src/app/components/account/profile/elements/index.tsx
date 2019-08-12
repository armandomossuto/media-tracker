import * as React from 'react';
import { ProfileElementsProps, changeEnum, ElementsNamesEnum } from '../types';
import AddValueInput from 'components/common/add-value-input';

/**
 * List of all account information elements, with current value and options to change if applicable
 */
const Elements = ({ accountInfoView, updatedElements, onElementsChange }: ProfileElementsProps) =>
  <div>
    {
      Object.keys(accountInfoView).map(element =>
        <div
          className="profile__element"
          key={`profile-element-${element}`}
        >
          <div>
            <div className="profile__element__name">
              {ElementsNamesEnum[element]}
            </div>
            <div className={`${updatedElements[element] ? 'profile__element__value--updated' : 'profile__element__value'}`}>
              {updatedElements[element] ? updatedElements[element] : accountInfoView[element]}
            </div>
          </div>
          <div className="profile__element__change-value">
            {changeEnum[element]
              ? <AddValueInput
                onAddValue={(value: string) => onElementsChange(value, element)}
                showButton={true}
              />
              : null
            }
          </div>
        </div>
      )
    }
    {/* Password changing element */}
    <div className="profile__element">
      <div>
        <div className="profile__element__name">
          Password
        </div>
        {updatedElements["password"]
          ? <div className="profile__element__value--updated"> You have entered a new password </div>  
          : null
        }
      </div>
      <div className="profile__element__change-value">
        <AddValueInput
          onAddValue={(value: string) => onElementsChange(value, "password")}
          showButton={true}
          type="password"
        />
      </div>
    </div>
  </div>

export default Elements;