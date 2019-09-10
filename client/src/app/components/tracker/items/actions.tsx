import { ItemsActionCreator, Item, ItemsActionType, ItemsStatus } from './types';

export const setCategoryId: ItemsActionCreator = (categoryId: string) => ({
  type: ItemsActionType.SET_CATEGORY_ID,
  payload: categoryId,
});

export const setItems: ItemsActionCreator = (items: Array<Item>) => ({
    type: ItemsActionType.SET_ITEMS,
    payload: items,
  });

  export const setItemsStatus: ItemsActionCreator = (status: ItemsStatus) => ({
    type: ItemsActionType.SET_STATUS,
    payload: status,
  });

  export const addItem: ItemsActionCreator = (item: Item) => ({
    type: ItemsActionType.ADD_ITEM,
    payload: item,
  });

  export const removeItem: ItemsActionCreator = (itemId: string) => ({
    type: ItemsActionType.ADD_ITEM,
    payload: itemId,
  });
  