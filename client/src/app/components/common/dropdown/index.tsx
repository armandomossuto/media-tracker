import * as React from 'react';
import { useState } from 'react';
import { DropdownProps } from './types';

/**
 * Common component for a dropdown that allows to select between a list of options
 * @param buttonText - Text that will be displayed in the dropdown button 
 * @param options - Array with dropdown options
 * @param onSelect - Action that will be excuted when the user selects an option
 */
const Dropdown = ({ buttonText, options, onSelect }: DropdownProps) => {
  // For managing the dropdown menu state
  const [isDropdownOpen, setDropdownState] = useState(false);

  // Executes onSelect and closes the dropdown menu
  const selectOption = (option: string) => {
    onSelect(option);
    setDropdownState(false);
  }

  return(
    <div className="dropdown">
      <button 
        className="dropdown__button"
        onClick={() => setDropdownState(!isDropdownOpen)}
      >
        {buttonText}
        <i className="dropdown__arrow-down"></i>
      </button>
      {isDropdownOpen
        ? <div className="dropdown__content">
            {options.map(option => 
              <span className="dropdown__content__option"
                key={`dropdown${option}`}
                onClick={() => selectOption(option)}
              >
                {option}
              </span>) 
            }
        </div>
        : null
      }
    </div>
  )
}

export default Dropdown;