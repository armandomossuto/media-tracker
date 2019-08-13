import * as React from 'react';

// Types
import { CategoriesStatus, Category } from './types';

// Hooks
import { useEffect } from 'react';
import { useSessionState } from 'state';
import { useCategoriesState, CategoriesStateProvider } from './state';

// Components
import Loading from 'components/common/generic-messages/loading';
import Error from 'components/common/generic-messages/error';
import EmptyList from 'components/common/generic-messages/empty-list';

// Utils
import { fetchRequest } from 'utils/fetch';

/**
 * Categories component
 * Accessed from /tracker route
 * Makes a call to fetch the list of categories that the user has before the component mounts
 */
const Categories: React.FunctionComponent = () => {
  
    // Retrieving account info and dispatch from global store
    const [{ accountInfo }, sessionStateDispatch ] = useSessionState();

    // Internal categories state for keeping track of internal status and list of the User Categories
    const [categoriesState, updateCategoriesState] = useCategoriesState();
    const { list, status } = categoriesState;

    /**
     * When the component has mounted, we fetch the categories list from the user
     */
    useEffect(() => {
      if (status !== CategoriesStatus.ok) {
        fetchRequest(`api/categories/${accountInfo.id}`, 'GET', sessionStateDispatch)
          .then((list: Array<Category>) => {
            updateCategoriesState({ status: CategoriesStatus.ok, list});
          })
          .catch(() => {
            updateCategoriesState({ status: CategoriesStatus.error, list: [] });
          })
      }
    }, []);
  
    switch (status) {
      case CategoriesStatus.loading:
        return (<Loading />)
      case CategoriesStatus.error:
        return (<Error />)
      case CategoriesStatus.ok:
        return (
          <div className="categories">
            <h2> Categories: </h2>
            <div
              className="categories__configuration-option"
            >
              <span>Add a new element</span>
            </div>
            <div className="categories__list">
              {list.length > 0
                ? list.map((category, index) =>
                  <div
                    className="categories__list__element"
                    key={index}> {category.name}
                  </div>
                )
                : <EmptyList type='categories' className="categories__list__empty" />
              }
            </div>
          </div>
        )
    }
  }
    
export default Categories;
