import { Movie } from "components/tracker/items/types";

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