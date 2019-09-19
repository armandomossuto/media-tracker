import { ModalState, ModalType } from "./types";

export const initialState: ModalState = {
  show: false,
  params: {
    type: ModalType.default,
    className: '',
    onConfirmAction: null,
    onSearchAction: null,
    title: '',
    message: '',
    confirmButton: 'Confirm',
    cancelButton: 'Cancel'
  }
}