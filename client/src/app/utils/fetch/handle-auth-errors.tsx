import { Dispatch } from "react";
import { SessionAction, UserAccessToken, SessionStatus } from "types";
import { setAccountStatus } from "services/session/actions";
import { serverUrl } from "configuration";
import { createAuthenticationCookie } from "utils/cookies";

/**
 * Handles Authorization error from server request. It will try to refresh the tokens
 */
export const handleFetchAuthErrors = async (accessToken: string, dispatch: Dispatch<SessionAction>): Promise<UserAccessToken> => {
  const tokens: UserAccessToken = { accessToken };

  const config: RequestInit = {
    method: 'Post',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include' ,
    body: JSON.stringify(tokens)
  };

  const response = await fetch(`${serverUrl}/api/user/refresh`, config);

  if(!response.ok) {
    dispatch(setAccountStatus(SessionStatus.notLogged));
    throw response;
  }

  const newToken: UserAccessToken = await response.json();

  createAuthenticationCookie(newToken);

  return newToken;
};
