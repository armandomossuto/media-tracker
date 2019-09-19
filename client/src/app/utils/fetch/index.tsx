import { handleFetchAuthErrors } from './handle-auth-errors';
import { serverUrl } from 'configuration';

// types
import { RequestType  } from './types';
import { SessionAction } from 'types';
import { Dispatch } from 'react';
import { getAuthenticationCookie } from 'utils/cookies';

/**
 * Creates a config object for a fetch request with our default values
 */
export const buildRequestConfig = (requestType: RequestType, accessToken = ''): RequestInit =>  {
  const config: RequestInit = { 
    method: requestType, 
    mode: 'cors', 
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    credentials: 'include'
  };
  return config;
}

/**
 * Utility function for handling fetch requests
 * @returns deserialized response
 * @throws error
 */
export const fetchRequest = 
async (path: string, requestType: RequestType, dispatch: Dispatch<SessionAction>, requestBody: object = null): Promise<any> => {
  const URL = `${serverUrl}/${path}`;

  const authenticationCookie = getAuthenticationCookie();
  const accessToken = authenticationCookie ? authenticationCookie.accessToken : null;
  
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
    // We have responses from server with 200 status and empty body
    // That is why we have a try/catch block here due to response.json() throwing an error in that case
    try{
      return await response.json();
    } catch(error) {
      return null;
    }
  }
};


/**
 * For doing a fetch request without Authorization
 * It will only work with the api endpoints that don't require the jwt token: login, account create, refresh tokens
 */
export const simpleFetch = async (path: string, requestType: RequestType, requestBody: object = null): Promise<any> => {
  const URL = `${serverUrl}/${path}`;

  const config: RequestInit =  buildRequestConfig(requestType);

  if (requestBody !== null) {
    config.body = JSON.stringify(requestBody);
  }

  const response: Response = await fetch(URL, config);
  
  if(response.ok) {
    return response.json();
  } else {
    throw response;
  }
}
