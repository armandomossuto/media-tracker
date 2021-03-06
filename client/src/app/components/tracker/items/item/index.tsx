import * as React from 'react';
import { useState } from 'react';

// Types
import { ItemDescriptionProps, UpdateUserItem, UpdateItemNotification } from './types';
import { ItemRating } from '../types';

// Custom hooks, utils and action creators
import { useSessionState } from 'state';
import { fetchRequest } from 'utils/fetch';
import { updateItemRating, updateItemState } from '../actions';

// Components
import Rating from './rating';
import State from './state';
import ImageWithFallback from 'components/common/images/image-with-fallback';
import Details from './details';

/**
 * Component belonging to one item inside the items page of the tracker
 */
const Item: React.FunctionComponent<ItemDescriptionProps> = ({ item, itemsDispatch, onRemoveItem }: ItemDescriptionProps) => {

  // For showing or hiding all the details of the item
  const [showDetails, setShowDetails] = useState(false);

  // Session state for user Id and using fetchRequest
  const [{ accountInfo }, sessionStateDispatch] = useSessionState();

  // For managing notifications related to updating the item rating or state
  const [notification, setNotification] = useState<UpdateItemNotification>(UpdateItemNotification.initial);

  /**
   * Updates item rating
   * @param event
   * @param newRating 
   */
  const updateRating = (event: React.MouseEvent, newRating: ItemRating): void => {
    event.stopPropagation();
    // Creating the object necessary for the update user item request
    const updateUser: UpdateUserItem = {
      userId: accountInfo.id,
      itemId: item.id,
      newUserItemInformation: {
        rating: newRating
      }
    }

    fetchRequest('api/entries/update', 'POST', sessionStateDispatch, updateUser)
      .then(() => {
        itemsDispatch(updateItemRating({ itemId: item.id, rating: newRating }))
        setNotification(UpdateItemNotification.initial)
      })
      .catch(() => setNotification(UpdateItemNotification.ratingError));
  };

  /**
   * Updates item state
   * @param event
   * @param newState 
   */
  const updateState = (newState: number): void => {
    // Creating the object necessary for the update user item request
    const updateUser: UpdateUserItem = {
      userId: accountInfo.id,
      itemId: item.id,
      newUserItemInformation: {
        state: newState
      }
    }

    fetchRequest('api/entries/update', 'POST', sessionStateDispatch, updateUser)
      .then(() => {
        itemsDispatch(updateItemState({ itemId: item.id, state: newState }))
        setNotification(UpdateItemNotification.initial)
      })
      .catch(() => setNotification(UpdateItemNotification.stateError));
  };

  const onHandleRemove = (e: React.MouseEvent): void => {
    e.stopPropagation();
    try {
      onRemoveItem(item.id);
    } catch(error) {
      setNotification(UpdateItemNotification.removeError);
    }
  }

  return (
    <div className="items-element" onClick={(): void => setShowDetails(!showDetails)} >
      <div className="items-element__body">
        <ImageWithFallback
          title={item.title}
          imageUrl={item.imageUrl}
          className={"items-element__body__image"} 
        />
        <h3 className="items-element__body__title">{item.title}</h3>
        <div className="items-element__body__rating-and-state">
          <Rating rating={item.rating} updateRating={updateRating} />
          <State state={item.state} updateState={updateState} />
        </div>
        <span
          className={"items-element__body__remove-button"}
          onClick={(e): void => onHandleRemove(e)}
          title="Click to remove this item from your tracker"
        >
          x
        </span>
      </div> 

      <Details categoryId={item.categoryId} itemId={item.id} showDetails={showDetails}/>

      {notification !== UpdateItemNotification.initial
        ? <div className="items-element__notification">
          {notification}
        </div>
        : null
      }
    </div>
  )
}

export default Item;