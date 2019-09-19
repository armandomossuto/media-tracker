import * as React from 'react';
import { ShowButtonParams } from '../types';

/**
 * @param showInput - Shows the Add-value-input
 */
const ShowButton: React.FunctionComponent<ShowButtonParams> = ({ showInput }: ShowButtonParams) =>
  <button 
    className="add-value-input__show-button"
    onClick={(): void => showInput()}
  >
    Change
  </button>

export default ShowButton;