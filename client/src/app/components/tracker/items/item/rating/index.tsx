import * as React from 'react';
import { ItemRatingProps } from '../types';

/**
 * Renders and allows to change an Item rating
 */
const Rating: React.FunctionComponent<ItemRatingProps> = ({ rating, updateRating }: ItemRatingProps) =>
  <div className="item-rating">
    { //We will generate 5 stars, and we will apply full star class for representing the rating
      Array.from(Array(5).keys()).map(star =>
        <span
          className="item-rating__star"
          title="Click to change rating"
          onClick={(e): void => updateRating(e, star + 1)}
          key={`star${star}`}
        >
          {star < Number(rating) ? "★" : "☆"}
        </span>
      )}
  </div>

export default Rating;