// Importing action types
import { initialState } from './store';
import { ItemsState, ItemsAction, ItemsActionType } from './types';

/**
 * Reducer for managing the Categories state
 */
const reducer: React.Reducer<ItemsState, ItemsAction> = (state = initialState, action) => {
  switch (action.type) {

    case ItemsActionType.SET_CATEGORY_ID: return { ...state, categoryId: action.payload};

    case ItemsActionType.SET_ITEMS: return { ...state, items: action.payload }
    
    case ItemsActionType.SET_STATUS: return { ...state, status: action.payload }

    case ItemsActionType.ADD_ITEM: {
      const items = [...state.items];
      items.push(action.payload);
      return { ...state, items }
    }

    case ItemsActionType.REMOVE_ITEM: {
        const items = state.items.filter(item => item.id !== action.payload);
        return { ...state, items }
      }

    default: return state;
  }
};

export default reducer;