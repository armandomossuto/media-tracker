import { Dispatch } from "react";
import { SessionAction, UserAccessToken } from "types";
import { setTokens } from "services/session/actions";

/**
 * Handles Authorization error from server request. It will try to refresh the tokens
 */
export const handleFetchAuthErrors = async (accessToken: string, dispatch: Dispatch<SessionAction>) => {
  const tokens: UserAccessToken = { accessToken };

  const config: RequestInit = { method: 'Post', mode: 'cors', headers: { 'Content-Type': 'application/json' }, 'body': JSON.stringify(tokens) };

  const response = await fetch(`api/user/refresh`, config);

  const newToken: UserAccessToken = await response.json();

  dispatch(setTokens(newToken));

  return newToken;
};
