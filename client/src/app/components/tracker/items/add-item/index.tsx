import * as React from 'react';
import { AddItemProps } from './types';
import { openModal } from 'state';
import { useModal } from 'components/common/modal';
import { ModalParams, ModalType } from 'types';
import AddItemModal from './modal-body';


/**
 * Manages the Add-button and the process of adding a new Category to the User
 */
const AddItem: React.FunctionComponent<AddItemProps> = ({ categoryId }: AddItemProps) => {


  // Use Modal control methods
  const [, modalDispatch] = useModal();


  const modalParams: ModalParams = {
    type: ModalType.modalWithBody,
    ModalBody: <AddItemModal categoryId={categoryId} />
  }
  
  return(
    <span onClick={(): void => modalDispatch(openModal(modalParams))}>
      Add a new element
    </span>
  )
}

export default AddItem;