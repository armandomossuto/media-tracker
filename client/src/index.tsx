// React
import * as React from "react";
import * as ReactDOM from "react-dom";

// Index file for styling
import './app/styles/index.scss';

// Index for the App
import { Index } from './app/index';

ReactDOM.render(
    <Index compiler="TypeScript" framework="React"/>
    , document.getElementById('root')
);