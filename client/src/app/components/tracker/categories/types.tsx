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

export type CategoriesState = {
    list: Array<Category>,
    status: CategoriesStatus
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
