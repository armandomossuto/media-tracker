import * as React from "react";
import { useState } from 'react';
import { AccountInitialiseStatus } from "./types";

import LogIn from './log-in';
import Create from './create'

const AccountInitialise: React.FunctionComponent = () => {
  const [accountIntialiseStatus, setAccountIntialiseStatus] = useState(AccountInitialiseStatus.logIn);

  switch(accountIntialiseStatus) {
    case AccountInitialiseStatus.logIn:
      return <LogIn setAccountIntialiseStatus={setAccountIntialiseStatus}/>
    case AccountInitialiseStatus.create:
      return <Create setAccountIntialiseStatus={setAccountIntialiseStatus}/>
  }
}

export default AccountInitialise;