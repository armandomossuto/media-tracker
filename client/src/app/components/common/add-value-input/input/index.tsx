import * as React from 'react';
import { InputParams } from '../types';


/**
 * @param showInput - Shows the Add-value-input
 */
const Input: React.FunctionComponent<InputParams> = ({ value, setValue, onAddValue, hideInput, type }: InputParams) =>{
  
  const onConfirm = (value: string): void => {
    hideInput();
    onAddValue(value);
  }

  return (
    <div>
      <input
        className="add-value-input__input"
        type={type}
        value={value}
        onChange={(e): void => setValue(e.target.value)}
      >
      </input>

      <button
        className="add-value-input__button"
        onClick={(): void => onConfirm(value)}>
        Add
      </button>

      <button
        className="add-value-input__button"
        onClick={(): void => hideInput()}>
        Cancel
      </button>
    </div> 
  )
}

export default Input;