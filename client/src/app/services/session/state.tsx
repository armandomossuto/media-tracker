// React and used hooks to create the session store hook
import * as React from 'react';
import {createContext, useContext, useReducer} from 'react';

// Reducer
import reducer from './reducer';

// Initial State
import { initialState } from './store'
import { SessionAction, SessionState } from './types';

const StateContext = createContext(initialState);
const DispatchContext = createContext((() => 0) as React.Dispatch<SessionAction>);


type SessionStateProps = {
  children: React.ReactElement;
}

/**
 * Provider for giving access to the global store values and dispatcher
 * to the components wrapped and all the three of children
 */
export const SessionStateProvider: React.FunctionComponent<SessionStateProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return(
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
      {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

type useSessionState = () => ([SessionState, React.Dispatch<SessionAction>]);
/**
 * Hook for accessing to the global store values and dispatcher
 * Example how to use it: [state, dispatcher] =  useGlobalState();
 */
export const useSessionState: useSessionState = () => ([useContext(StateContext), useContext(DispatchContext)]);