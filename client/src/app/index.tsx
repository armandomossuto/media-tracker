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
import Loading from "components/common/loading";

const Index: React.FunctionComponent = () => {
  // We check the session status, because we only grant access to the tracker route if the user has logged in
  const [{ status },] = useSessionState();
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        {status === SessionStatus.notInitialised
          ? <Loading />
          : <span>
            <Route exact path="/" component={Home} />
            <Route path="/account" component={Account} />
          </span>
        }
        {status === SessionStatus.ok
          ? <Route path="/tracker" component={Tracker} />
          : null
        }
        <Footer />
      </div>
    </Router>
  )
}

export default GlobalStateProvider(Index);