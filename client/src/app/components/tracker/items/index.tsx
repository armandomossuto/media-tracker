import * as React from 'react';
import { useReducer, useEffect, useState } from 'react';

// Types
import { ItemsProps, ItemsStatus, UserItemView, SortItemOrder, SortItemOptions } from './types';
import { Category } from '../categories/types';
import { searchItemTypes, SearchItemType } from './types';

// Custom hooks
import { useCategoriesState } from '../categories/state';
import { setCategories } from '../categories/actions';
import { useSessionState } from 'state';

// useReducer elements
import reducer from './reducer';
import { initialState } from './store'
import { setItemsStatus, setCategoryId, setItems, addItem, removeItem } from './actions';

// Utils
import { fetchRequest } from 'utils/fetch';

// Components
import Loading from 'components/common/generic-messages/loading';
import Error from 'components/common/generic-messages/error';
import EmptyList from 'components/common/generic-messages/empty-list';
import CustomMessage from 'components/common/generic-messages/custom-message';
import Dropdown from 'components/common/dropdown';
import ItemComponent from './item';
import AddItem from './add-item';

/**
 * Displays the list of items in a specific category
 * @param match - Router path, used to determine current category dynamically
 */
const Items: React.FunctionComponent<ItemsProps> = ({ match }: ItemsProps) => {

  // The category name comes in the URL
  const { categoryName } = match.params;

  // We need the userId and the dispatch from the session state
  const [{ accountInfo }, sessionStateDispatch] = useSessionState();

  // We need the categories state and dispatch
  const [{ userCategories }, categoriesStateDispatch] = useCategoriesState();

  // Items component internal state is managed by useReducer hook
  const [{ items, status, categoryId }, dispatch] = useReducer(reducer, initialState);

  // We fetch the list of items corresponding to the user for the category when mounting the component
  useEffect(() => {
    // To use async/await inside of useEffect hook, we need to do it inside another function
    const fetchData = async (): Promise<void> => {
      // Finding the category in the user categories list
      let category = userCategories.find(category => category.name === categoryName);

      // If the category is not in the list, or if it hasn't been loded, we trigger a userCategories fetch request and update the state
      if (!category) {
        try {
          const categories = await fetchRequest('api/categories', 'GET', sessionStateDispatch)

          categoriesStateDispatch(setCategories(categories));

          // We update our category variable
          /* eslint-disable require-atomic-updates */
          category = categories.find((category: Category) => category.name === categoryName);

          // If we didn't find the category here, that means that the user is trying to access a path of a category he hasn't added or doesn't exist
          if (!category) {
            dispatch(setItemsStatus(ItemsStatus.wrongCategory));
          }
        } catch (error) {
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
        .catch(() => dispatch(setItemsStatus(ItemsStatus.error)));
    }
    fetchData();
  }, []);

  // Term from the user input for searching items
  const [searchedTerm, setSearchedTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchItemType>('title');

  /**
   * Handler for changing searchedTerm when the input search changes
   * @param value introduces by the user in the input field
   */
  const onSearchItem = (value: string): void => setSearchedTerm(value);

  // Variables for handling the sorting of items
  const [sortOption, setSortOption] = useState<SortItemOptions>(SortItemOptions.title);
  const [sortOrder, setSortOrder] = useState<SortItemOrder>(SortItemOrder.increase);

  /**
   * Filters the items list depending on the value of the search input and other filters
   * @param items - list of items to filter
   * @param searchedTerm - Term from the search performed by the user
   * @param searchType - Property of Items to compare with the searched term
   */
  const filterItems = (items: Array<UserItemView>, searchedTerm: string, searchType: SearchItemType): Array<UserItemView> => {
    let result = [...items];

    // We only perform the search if there is a searched term
    if (searchedTerm) {
      result = items.filter(item => item[searchType] ?
        item[searchType].toLocaleLowerCase().includes(searchedTerm.toLocaleLowerCase())
        : false
      );
    }

    // Now we are going to sort the items according to the sort option and order selected by the user
    result.sort((a, b) => {
      if(a[sortOption] > b[sortOption]) {
        return sortOrder === SortItemOrder.increase ? 1 : -1;
      }
      return sortOrder === SortItemOrder.increase ? -1 : 1;
    });
    
    return result;
  }
  // Items filtered after a search or change of the filter options
  const filteredItems = filterItems(items, searchedTerm, searchType);

  /**
   * Removes an item from the user's tracker
   * @param itemId 
   */
  const onRemoveItem = async (itemId: string): Promise<void> => {
    const deleteUserItem = {
      itemId,
      userId: accountInfo.id,
    };
    fetchRequest('api/entries', 'DELETE', sessionStateDispatch, deleteUserItem)
      .then(() => dispatch(removeItem(itemId)));
  }

  switch (status) {
    case ItemsStatus.loading:
      return (<Loading />);
    case ItemsStatus.error:
      return (<Error />);
    case ItemsStatus.wrongCategory:
      return (< CustomMessage message={`The category ${categoryName} that you are trying to reach is not added to Your tracker or it doesn't exist.`} />);
    case ItemsStatus.ok:
      return (
        <div className="items">
          <h2> {categoryName} </h2>
          <div className="items__search">
            <input
              type="text"
              value={searchedTerm}
              onChange={(e): void => onSearchItem(e.target.value)}
              className="items__search__input"
            ></input>
            <Dropdown
              options={searchItemTypes}
              buttonText={`Search by ${searchType}`}
              onSelect={setSearchType}
            />
          </div>
          <div className="items__options">
            <div className="items__add-button">
              <AddItem categoryId={categoryId} addItem={(item: UserItemView): void => dispatch(addItem(item))} />
            </div>
            <div className="items__sort">
              <Dropdown
                options={Object.values(SortItemOptions)}
                buttonText={`Sort by ${sortOption}`}
                onSelect={setSortOption}
              />
              <div 
                className="items__sort__direction"
                onClick={(): void => setSortOrder(sortOrder === SortItemOrder.increase ? SortItemOrder.decrease : SortItemOrder.increase)}
              >
                {sortOrder === SortItemOrder.increase
                  ? <span>↓</span>
                  : <span>↑</span>
                }
              </div>
            </div>
          </div>
          <div className="items__list">
            {items.length > 0
              ? filteredItems.map(item => <ItemComponent item={item} key={item.title} itemsDispatch={dispatch} onRemoveItem={onRemoveItem} />)
              : <EmptyList type={categoryName} className="item__list__empty" />
            }
          </div>
        </div>
      )
  }
}

export default Items;
