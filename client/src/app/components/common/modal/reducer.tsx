// Importing action types
import { initialState } from './store';
import { ModalState, ModalAction, ModalActionType } from './types';

/**
 * Modal reducer for its state management
 */
const reducer: React.Reducer<ModalState, ModalAction> = (state = initialState, action) => {
  switch (action.type) {

    case ModalActionType.OPEN_MODAL: return { show: true, params: action.payload };

    case ModalActionType.CLOSE_MODAL: return initialState;

    case ModalActionType.SET_MODAL_NOTIFICATION: return { ...state, params: { ...state.params, notification: action.payload } };

    default: return state;
  }
};

export default reducer;