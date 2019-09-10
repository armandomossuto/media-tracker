import * as React from 'react';

// Types
import { CategoriesStatus, Category } from './types';

// Hooks
import { useEffect, useState } from 'react';
import { useSessionState } from 'state';
import { useCategoriesState } from './state';


// Components
import Loading from 'components/common/generic-messages/loading';
import Error from 'components/common/generic-messages/error';
import EmptyList from 'components/common/generic-messages/empty-list';

// Utils
import { fetchRequest } from 'utils/fetch';

// State
import { setUserCategories, setCategoriesStatus } from './actions';
import AddCategory from './add-category';
import { withRouter, Redirect } from 'react-router';

/**
 * Categories component
 * Accessed from /tracker route
 * Makes a call to fetch the list of categories that the user has before the component mounts
 */
const Categories: React.FunctionComponent = () => {

  // Retrieving account info and dispatch from global store
  const [{ accountInfo }, sessionStateDispatch] = useSessionState();

  // Internal categories state for keeping track of internal status and list of the User Categories
  const [{ userCategories, status }, dispatch] = useCategoriesState();

  // If we trigger a transition when selecting one category, we are using this variable
  const [redirectPath, setRedirectPath] = useState<string>('');

  /**
   * When the component has mounted, we fetch the categories list from the user
   */
  useEffect(() => {
    if (status !== CategoriesStatus.ok) {
      fetchRequest(`api/categories/${accountInfo.id}`, 'GET', sessionStateDispatch)
        .then((userCategories: Array<Category>) => {
          dispatch(setUserCategories(userCategories));
          dispatch(setCategoriesStatus(CategoriesStatus.ok));
        })
        .catch(() => {
          dispatch(setCategoriesStatus(CategoriesStatus.error));
        });
    }
  }, []);

  const onSelectCategory = (categoryName: string) => setRedirectPath(`/tracker/${categoryName}`);

  // If there is a redirect path, we will transition to that path
  if(redirectPath) {
    return (<Redirect to={redirectPath} />)
  }

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
          <AddCategory />
          </div>
          <div className="categories__list">
            {userCategories.length > 0
              ? userCategories.map((category, index) =>
                <div
                  className="categories__list__element"
                  key={index}
                  onClick={() => onSelectCategory(category.name)}
                > 
                  {category.name}
                </div>
              )
              : <EmptyList type='categories' className="categories__list__empty" />
            }
          </div>
        </div>
      )
  }
}

export default withRouter(Categories);
