import * as React from "react";

// Custom State hooks
import { useSessionState } from 'state';

// Types
import { SessionStatus } from "services/session/types";

// Components
import AccountInitialise from './account-initialise/index'
import Profile from './profile';


/**
 * Account Page. It will show the log in/account creation or profile component depending on the user session status
 */
const Account: React.FunctionComponent = () => {
  const [{ status, accountInfo }, dispatcher] = useSessionState();
  
  return(
    <div>
      {status === SessionStatus.ok
        ? <Profile />
        : <AccountInitialise />
      }
    </div>
  )
}

export default Account;