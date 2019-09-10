import * as React from 'react';
import { useReducer, useEffect } from 'react';
import { ItemsProps, ItemsStatus, UserItemView } from './types';
import reducer from './reducer';
import { initialState } from './store'
import { useCategoriesState } from '../categories/state';
import { fetchRequest } from 'utils/fetch';
import { useSessionState } from 'state';
import { Category } from '../categories/types';
import { setCategories } from '../categories/actions';

import { setItemsStatus , setCategoryId, setItems, addItem, removeItem } from './actions';
import Loading from 'components/common/generic-messages/loading';
import Error from 'components/common/generic-messages/error';
import EmptyList from 'components/common/generic-messages/empty-list';
import CustomMessage from 'components/common/generic-messages/custom-message';

const Items = ({ match }: ItemsProps) => {

  // The category name comes in the URL
  const { categoryName } = match.params;

  // We need the userId and the dispatch from the session state
  const [{ accountInfo }, sessionStateDispatch] = useSessionState();

  // We need the categories state and dispatch
  const [{ userCategories }, categoriesStateDispatch] = useCategoriesState();

  // Items component internal state is managed by useReducer hook
  const [{ categoryId, items, status }, dispatch] = useReducer(reducer, initialState);

  // We fetch the list of items corresponding to the user for the category when mounting the component
  useEffect(() => {
    // To use async/await inside of useEffect hook, we need to do it inside another function
    const fetchData = async () => {
    // Finding the category in the user categories list
    let category = userCategories.find(category => category.name === categoryName);

    // If the category is not in the list, or if it hasn't been loded, we trigger a userCategories fetch request and update the state
    if (!category) {
      try {
        const categories = await fetchRequest('api/categories', 'GET', sessionStateDispatch)

        categoriesStateDispatch(setCategories(categories));

        // We update our category variable
        category = categories.find((category: Category) => category.name === categoryName);

        // If we didn't find the category here, that means that the user is trying to access a path of a category he hasn't added or doesn't exist
        if (!category) {
          dispatch(setItemsStatus(ItemsStatus.wrongCategory));
        }
      } catch(error) {
        // If there is an error, we display an error message and interrupt useEffect here
        dispatch(setItemsStatus(ItemsStatus.error));
        return;
      }
    }
    
    // We need to fetch the list of user items from the categoryId
    fetchRequest(`api/entries/${category.id}/${accountInfo.id}`, 'GET', sessionStateDispatch)
      .then((items: Array<UserItemView>) => {
        dispatch(setItems(items));
        dispatch(setCategoryId(category.id));
        dispatch(setItemsStatus(ItemsStatus.ok));
      })
      .catch((error) => dispatch(setItemsStatus(ItemsStatus.error)));
    }
    fetchData();
  }, []);
  switch (status) {
    case ItemsStatus.loading:
      return (<Loading />);
    case ItemsStatus.error:
      return (<Error />);
    case ItemsStatus.wrongCategory:
      return (< CustomMessage message={`The category ${categoryName} that you are trying to reach is not added to Your tracker or it doesn't exist.`}/>);
    case ItemsStatus.ok:
      return (
        <div className="items">
          <h2> {categoryName} </h2>
          <div className="items__list"> 
            {items.length > 0
              ? items.map((item, index) => 
                  <div key={item.name}>{item.name}</div>)
              : <EmptyList type={categoryName} className="item__list__empty" />
            }
          </div>
        </div>
    )
  }
}

export default Items;
