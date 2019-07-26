import * as React from 'react';
import { useEffect } from 'react';

// Sesion State hook
import { useSessionState } from './state';

// Types
import { SessionStatus, User, UserAccessToken } from './types';

// Reducer Actions and utils
import { setAccountStatus, setAccountInfo } from './actions';
import { getAuthenticationCookie } from 'utils/cookies';
import { fetchRequest } from 'utils/fetch';


/**
 * Manages the User Session. Wraps parts of the application that depend on the user session.
 */
const WithSessionService = (WrappedComponent: React.FunctionComponent) => ({ ...props }) => {
  // Get Session information using the Session State Hook
  const [sessionState, dispatch] = useSessionState();

  // We check current status of the session and perform actions according to it
  const checkStatus = () => {
    const tokens: UserAccessToken = getAuthenticationCookie();

    // Status should be not initialed at this step, but we check it anyway
    if(sessionState.status === SessionStatus.notInitialised) {
      // Even if the tokens are present, we do a fetch request to get the user information
      if(tokens) {
        fetchRequest(`api/users/${tokens.userId}`, 'GET', dispatch)
          .then((accountInfo: User) => {
            dispatch(setAccountInfo(accountInfo));
            dispatch(setAccountStatus(SessionStatus.ok));
          })
          .catch(err => setAccountStatus(SessionStatus.notLogged));
      } else {
        // If no tokens are present, we set the status as notLogged
        dispatch(setAccountStatus(SessionStatus.notLogged));
      }
    } else {
      dispatch(setAccountStatus(SessionStatus.notLogged));
    }
  }

  // Check the status when mounting the component wrapped by WithSessionService
  useEffect(() => checkStatus(), []);

    return(
      <WrappedComponent
        {...props}
      />
    )
}

export default WithSessionService;