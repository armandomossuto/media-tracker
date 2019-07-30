import { createAuthenticationCookie, getAuthenticationCookie } from './index';
import { UserAccessToken } from 'types';

it('Creates authentication cookie and retrieves it', () => {
  const userAccessTokenDummy: UserAccessToken = {
    accessToken: 'dummyValue',
    userId: '123456'
  } 
  createAuthenticationCookie(userAccessTokenDummy);
  expect(getAuthenticationCookie()).toEqual(userAccessTokenDummy);
});
