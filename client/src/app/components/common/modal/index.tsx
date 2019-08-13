import * as React from 'react';
import {createContext, useContext, useState} from 'react';

// Types
import { ModalParams, ModalSelectorProps, UseModal, ModalType } from './types';

// Initial State
import { initialState } from './store'

// Modal Components
import AddSingleElement from './add-single-element';

// Creating state and dispatch contexts
const StateContext = createContext(initialState);
const DispatchContext = createContext(([() => 0]) as Array<Function>);

/**
 * HOC for adding a giving access to the modal
 * @param {component} WrappedComponent
 */
export const WithModal = (WrappedComponent: React.FunctionComponent) => ({ ...props }) => {
  // Modal internal state
  const [modal, setModal] = useState(initialState);

  /**
   * Updates notification modal states to trigger it top open
   */
  const openModal = (params: ModalParams = initialState.params) => setModal({ show: true, params });

  /**
   * Closes the notification modal and cleans its state
   */
  const closeModal = () =>  setModal(initialState)

  return(
    <DispatchContext.Provider value={[openModal, closeModal]}>
      <StateContext.Provider value={modal}>
        <div className="modal-wrapper">
        {
          modal.show
            ? <ModalSelector
                params={modal.params}
                closeModal={closeModal}
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
 * Example how to use it: [state, [openModal, closeModal]] =  useModal();
 */
export const useModal: UseModal = () => ([useContext(StateContext), useContext(DispatchContext)]);

/**
 * Simple selector for the different types of modals
 */
const ModalSelector = ({ params, closeModal }: ModalSelectorProps) => {
  const { type, className, onConfirmAction, onSearchAction, title, message, confirmButton, cancelButton } = params;
  switch (type) {
    case ModalType.addValueInput:
      return (
        <AddSingleElement
          message={message}
          onConfirmAction={onConfirmAction}
          onSearchAction={onSearchAction}
          closeModal={closeModal}
        />)
  }
}