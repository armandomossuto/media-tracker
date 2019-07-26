import { handleFetchAuthErrors } from './handle-auth-errors';
import { serverUrl } from 'configuration';

// types
import { RequestType  } from './types';
import { SessionAction } from 'types';
import { Dispatch } from 'react';
import { getAuthenticationCookie } from 'utils/cookies';

/**
 * Utility function for handling fetch requests
 * @returns deserialized response
 * @throws error
 */
export const fetchRequest = async (path: string, requestType: RequestType, dispatch: Dispatch<SessionAction>, requestBody: object = null) => {
  const URL = `${serverUrl}/${path}`;

  const accessToken = getAuthenticationCookie().accessToken;
  
  let config: RequestInit =  buildRequestConfig(requestType, accessToken);
  
  if (requestBody !== null) {
    config.body = JSON.stringify(requestBody);
  }

  let response: Response = await fetch(URL, config);

  if(!response.ok && response.status === 401) {
    const tokens = await handleFetchAuthErrors(accessToken, dispatch);
    config = buildRequestConfig(requestType, tokens.accessToken);
    response = await fetch(URL, config);
  }

  if(response.ok) {
    return response.json();
  }
};

export const buildRequestConfig = (requestType: RequestType, accessToken: string = '') =>  {
  const config: RequestInit = { 
    method: requestType, 
    mode: 'cors', 
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    credentials: 'include'
  };
  return config;
}

export const simpleFetch = async (path: string, requestType: RequestType, requestBody: object = null) => {
  const URL = `${serverUrl}/${path}`;

  let config: RequestInit =  buildRequestConfig(requestType);

  if (requestBody !== null) {
    config.body = JSON.stringify(requestBody);
  }

  let response: Response = await fetch(URL, config);
  
  if(response.ok) {
    return response.json();
  } else {
    throw response;
  }
}
