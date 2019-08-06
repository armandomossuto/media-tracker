import * as React from 'react';
import { ShowButtonParams } from '../types';

/**
 * @param showInput - Shows the Add-value-input
 */
const ShowButton = ({ showInput }: ShowButtonParams) =>
  <button 
    className="add-value-input__show-button"
    onClick={() => showInput()}
  >
    Change
  </button>

export default ShowButton;