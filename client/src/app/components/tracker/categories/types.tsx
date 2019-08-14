import { EnumLiteralsOf, User } from "types";

export interface Category {
  id: string,
  name: string,
  description: string
}

export interface UserCategory {
  categoryId: string,
  userId: string
}

export class UserCategory implements UserCategory {
  constructor(category: Category, user: User) {
    this.categoryId = category.id;
    this.userId = user.id;
  }
}

/**
 * Internal status for the categories component
 */
export type CategoriesStatus = EnumLiteralsOf<typeof CategoriesStatus>

export const CategoriesStatus = Object.freeze({
  loading: 'loading' as 'loading',
  ok: 'ok' as 'ok',
  error: 'error' as 'error'
})

export type CategoriesState = {
  userCategories: Array<Category>,
  categories: Array<Category>,
  status: CategoriesStatus
}

/**
   * Action types for the session state reducer
   */
  export type CategoriesActionType = EnumLiteralsOf<typeof CategoriesActionType>

  export const CategoriesActionType = Object.freeze({
      SET_CATEGORIES: 'SET_CATEGORIES' as 'SET_CATEGORIES',
      SET_USER_CATEGORIES: 'SET_USER_CATEGORIES' as 'SET_USER_CATEGORIES',
      SET_STATUS: 'SET_STATUS' as 'SET_STATUS',
      ADD_USER_CATEGORY: 'ADD_USER_CATEGORY' as 'ADD_USER_CATEGORY'
  })

  /**
   * Session Actions result for the session state reducer
   */
  export type CategoriesAction = { type: CategoriesActionType, payload: any };

  /**
   * Action function type for the session reducer
   */
  export type CategoriesActionCreator = (message: any) => (CategoriesAction)
