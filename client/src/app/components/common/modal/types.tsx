import { EnumLiteralsOf } from "types";

export type ModalState = {
    show: boolean,
    params: ModalParams
}

export type ModalParams = {
    type: ModalType,
    className?: string,
    onConfirmAction?: Function,
    onSearchAction?: Function,
    title?: string,
    message?: string,
    confirmButton?: string,
    cancelButton?: string
}

export type UseModal = () => ([ModalState, Array<Function>]);

export type ModalSelectorProps = {
    params: ModalParams,
    closeModal: Function
}

export type ModalType = EnumLiteralsOf<typeof ModalType>

export const ModalType = Object.freeze({
  default: '' as '',
  addValueInput: 'add-value-input' as 'add-value-input'
})