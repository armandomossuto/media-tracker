/* eslint-disable react/display-name */
import * as React from 'react';
import { createContext, useContext, useReducer } from 'react';

// Types
import { ModalSelectorProps, UseModal, ModalType, ModalAction } from './types';

// Initial State
import { initialState } from './store'

// Modal Components
import AddSingleElement from './add-single-element';

// State
import reducer from './reducer';
import { closeModal } from './actions';
import ModalWithBody from './modal-with-body';

// Creating state and dispatch contexts
const StateContext = createContext(initialState);
const DispatchContext = createContext((() => 0) as React.Dispatch<ModalAction>);

/**
 * HOC for adding a giving access to the modal
 * @param {component} WrappedComponent
 */
export const WithModal = (WrappedComponent: React.FunctionComponent) => ({ ...props }): JSX.Element => {
  // Modal internal state
  const [modal, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={modal}>
        <div className="modal-wrapper">
          {
            modal.show
              ? <ModalSelector
                params={modal.params}
                closeModal={(): void => dispatch(closeModal())}
              />
              : null
          }
          <WrappedComponent>
            {props}
          </WrappedComponent>
        </div>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

/**
 * Hook for accessing to the global store values and dispatcher
 * Example how to use it: [state, dispatch] =  useModal();
 */
export const useModal: UseModal = () => ([useContext(StateContext), useContext(DispatchContext)]);

/**
 * Simple selector for the different types of modals
 */
const ModalSelector: React.FunctionComponent<ModalSelectorProps> = ({ params, closeModal }: ModalSelectorProps) => {
  const {
    type,
    // className, 
    onConfirmAction,
    onSearchAction,
    // title, 
    message,
    // confirmButton, 
    // cancelButton, 
    notification,
    ModalBody,
  } = params;
  switch (type) {
    case ModalType.addValueInput:
      return (
        <AddSingleElement
          message={message}
          onConfirmAction={onConfirmAction}
          onSearchAction={onSearchAction}
          closeModal={closeModal}
          notification={notification}
        />)
    case ModalType.modalWithBody:
      return (
        <ModalWithBody
          ModalBody={ModalBody}
          closeModal={closeModal}
        />
      )
  }
}