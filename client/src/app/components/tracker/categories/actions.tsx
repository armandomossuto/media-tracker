import { CategoriesActionCreator, Category, CategoriesActionType, CategoriesStatus } from './types';

export const setCategories: CategoriesActionCreator = (categories: Array<Category>) => ({
  type: CategoriesActionType.SET_CATEGORIES,
  payload: categories,
});
  
export const setUserCategories: CategoriesActionCreator = (userCategories: Array<Category>) => ({
  type: CategoriesActionType.SET_USER_CATEGORIES,
  payload: userCategories,
});

export const setCategoriesStatus: CategoriesActionCreator = (status: CategoriesStatus) => ({
  type: CategoriesActionType.SET_STATUS,
  payload: status,
});

export const addUserCategory: CategoriesActionCreator = (category: Category) => ({
  type: CategoriesActionType.ADD_USER_CATEGORY,
  payload: category
})