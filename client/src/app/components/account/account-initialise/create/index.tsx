import * as React from "react";
import { AccountInitialiseProps, AccountInitialiseStatus } from "../type";

const Create = ({ setAccountIntialiseStatus }: AccountInitialiseProps) => {

  return (
    <div>
      If you already have an account and want to log in, click
          <span onClick={() => setAccountIntialiseStatus(AccountInitialiseStatus.logIn)}> HERE </span>
    </div>
  )
}


export default Create;