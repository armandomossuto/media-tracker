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

  // If the access cookie expired, the server will return a 401 status error
  // In this case we need to handle the refresh of the cookies and repeat the fetch request
  if(!response.ok && response.status === 401) {
    const tokens = await handleFetchAuthErrors(accessToken, dispatch);
    config = buildRequestConfig(requestType, tokens.accessToken);
    response = await fetch(URL, config);
  }
  
  // If there is another status error, we throw it for the component to handle it properly
  if(!response.ok) {
    throw response;
  }

  if(response.ok) {
    return response.json();
  }
};

/**
 * Creates a config object for a fetch request with our default values
 */
export const buildRequestConfig = (requestType: RequestType, accessToken: string = '') =>  {
  const config: RequestInit = { 
    method: requestType, 
    mode: 'cors', 
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    credentials: 'include'
  };
  return config;
}

/**
 * For doing a fetch request without Authorization
 * It will only work with the api endpoints that don't require the jwt token: login, account create, refresh tokens
 */
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
