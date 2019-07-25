import { Dispatch } from "react";
import { SessionAction, UserToken } from "types";
import { setTokens } from "services/session/actions";

/**
 * Handles Authorization error from server request. It will try to refresh the tokens
 */
export const handleFetchAuthErrors = async (refreshToken: string, accessToken: string, dispatch: Dispatch<SessionAction>) => {
  const tokens: UserToken = { refreshToken, accessToken };

  const config: RequestInit = { method: 'Post', mode: 'cors', headers: { 'Content-Type': 'application/json' }, 'body': JSON.stringify(tokens) };

  const response = await fetch(`api/user/refresh`, config);

  const newTokens: UserToken = await response.json();

  dispatch(setTokens(newTokens));

  return newTokens;
};
