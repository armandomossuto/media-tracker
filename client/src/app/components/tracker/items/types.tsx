import { EnumLiteralsOf, User } from "types";
import { match } from "react-router";

export interface Item {
  id: string;
  categoryId: string;
}

export const ItemState = Object.freeze({
  notSet: 'Not set' as '0',
  inProgress: 'In progress' as '1',
  completed: 'Completed' as '2'
});

export type ItemState = EnumLiteralsOf<typeof ItemState>;

export const ItemStateEnum = Object.freeze({
  0: 'Not set',
  1: 'In progress',
  2: 'Completed'
});

export const ItemRating = Object.freeze({
  notSet: 'Not set' as '0',
  1: '1: ' as '1',
  2: '2' as '2',
  3: '3' as '3',
  4: '4' as '4',
  5: '5' as '5',
});

export type ItemRating = EnumLiteralsOf<typeof ItemRating>;

export interface UserItem {
  id: string;
  itemId: string;
  userId: string;
  rating: ItemRating;
  state: ItemState;
}

export class UserItem implements UserItem {
  constructor(itemId: string, userId: string) {
    this.itemId = itemId;
    this.userId = userId;
    this.rating = ItemRating.notSet;
    this.state = ItemState.notSet;
  }
}

export interface UserItemView extends Item {
  [title: string]: string;
  description: string;
  imageUrl: string;
  rating: ItemRating;
  state: ItemState;
}

export class UserItemView implements UserItemView {
  constructor(item: Movie, categoryId: string, itemId: string = null) {
    // ItemId is optional in Item classes, so if we don't have it, we used the one from the argument
    this.id = itemId ? itemId : item.itemId;
    this.title = item.title;
    this.description = item.description;
    this.imageUrl = item.imageUrl;
    this.rating = ItemRating.notSet;
    this.state = ItemState.notSet;
    this.categoryId = categoryId;
  }
}

export const ItemsStatus = Object.freeze({
  loading: 'loading' as 'loading',
  ok: 'ok' as 'ok',
  error: 'error' as 'error',
  wrongCategory: 'wrongCategory' as 'wrongCategory'
})

export type ItemsStatus = EnumLiteralsOf<typeof ItemsStatus>;

export type ItemsState = {
  categoryId: string;
  items: Array<UserItemView>;
  status: ItemsStatus;
}

export type matchParams = {
  categoryName: string;
}
export type ItemsProps = {
  match: match<matchParams>;
}

export const ItemsActionType = Object.freeze({
  SET_CATEGORY_ID: 'SET_CATEGORY_ID' as 'SET_CATEGORY_ID',
  SET_ITEMS: 'SET_ITEMS' as 'SET_ITEMS',
  SET_STATUS: 'SET_STATUS' as 'SET_STATUS',
  ADD_ITEM: 'ADD_ITEM' as 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM' as 'REMOVE_ITEM',
  UPDATE_ITEM_RATING: 'UPDATE_ITEM_RATING' as 'UPDATE_ITEM_RATING',
  UPDATE_ITEM_STATE: 'UPDATE_ITEM_STATE' as 'UPDATE_ITEM_STATE'
})

export type ItemsActionType = EnumLiteralsOf<typeof ItemsActionType>;

export type ItemsAction = { 
  type: ItemsActionType;
  payload: any;
};

export type ItemsActionCreator = (message: any) => (ItemsAction);

export type SearchItemType = Exclude<keyof UserItemView,  "id" | "categoryId">;

export const searchItemTypes: Array<string> = ["title", "description"];

export const SortItemOptions = Object.freeze({
  title: 'title' as 'title',
  rating: 'rating' as 'rating',
  state: 'state' as 'state'
})

export type SortItemOptions = EnumLiteralsOf<typeof SortItemOptions>;

export const SortItemOrder = Object.freeze({
  increase: 'increase' as 'increase',
  decrease: 'decrease' as 'decrease'
})

export type SortItemOrder = EnumLiteralsOf<typeof SortItemOrder>;

export type Movie = {
  itemId?: string;
  externalId: string;
  title: string;
  description: string;
  imageUrl: string;
  originalLanguage: string;
  releaseDate: string;
  genres: Array<MovieGenre>;
}

export type MovieGenre = {
  name: string;
  id: string;
}

export type ItemView = Movie | null;