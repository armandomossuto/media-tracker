import * as React from 'react';
import { useState, useEffect } from 'react';
import { AddItemModalProps, ItemSearchRequest, ItemSearchView } from '../types';
import { useSessionState } from 'state';
import { fetchRequest } from 'utils/fetch';
import ItemResult from './item-result';
import useDebounce from 'utils/hooks/use-debounce';

/**
 * Body for the Add an item modal
 * @param categoryId - Id of the category where we are currently making changes
 * @param addItem - Function to be excuted when the user adds a new Item to trigger an update of the items list 
 */
const AddItemModal: React.FunctionComponent<AddItemModalProps> = ({ categoryId, addItem }: AddItemModalProps) => {
  // Session state dispatch to use our custom fetch request
  const [ { accountInfo }, sessionStateDispatch] = useSessionState();

  // Term from the user input for searching items
  const [searchedTerm, setSearchedTerm] = useState('');

  // Current page of paginated search results
  const [searchResultsPage, setSearchResultsPage] = useState(1);

  // Results for the user to select which one to add
  const [results, setResults] = useState<Array<ItemSearchView>>([]);

  // We are going to use a debounce for not triggering a request to the server with each change to the imput 
  const debouncedSearchTerm = useDebounce<string>(searchedTerm, 500);

  /**
   * Handles changes in the input for the search term
   */
  const onChangeSearchTerm = (searchTerm: string): void => {
    setSearchedTerm(searchTerm);
    // For a new search term, we reset current page to 1
    setSearchResultsPage(1);
  }

  /**
   * Updates Search Results with a list of ItemSearchView retrieved for a specific searched term
   * @param searchTerm - current value of the input field
   * @param searchResultsPage - page of the results to fetch
   * @param keepPreviousResults - whether or not we should keep showing the previous results after fetching the new results
   */
  const onSearchAction = async (debouncedSearchTerm: string, searchResultsPage: number, keepPreviousResults: boolean): Promise<void> => {
    try {
      // Fetching item results to display on the modal
      const itemSearchRequestBody: ItemSearchRequest = {
        categoryId,
        searchTerm: debouncedSearchTerm,
        userId: accountInfo.id,
        page: searchResultsPage,
      }
      const results: Array<ItemSearchView> = await fetchRequest('api/entries/search', 'POST', sessionStateDispatch, itemSearchRequestBody);
      setResults(previousResults => keepPreviousResults ? previousResults.concat(results) : results);
  
    } catch (err) {
      return;
    }
  };

  /**
   * We use useEffect for triggering onSearchAction when debouncedSearchTerm value gets updated
   */
  useEffect(() => {
    onSearchAction(debouncedSearchTerm, searchResultsPage, false);
  }, [debouncedSearchTerm]);

  /**
   * Fetches next page of current results
   * @param currentPage - current page of the results
   * @param debouncedSearchTerm - search term for the fetch request
   */
  const onSearchMoreResults = (currentPage: number, debouncedSearchTerm: string): void => {
    const page = currentPage + 1;
    setSearchResultsPage(page);
    onSearchAction(debouncedSearchTerm, searchResultsPage, true);
  };

  return (
    <div className="add-item-modal">
      <div className="items__search">
        <input
          type="text"
          value={searchedTerm}
          onChange={(e): void => onChangeSearchTerm(e.target.value)}
          className="items__search__input"
        ></input>
      </div>
      {results.map((item, index) =>
        <ItemResult 
          key={`item-result${index}`}
          item={item}
          categoryId={categoryId}
          addItem={addItem}
        />
      )}
      <button
        className="add-item-modal__more-button"
        onClick={(): void => onSearchMoreResults(searchResultsPage, debouncedSearchTerm)}
      >
        Show me more results
      </button>
    </div>
  )
}

export default AddItemModal;