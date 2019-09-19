import * as React from "react";
import { Route } from 'react-router-dom';

// Components
import Categories from './categories';
import Items from './items';

// Types
import { TrackerProps } from "./types";

const Tracker: React.FunctionComponent<TrackerProps> = ({ match }: TrackerProps) => 
  <div>
    <Route exact path={`${match.url}`} component={Categories} />
    <Route path={`${match.url}/:categoryName`} component={Items} />
  </div>

export default Tracker;
