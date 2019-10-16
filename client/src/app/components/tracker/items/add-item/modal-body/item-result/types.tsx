import { Movie } from "components/tracker/items/types";
import { EnumLiteralsOf } from "types";

export type ItemResultProps = {
    item: Movie;
    categoryId: string;
    addItem: Function;
  }
  
export type AddItemRequest = {
    item: Movie;
    userId: string;
    categoryId: string;
  }

export const AddItemNotification = Object.freeze({
  initial: '' as 'initial',
  error: 'Something went wrong. Please try again.' as 'error'
})
  
export type AddItemNotification = EnumLiteralsOf<typeof AddItemNotification>