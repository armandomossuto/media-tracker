import * as React from "react";

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/home';
import Tracker from './components/tracker';
import Account from './components/account';
import Navbar from './components/common/navbar';
import Footer from './components/common/footer';

const Index: React.FunctionComponent = () =>
  <Router>
    <Navbar />
    <Route exact path="/" component={Home} />
    <Route path="/tracker" component={Tracker} />
    <Route path="/account" component={Account} />
    <Footer />
  </Router>

export default Index;