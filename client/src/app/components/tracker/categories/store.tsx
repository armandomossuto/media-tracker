import { CategoriesState } from "./types";

/**
 * Initial state for the categories reducer
 */
export const initialState: CategoriesState = {
  userCategories: [],
  categories: [],
  status: "loading"
};