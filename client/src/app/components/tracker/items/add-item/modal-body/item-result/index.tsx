import * as React from 'react';

// types
import { ItemResultProps, AddItemRequest } from './types';
import { UserItemView } from 'components/tracker/items/types';

// Hooks, actions and utils
import { useState } from 'react'
import { fetchRequest } from 'utils/fetch';
import { useSessionState } from 'state';

// Components
import ImageWithFallback from 'components/common/images/image-with-fallback';

/**
 * Component for rendering an item result for the add item modal
 * @param item - Item from the search request
 * @param categoryId - Id of the category where we are currently making changes
 * @param addItem - Function to be excuted when the user adds a new Item to trigger an update of the items list 
 */
const ItemResult: React.FunctionComponent<ItemResultProps> = ({ item, categoryId, addItem }: ItemResultProps) => {

  // Whether or not this item has been added
  const [isAdded, setIsAdded] = useState(false);

  const [ { accountInfo } , sessionStateDispatch] = useSessionState();

  /**
   * Sends request to add Item to the user and/or the category if needed
   */
  const onAddItem = async (): Promise<void> => {
    // If we have an itemId, it means that this item is already in our DB
    if (item.itemId) {
      // do something. TODO #63
    }

    // Request to add the item to the DB and also the user
    try {
      const body: AddItemRequest = {
        item,
        userId: accountInfo.id,
        categoryId,
      };

      const itemId: string = await fetchRequest('api/entries/add/new', 'POST', sessionStateDispatch, body);
      const newItem: UserItemView = {
        id: itemId,
        categoryId,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        rating: "0",
        state: "0"
      }
      addItem(newItem);
      setIsAdded(!!itemId);
    } catch(error) {
      // show error message TODO #64
    }
  }

  return (
    <div
      className="add-item-modal__result"
    >
      <ImageWithFallback
        title={item.title}
        imageUrl={item.imageUrl}
        className={"add-item-modal__result__image"} 
      />
      <h3 className="add-item-modal__result__title">{item.title}</h3>
      <div className={"add-item-modal__result__button"}>
        {isAdded
          ? <span className={"add-item-modal__result__button__check"}> ✓ </span>
          : <span 
            className={"add-item-modal__result__button__add"}
            onClick={(): Promise<void> => onAddItem()}
          >
            +
          </span> 
        }
      </div>
    </div>
  )
}

export default ItemResult;