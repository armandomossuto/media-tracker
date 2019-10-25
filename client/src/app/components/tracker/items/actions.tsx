import { ItemsActionCreator, ItemsActionType, ItemsStatus, UserItemView } from './types';

export const setCategoryId: ItemsActionCreator = (categoryId: string) => ({
  type: ItemsActionType.SET_CATEGORY_ID,
  payload: categoryId,
});

export const setItems: ItemsActionCreator = (items: Array<UserItemView>) => ({
  type: ItemsActionType.SET_ITEMS,
  payload: items,
});

export const setItemsStatus: ItemsActionCreator = (status: ItemsStatus) => ({
  type: ItemsActionType.SET_STATUS,
  payload: status,
});

export const addItem: ItemsActionCreator = (item: UserItemView) => ({
  type: ItemsActionType.ADD_ITEM,
  payload: item,
});

export const removeItem: ItemsActionCreator = (itemId: string) => ({
  type: ItemsActionType.REMOVE_ITEM,
  payload: itemId,
});

export const updateItemRating: ItemsActionCreator = ({ itemId, rating }) => ({
  type: ItemsActionType.UPDATE_ITEM_RATING,
  payload: { itemId, rating }
});

export const updateItemState: ItemsActionCreator = ({ itemId, state }) => ({
  type: ItemsActionType.UPDATE_ITEM_STATE,
  payload: { itemId, state }
});