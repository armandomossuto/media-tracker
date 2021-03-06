import * as React from 'react';

// types
import { ItemResultProps, AddItemRequest, AddItemNotification } from './types';
import { UserItemView, UserItem } from 'components/tracker/items/types';

// Hooks, actions and utils
import { useState } from 'react'
import { fetchRequest } from 'utils/fetch';
import { useSessionState } from 'state';

// Components
import ImageWithFallback from 'components/common/images/image-with-fallback';
import Details from 'components/tracker/items/item/details';

/**
 * Component for rendering an item result for the add item modal
 * @param item - Item from the search request
 * @param categoryId - Id of the category where we are currently making changes
 * @param addItem - Function to be excuted when the user adds a new Item to trigger an update of the items list 
 */
const ItemResult: React.FunctionComponent<ItemResultProps> = ({ item, categoryId, addItem }: ItemResultProps) => {

  // Whether or not this item has been added
  const [isAdded, setIsAdded] = useState(false);

  const [{ accountInfo }, sessionStateDispatch] = useSessionState();

  // For handling notifications
  const [notification, setNotification] = useState<AddItemNotification>(AddItemNotification.initial);

  // For showing or hiding all the details of the item
  const [showDetails, setShowDetails] = useState(false);

  /**
   * Sends request to add Item to the user and/or the category if needed
   */
  const onAddItem = async (event: React.MouseEvent): Promise<void> => {
    event.stopPropagation();
    try {
      // If we have an itemId, it means that this item is already in our DB
      if (item.itemId) {
        const userItem = new UserItem(item.itemId, accountInfo.id);
        // Request to add the new UserItem
        await fetchRequest('api/entries/add', 'POST', sessionStateDispatch, userItem);
        addItem(new UserItemView(item, categoryId));
        setIsAdded(true);
        setNotification(AddItemNotification.initial);
        return;
      }
      // Request to add the item to the DB and also the user
      const body: AddItemRequest = {
        item,
        userId: accountInfo.id,
        categoryId,
      };

      const itemId: string = await fetchRequest('api/entries/add/new', 'POST', sessionStateDispatch, body);
      addItem(new UserItemView(item, categoryId, itemId));
      setIsAdded(!!itemId);
      setNotification(AddItemNotification.initial);
    } catch (error) {
      setNotification(AddItemNotification.error);
    }
  }

  return (
    <div
      className="add-item-modal__result"
      onClick={(): void => setShowDetails(!showDetails)}
    >
      <div
        className="add-item-modal__result__header"
        title="Click to see the details"
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
              onClick={(e): Promise<void> => onAddItem(e)}
            >
              +
            </span>
          }
        </div>
      </div>
      <Details categoryId={categoryId} showDetails={showDetails} itemDetails={item}/>
      <div className="add-item-modal__result__notification"> {notification} </div>
    </div>
  )
}

export default ItemResult;