import { EnumLiteralsOf } from "types";

export type ModalState = {
  show: boolean;
  params: ModalParams;
}

export type ModalParams = {
  type: ModalType;
  className?: string;
  onConfirmAction?: Function;
  onSearchAction?: Function;
  title?: string;
  message?: string;
  confirmButton?: string;
  cancelButton?: string;
  notification?: string;
  showOptions?: boolean; 
  ModalBody?: JSX.Element;
}

export type UseModal = () => ([ModalState, React.Dispatch<ModalAction>]);

export type ModalSelectorProps = {
  params: ModalParams;
  closeModal: Function;
}

export const ModalType = Object.freeze({
  default: '' as '',
  addValueInput: 'add-value-input' as 'add-value-input',
  modalWithBody: 'modal-with-body' as 'modal-with-body',
})

export type ModalType = EnumLiteralsOf<typeof ModalType>

/********************************
 * MODAL STATE MANAGEMENT TYPES  
 *******************************/ 

export const ModalActionType = Object.freeze({
  OPEN_MODAL: 'OPEN_MODAL' as 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL' as 'CLOSE_MODAL',
  SET_MODAL_NOTIFICATION: 'SET_MODAL_NOTIFICATION' as 'SET_MODAL_NOTIFICATION',
})

export type ModalActionType = EnumLiteralsOf<typeof ModalActionType>;

export type ModalAction = { 
  type: ModalActionType;
  payload: any; 
};

export type ModalActionCreator = (message?: any) => (ModalAction)
