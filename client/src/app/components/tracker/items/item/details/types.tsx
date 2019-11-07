import { EnumLiteralsOf } from "types";
import { Movie, ItemView } from "../../types";

export type ItemDetailProps = {
  categoryId: string;
  itemId?: string;
  showDetails: boolean;
  itemDetails?: ItemView;
}

export const ItemDetailsNotification = Object.freeze({
  initial: '' as 'initial',
  error: 'There was an error when we tried to retrieve the details from this item. Please, refresh the page and try again' as 'error',
  loading: 'Please wait a moment while we load the details' as 'loading',
})

export type ItemDetailsNotification = EnumLiteralsOf<typeof ItemDetailsNotification>

export type MovieDetailsProps = {
  item: Movie;
}