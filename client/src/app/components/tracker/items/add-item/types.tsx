export type ItemSearchRequest = {
  categoryId: string;
  searchTerm: string;
}

export type ItemSearchView = MovieSearchView;

export type MovieSearchView = {
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

export type AddItemProps = {
  categoryId: string;
}


export type AddItemModalProps = {
  categoryId: string;
}

export type ItemResultProps = {
  item: MovieSearchView;
}