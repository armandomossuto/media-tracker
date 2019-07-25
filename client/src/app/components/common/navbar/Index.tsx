import * as React from "react";
import { Link } from 'react-router-dom';
import { useSessionState } from 'state';
import { SessionStatus } from "services/session/types";

/**
 * Common Navigation bar
 */
const Navbar: React.FunctionComponent = () => {
  const [{ status, accountInfo },] = useSessionState();

  const accountDisplay: string = status === SessionStatus.ok ? accountInfo.username : "Account";

  return(
    <nav>
      <ul>
        <li> <Link to="/"> Home </Link> </li>
        {status === SessionStatus.ok ? <li> <Link to="/tracker"> Tracker </Link>  </li> : null }
        <li> <Link to="/account"> { accountDisplay } </Link> </li>
      </ul>
    </nav>
  )
}

export default Navbar;