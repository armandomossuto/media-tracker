import * as React from 'react';
import { useState } from 'react';
import { ItemRatingProps } from '../types';

/**
 * Renders and allows to change an Item rating
 */
const Rating: React.FunctionComponent<ItemRatingProps> = ({ rating, updateRating }: ItemRatingProps) => {
  // For keeping track of which star is currently on mouse hover
  const [hoverStar, changeHoverStar] = useState<number>(0); 

  // For showing the remove button when user hovers over the rating stars
  const [showRemoveButton, setShowRemoveButton] = useState<boolean>(false); 

  return (
    <div
      className="item-rating"
      onMouseEnter={(): void => setShowRemoveButton(true)}
      onMouseLeave={(): void => setShowRemoveButton(false)}
    >
      { //We will generate 5 stars, and we will apply full star class for representing the rating
        Array.from(Array(5).keys()).map(star =>
          <span
            className="item-rating__star"
            title="Click to change rating"
            onClick={(e): void => updateRating(e, star + 1)}
            onMouseEnter={(): void => changeHoverStar(star + 1)}
            onMouseLeave={(): void => changeHoverStar(0)}
            key={`star${star}`}
          >
            { // If mouse is over a star, hoverStar is greater than 0. If not, we highlight current value
              hoverStar > 0 && star < hoverStar ||  hoverStar == 0 && star < Number(rating) ? "★" : "☆"
            }
          </span>
        )}
      {showRemoveButton
        ? <span 
          className="item-rating__remove-button"
          title="Remove rating"
          onClick={(e): void => updateRating(e, 0)}
        >x</span>
        : null
      }
    </div>
  )
}
export default Rating;