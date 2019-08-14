import { ModalActionCreator, ModalParams, ModalActionType } from "./types";

/**
 * Open Modal with a set of params
 * @param params - @see ModalParams
 */
export const openModal: ModalActionCreator = (params: ModalParams) => ({
  type: ModalActionType.OPEN_MODAL,
  payload: params,
});

/**
 * Closes the Modal and resets its state
 */
export const closeModal: ModalActionCreator = () => ({
  type: ModalActionType.CLOSE_MODAL,
  payload: null,
});

/**
 * Set a notification for a modal that is currently open
 * @param notification 
 */
export const setModalNotification: ModalActionCreator = (notification: string) => ({
  type: ModalActionType.SET_MODAL_NOTIFICATION,
  payload: notification,
});
