import { CategoriesState } from "./types";

/**
 * Initial state for the categories reducer
 */
export const initialState: CategoriesState = {
  list: [],
  status: "loading"
};