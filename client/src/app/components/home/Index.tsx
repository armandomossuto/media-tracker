import * as React from "react";
import { useSessionState } from 'services/session/state';

const Home: React.FunctionComponent = () => {
  const [{ status }, ] = useSessionState();

  return(
    <div>Current status: {status} </div>
  )
}

export default Home;