// React
import * as React from "react";
import * as ReactDOM from "react-dom";

// Index file for styling
import './app/styles/index.scss';

// Index for the App
import Index from './app/index';

// Cookies management library
import { CookiesProvider } from 'react-cookie';

// Session State Provider
import { SessionStateProvider } from "services/session/state";


ReactDOM.render(
  <CookiesProvider>
    <SessionStateProvider>
      <Index />
    </SessionStateProvider>
  </CookiesProvider>
  , document.getElementById('root')
);