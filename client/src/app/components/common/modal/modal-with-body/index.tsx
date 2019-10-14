import * as React from 'react';

import { ModalWithBodyProps } from './types';

/**
 * Empty modal with a body provided by the parent component and a close button
 * @param ModalBody - React component to be rendered in the modal's body
 * @param closeModal - Closes the modal
 */
const ModalWithBody: React.FunctionComponent<ModalWithBodyProps> = ({ ModalBody, closeModal }: ModalWithBodyProps) =>
  <div className="modal">
    <div className="modal__body">
      {ModalBody}
    </div>
    <div className="modal__buttons">
      <div
        className="modal__buttons__actions"
        onClick={(): void => closeModal()}
      >
        Close
      </div>
    </div>
  </div>


export default ModalWithBody;