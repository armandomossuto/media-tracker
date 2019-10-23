import { Movie } from "../types";

export type ItemSearchRequest = {
  categoryId: string;
  searchTerm: string;
  userId: string;
  page: number;
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
