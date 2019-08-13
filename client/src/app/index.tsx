import * as React from "react";

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from 'components/home';
import Tracker from 'components/tracker';
import Account from 'components/account';
import Navbar from 'components/common/navbar';
import Footer from 'components/common/footer';

// With Sesion Service, which will handle the user session
import { useSessionState, GlobalStateProvider } from 'state';
import { SessionStatus } from "types";

const Index: React.FunctionComponent = () => {
// We check the session status, because we only grant access to the tracker route if the user has logged in
const [{ status }, ] = useSessionState();
return(
  <Router>
    <Navbar />
    <Route exact path="/" component={Home} />
    {status === SessionStatus.ok
      ? <Route path="/tracker" component={Tracker} />
      : null
    }
    <Route path="/account" component={Account} />
    <Footer />
  </Router>
  )
}

export default GlobalStateProvider(Index);