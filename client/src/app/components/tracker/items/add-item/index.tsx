import * as React from 'react';

// Types
import { AddItemProps } from './types';
import { ModalParams, ModalType } from 'types';

// Utils and custom hooks
import { openModal } from 'state';
import { useModal } from 'components/common/modal';

// Components
import AddItemModal from './modal-body';

/**
 * Manages the Add-button and the process of adding a new Category to the User
 * @param categoryId - Id of the category where we are currently making changes
 * @param addItem - Function to be excuted when the user adds a new Item to trigger an update of the items list 
 */
const AddItem: React.FunctionComponent<AddItemProps> = ({ categoryId, addItem }: AddItemProps) => {

  // We need the modalDispatch to manage it
  const [, modalDispatch] = useModal();

  // Params for the modal
  const modalParams: ModalParams = {
    type: ModalType.modalWithBody,
    ModalBody: <AddItemModal categoryId={categoryId} addItem={addItem}/>
  }
  
  return(
    <span onClick={(): void => modalDispatch(openModal(modalParams))}>
      Add a new element
    </span>
  )
}

export default AddItem;