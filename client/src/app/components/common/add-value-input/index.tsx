import * as React from 'react';
import { useState } from 'react';
import { AddValueInputParams } from './types';

import ShowButton from './show-button';
import Input from './input';

/**
 * Common component for a single input that allows to add or modify a value
 * @param onAddValue Parent action that will be called when the user selects one of the
 * input buttons
 * @param showButton Optional. Wheter or not to hide the input field behind a show button
 */
const AddValueInput = ({ onAddValue, showButton = false }: AddValueInputParams) => {

  // Value of the input field
  const [value, setValue] = useState('');

  // Whether or not to show the input field. If not, we use a show button
  const [show, setShow] = useState(!showButton);

  const hideInput = () => setShow(false);

  const showInput = () => setShow(true);

  if(show) { 
    return <Input 
              value={value}
              setValue={setValue}
              onAddValue={onAddValue}
              hideInput={() => hideInput()}
            />
  } else {
    return <ShowButton showInput={() => showInput()}/>
  }
}

export default AddValueInput;
