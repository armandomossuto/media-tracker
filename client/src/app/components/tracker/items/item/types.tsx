import { UserItemView, ItemRating, ItemState, ItemsAction } from "../types";
import { Dispatch } from "react";
import { EnumLiteralsOf } from "types";

export type ItemDescriptionProps = {
  item: UserItemView;
  itemsDispatch: Dispatch<ItemsAction>;
  onRemoveItem: Function;
}

export type ItemRatingProps = {
  rating: ItemRating;
  updateRating: Function;
}

export type ItemStateProps = {
  state: ItemState;
  updateState: Function;
}

export type UpdateUserItem = {
  itemId: string;
  userId: string;
  newUserItemInformation: {
    rating?: ItemRating;
    state?: number;
  };
}

export const UpdateItemNotification = Object.freeze({
  initial: '' as 'initial',
  ratingError: 'There was an error when we tried to update the rating. Please try again' as 'ratingError',
  stateError: 'There was an error when we tried to update the state. Please try again' as 'stateError',
  removeError: 'There was an error when we tried to remove this item. Please try again' as 'removeError',
})

export type UpdateItemNotification = EnumLiteralsOf<typeof UpdateItemNotification>
