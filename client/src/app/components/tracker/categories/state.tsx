/* eslint-disable react/display-name */
// React and used hooks to create the session store hook
import * as React from 'react';
import {createContext, useContext, useReducer} from 'react';

// Initial State
import { initialState } from './store'

import reducer from './reducer'

import { CategoriesState, CategoriesAction } from './types';
import { RouteComponentProps, StaticContext, WithRouterStatics } from 'react-router';

const StateContext = createContext(initialState);
const DispatchContext = createContext((() => 0) as React.Dispatch<CategoriesAction>);

/**
 * Provider for giving access to the global store values and dispatcher
 * to the components wrapped and all the three of children
 */
export const CategoriesStateProvider = (WrappedComponent: WrappedComponent) => ({ ...props }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return(
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <WrappedComponent>
          {props}
        </WrappedComponent>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

type UseCategoriesState = () => ([CategoriesState, React.Dispatch<CategoriesAction>]);

/**
 * Hook for accessing to the global store values and dispatcher
 * Example how to use it: [state, dispatcher] =  useGlobalState();
 */
export const useCategoriesState: UseCategoriesState = () => ([useContext(StateContext), useContext(DispatchContext)]);

type WrappedComponent = 
React.FunctionComponent | React.ComponentClass<Pick<RouteComponentProps<any, StaticContext, any>, never>, any> & WithRouterStatics<React.FunctionComponent<{}>>;