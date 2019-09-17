import * as React from 'react';
import { useState } from 'react';

import { ItemDescriptionProps, UpdateUserItem, UpdateItemNotification } from './types';
import Rating from './rating';
import { ItemRating } from '../types';
import { useSessionState } from 'state';
import { fetchRequest } from 'utils/fetch';
import { updateItemRating } from '../actions';

const Item = ({ item, itemsDispatch }: ItemDescriptionProps) => {

  // For showing or hiding all the details of the item
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Session state for user Id and using fetchRequest
  const [{ accountInfo }, sessionStateDispatch] = useSessionState();

  // For managing notifications related to updating the item rating or state
  const [notification, setNotification] = useState<UpdateItemNotification>(UpdateItemNotification.initial);

  /**
   * Updates item rating
   * @param event
   * @param newRating 
   */
  const updateRating = (event: React.MouseEvent, newRating: ItemRating) => {
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

  return(
    <div className="items-element" onClick={() => setShowMoreInfo(!showMoreInfo)} >
      <h3 className="items-element__name">{item.name}</h3>
      <div className="items-element__rating-and-state">
              <Rating rating={item.rating} updateRating={updateRating} />
              <div className="items-elements__state">
                {item.state}
              </div>
      </div>
      {showMoreInfo
        ? 
          <div className="items-elements__description">
            {item.description}
          </div>
        : null
      }
      <div className="items-elements__notification">
        {notification}
      </div>
    </div>
  )
}

export default Item;