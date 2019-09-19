import * as React from 'react'; 
import { useState } from 'react';

import { AddSingleElementProps } from './types';

/**
 * Modal for just adding one string element and passing it to the parent with onConfirmAction
 * @param message - The message that we desire to display in the modal body
 * @param onConfirmAction - Function from parent component that will be triggered when clicking on confirm button
 * @param onSearchAction - Function that will be triggered when User writes on the input and returns a list of options
 * @param closeModal - Closes the modal
 */
const AddSingleElement: React.FunctionComponent<AddSingleElementProps> = ({ 
  message,
  onConfirmAction,
  onSearchAction,
  closeModal,
  notification 
}: AddSingleElementProps) => {

  // Value of the input
  const [value, setValue] = useState('');

  // List of options, provided by onSearchAction
  const [options, setOptions] = useState([]);

  const onHandleChange = async (value: string): Promise<void> => {
    setValue(value);
    const options = await onSearchAction(value);
    setOptions(options);
  }

  return (
    <div className="modal">
      <div className="modal__message">{message}</div>
      <div className="modal__single-element">
        <input
          type="text"
          value={value}
          onChange={(e): Promise<void> => onHandleChange(e.target.value)}
          list="options"
        ></input>
        <datalist id="options">
          {/* For displaying a list of options in the input */
            options.map(option =>
              <option value={option} key={`option${option}`}></option>
            )}
        </datalist>
      </div>
      <div className="modal__buttons">
        <div
          className="modal__buttons__actions"
          onClick={(): void => closeModal()}
        >
          Cancel
        </div>

        <div
          className="modal__buttons__actions"
          onClick={(): void => onConfirmAction(value)}
        >
          Confirm
        </div>
      </div>
      <div className="modal__notification">{notification}</div>
    </div>
  )
}

export default AddSingleElement;