import { Movie } from "../types";

export type ItemSearchRequest = {
  categoryId: string;
  searchTerm: string;
}

export type ItemSearchView = Movie;

export type AddItemProps = {
  categoryId: string;
  addItem: Function;
}


export type AddItemModalProps = {
  categoryId: string;
  addItem: Function;
}
