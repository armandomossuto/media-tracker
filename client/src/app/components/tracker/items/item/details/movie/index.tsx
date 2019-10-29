import * as React from 'react';
import { MovieDetailsProps } from '../types';

/**
 * Details for items from Movie category
 */
const Movie: React.FunctionComponent<MovieDetailsProps> = ({ item }: MovieDetailsProps) =>
  <div>
    <div className="item-details__row">
      <span className="item-details__row__element">
        <b>Genres: </b> {item.genres.map((genre, index) => `${genre.name}${index + 1 !== item.genres.length ? ', ': '' }`)}
      </span>
      <span className="item-details__row__element">
        <b>Original Language: </b> {item.originalLanguage}
      </span>
      <span className="item-details__row__element">
        <b>Release Date: </b> {item.releaseDate}
      </span>
    </div>
    <div className="item-details__description">
      {item.description}
    </div>
  </div>


export default Movie;