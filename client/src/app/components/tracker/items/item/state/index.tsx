import * as React from 'react';
import { useState } from 'react';
import { ItemStateProps } from '../types';
import { ItemState, ItemStateEnum } from '../../types';

/**
 * Renders and allows to change an item state
 */
const State: React.FunctionComponent<ItemStateProps> = ({ state, updateState }: ItemStateProps) => {
  // For showing or hiding the options to change the item state
  const [showOptions, setShowOptions] = useState(false);

  /**
   * On clicking on an option, it will trigger a change of the item state and close the options menu
   * @param state - selected by the user
   */
  const onClickOption = (event: React.MouseEvent, stateIndex: number): void => {
    event.stopPropagation();
    setShowOptions(false);
    updateState(stateIndex.toString());
  }
  return (
    <div className="item-state">
      <span onClick={(): void => setShowOptions(true)}>{ItemStateEnum[state]}</span>
      {showOptions
        ? <div className="item-state__options">
          {Object.values(ItemState).map((state, stateIndex) =>
            <div
              className="item-state__options__option"
              onClick={(e): void => onClickOption(e, stateIndex)}
              key={`option-${state}`}
            >
              {state}
            </div>
          )}
        </div>
        : null
      }
    </div>
  )
}


export default State;