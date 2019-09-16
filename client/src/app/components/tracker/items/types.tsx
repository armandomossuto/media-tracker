import { EnumLiteralsOf, User } from "types";
import { match } from "react-router";

export interface Item {
  id: string,
  categoryId: string,
  name: string,
  description: string,
}

export type ItemState = EnumLiteralsOf<typeof ItemState>

export const ItemState = Object.freeze({
  notSet: 'Not set' as '0',
  inProgress: 'In progress' as '1',
  completed: 'Completed' as '2'
});

export type ItemRating = EnumLiteralsOf<typeof ItemRating>

export const ItemRating = Object.freeze({
  notSet: 'Not set' as '0',
  1: '1: ' as '1',
  2: '2' as '2',
  3: '3' as '3',
  4: '4' as '4',
  5: '5' as '5',
});

export interface UserItem {
  id: string,
  itemId: string,
  userId: string,
  rating: ItemRating,
  state: ItemState
}

export class UserItem implements UserItem {
  constructor(item: Item, user: User) {
    this.itemId = item.id;
    this.userId = user.id;
    this.rating = ItemRating.notSet;
    this.state = ItemState.notSet;
  }
}

export interface UserItemView extends Item {
  rating: ItemRating,
  state: ItemState
}

export type ItemsStatus = EnumLiteralsOf<typeof ItemsStatus>

export const ItemsStatus = Object.freeze({
  loading: 'loading' as 'loading',
  ok: 'ok' as 'ok',
  error: 'error' as 'error',
  wrongCategory: 'wrongCategory' as 'wrongCategory'
})

export type ItemsState = {
  categoryId: string,
  items: Array<UserItemView>,
  status: ItemsStatus
}

export type matchParams = {
  categoryName: string
}
export type ItemsProps = {
  match: match<matchParams>
}

export type ItemsActionType = EnumLiteralsOf<typeof ItemsActionType>

export const ItemsActionType = Object.freeze({
  SET_CATEGORY_ID: 'SET_CATEGORY_ID' as 'SET_CATEGORY_ID',
  SET_ITEMS: 'SET_ITEMS' as 'SET_ITEMS',
  SET_STATUS: 'SET_STATUS' as 'SET_STATUS',
  ADD_ITEM: 'ADD_ITEM' as 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM' as 'REMOVE_ITEM'
})


export type ItemsAction = { type: ItemsActionType, payload: any };

export type ItemsActionCreator = (message: any) => (ItemsAction)

export type SearchItemType = Exclude<keyof Item,  "id" | "categoryId">;

export const searchItemTypes: Array<SearchItemType> = ["name", "description"];
