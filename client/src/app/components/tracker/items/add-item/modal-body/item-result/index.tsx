import * as React from 'react';
import { ItemResultProps } from '../../types';
import { useState } from 'react'
import * as imageNotAvailable from 'images/image-not-available.png';

/**
 * Component for rendering an item result
 * @param item 
 */
const ItemResult: React.FunctionComponent<ItemResultProps> = ({ item }: ItemResultProps) => {

  // Source for the image
  const [imgSrc, setImageSrc] = useState(item.imageUrl);

  // Whether or not this item has been added
  const [isAdded, setIsAdded] = useState(false);

  /**
   * Handles error from trying to render an image and replaces it with our placeholder
   */
  const onHandleImageError = (): void => setImageSrc('/images/image-not-available.png');


  return (
    <div
      className="add-item-modal__result"
    >
      <img
        src={imgSrc === '/images/image-not-available.png' ? imageNotAvailable : item.imageUrl}
        title={item.title}
        className="add-item-modal__result__image"
        onError={(): void => onHandleImageError()}
      ></img>
      <h3 className="add-item-modal__result__title">{item.title}</h3>
      {isAdded
        ? <span> ✓ </span>
        : <span> + </span> 
      }
      
    </div>
  )
}

export default ItemResult;