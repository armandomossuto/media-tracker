import * as React from 'react';
import { useEffect, useState } from 'react';
import { ItemDetailProps, ItemDetailsNotification } from './types';
import { fetchRequest } from 'utils/fetch';
import { useSessionState } from 'state';
import Movie from './movie';
import { ItemView } from '../../types';

/**
 * Fetchs the item details from the server and renders them
 */
const Details: React.FunctionComponent<ItemDetailProps> = ({ categoryId, itemId }: ItemDetailProps) => {

  // For using our internal fetch request utility we need the session state dispatch
  const [, sessionStateDispatch] = useSessionState();

  // For managing notifications if there is an issue fetching the item details
  const [notification, setNotification] = useState<ItemDetailsNotification>(ItemDetailsNotification.loading);

  // For managing notifications if there is an issue fetching the item details
  const [item, setItem] = useState<ItemView>(null);

  // When mounting the item for the first time we retrieve the details from the server
  useEffect(() => {
    fetchRequest(`api/entries/details/${categoryId}/${itemId}`, 'GET', sessionStateDispatch)
      .then((item: ItemView) => {
        setNotification(ItemDetailsNotification.initial)
        setItem(item)
      })
      .catch(() => setNotification(ItemDetailsNotification.error));
  }, []);

  /**
   * Returns the component that will render the details depending of the category Id
   * @param item 
   */
  const returnItemComponent = (item: ItemView): JSX.Element => {
    // If we still don't have any item, we don't render anything yet
    if (!item) {
      return null;
    }

    switch(categoryId.toString()) {
      case "2": return <Movie item={item} />;
      default: return null;
    }
  }
  const itemComponent = returnItemComponent(item);

  return (
    <div className="item-details">
      {itemComponent}
      {notification !== ItemDetailsNotification.initial
        ? <div className="item-details__notification">
          {notification}
        </div>
        : null
      }
    </div>
  )
}

export default Details;