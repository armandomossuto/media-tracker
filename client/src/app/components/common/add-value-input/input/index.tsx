import * as React from 'react';
import { InputParams } from '../types';


/**
 * @param showInput - Shows the Add-value-input
 */
const Input = ({ value, setValue, onAddValue, hideInput, type }: InputParams) =>{
  
  const onConfirm = (value: string) => {
    hideInput();
    onAddValue(value);
  }

  return (
    <div>
      <input
        className="add-value-input__input"
        type={type}
        value={value}
        onChange={e => setValue(e.target.value)}
      >
      </input>

      <button
        className="add-value-input__button"
        onClick={() => onConfirm(value)}>
        Add
      </button>

      <button
        className="add-value-input__button"
        onClick={() => hideInput()}>
        Cancel
      </button>
    </div> 
  )
}

export default Input;