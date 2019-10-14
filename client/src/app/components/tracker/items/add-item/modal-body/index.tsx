import * as React from 'react';
import { useState } from 'react';
import { AddItemModalProps, ItemSearchRequest, ItemSearchView } from '../types';
import { useSessionState } from 'state';
import { fetchRequest } from 'utils/fetch';
import ItemResult from './item-result';

const AddItemModal: React.FunctionComponent<AddItemModalProps> = ({ categoryId }: AddItemModalProps) => {
  const [, sessionStateDispatch] = useSessionState();

  // Term from the user input for searching items
  const [searchedTerm, setSearchedTerm] = useState('');

  // Results for the user to select which one to add
  const [results, setResults] = useState<Array<ItemSearchView>>([]);

  /**
   * Updates Search Results with a list of ItemSearchView retrieved for a specific searched term
   * @param searchTerm - current value of the input field
   */
  const onSearchAction = async (searchTerm: string, currentValue: string): Promise<void> => {

    // This method can be triggered even if there were no changes in the input value
    // In that case, we just return to avoid unnecessary calls to the API
    if (searchTerm === currentValue) {
      return;
    }

    // First we update the input value
    setSearchedTerm(searchTerm);

    // We only perform the fetch request of we have more than 3 characters
    if(searchTerm.length < 4) {
      return;
    }
    
    try {
      // Fetching item results to display on the modal
      const itemSearchRequestBody: ItemSearchRequest = {
        categoryId,
        searchTerm,
      }
      const results: Array<ItemSearchView> = await fetchRequest('api/entries/search', 'POST', sessionStateDispatch, itemSearchRequestBody);
      setResults(results);
  
    } catch (err) {
      return;
    }
  };

  return (
    <div className="add-item-modal">
      <div className="items__search">
        <input
          type="text"
          value={searchedTerm}
          onChange={(e): Promise<void> => onSearchAction(e.target.value, searchedTerm)}
          className="items__search__input"
        ></input>
      </div>
      {results.map((item, index) =>
        <ItemResult 
          key={`item-result${index}`}
          item={item}
        />
      )
      }
    </div>
  )
}

export default AddItemModal;