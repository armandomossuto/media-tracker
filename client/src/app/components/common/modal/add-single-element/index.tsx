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
const AddSingleElement = ({ message, onConfirmAction, onSearchAction, closeModal }: AddSingleElementProps) => {

  const [value, setValue] = useState('');

  return (
    <div className="modal">
      <div className="modal__message">{message}</div>
      <div className="modal__single-element">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
        ></input>
      </div>
      <div className="modal__buttons">
        <div
          className="modal__buttons__actions"
          onClick={() => closeModal()}
        >
          Cancel
        </div>

        <div
          className="modal__buttons__actions"
          onClick={() => onConfirmAction(value)}
        >
          Confirm
        </div>
      </div>
    </div>
  )
}

export default AddSingleElement;