import { ItemsState, ItemsStatus } from "./types";

/**
 * Initial state for the categories reducer
 */
export const initialState: ItemsState = {
  categoryId: '',
  items: [],
  status: ItemsStatus.loading
};