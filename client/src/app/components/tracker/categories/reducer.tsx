// Importing action types
import { initialState } from './store';
import { CategoriesState, CategoriesAction, CategoriesActionType } from './types';

/**
 * Reducer for managing the Categories state
 */
const reducer: React.Reducer<CategoriesState, CategoriesAction> = (state = initialState, action) => {
  switch (action.type) {

    case CategoriesActionType.SET_CATEGORIES: return { ...state, categories: action.payload};

    case CategoriesActionType.SET_USER_CATEGORIES: return { ...state, userCategories: action.payload }
    
    case CategoriesActionType.SET_STATUS: return { ...state, status: action.payload }

    case CategoriesActionType.ADD_USER_CATEGORY: {
      const userCategories = [...state.userCategories];
      userCategories.push(action.payload);
      return { ...state, userCategories }
    }

    default: return state;
  }
};

export default reducer;