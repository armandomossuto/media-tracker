import * as React from "react";
import { Link } from 'react-router-dom';

/**
 * Common Navigation bar
 */
const Navbar: React.FunctionComponent = () => {

  const accountDisplay: string = "Account";

  return(
    <nav>
      <ul>
        <li> <Link to="/"> Home </Link> </li>
        <li> <Link to="/tracker"> Tracker </Link>  </li>
        <li> <Link to="/account"> { accountDisplay } </Link> </li>
      </ul>
    </nav>
  )
}

export default Navbar;