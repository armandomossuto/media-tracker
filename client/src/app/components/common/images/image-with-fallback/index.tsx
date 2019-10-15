import * as React from 'react';
import { useState } from 'react'
import * as imageNotAvailable from 'images/image-not-available.png';
import { ImageWithFallbackProps } from './types';

/**
 * Component for rendering a placeholder if image request to external service fails
 * @param imageUrl 
 */
const ImageWithFallback: React.FunctionComponent<ImageWithFallbackProps> = ({ imageUrl, title, className }: ImageWithFallbackProps) => {

  // Source for the image
  const [imgSrc, setImageSrc] = useState(imageUrl);

  /**
   * Handles error from trying to render an image and replaces it with our placeholder
   */
  const onHandleImageError = (): void => setImageSrc('/images/image-not-available.png');

  return (
    <img
      src={imgSrc === '/images/image-not-available.png' ? imageNotAvailable : imageUrl}
      title={title}
      className={className}
      onError={(): void => onHandleImageError()}
    ></img>
  )
}

export default ImageWithFallback;