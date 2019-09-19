import { Cookies } from 'react-cookie';

// types
import { UserAccessToken } from 'services/session/types';

const cookies = new Cookies();

const accessTokenCookieName = 'media-tracker-access';

export const createAuthenticationCookie = (userAccessToken: UserAccessToken): void => {
  // For the expiration date, we will add one year to the current date
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const cookieOptions = {
    path: "/",
    expires: expirationDate,
  }

  cookies.set(accessTokenCookieName, userAccessToken, cookieOptions);
}

export const getAuthenticationCookie = (): UserAccessToken => cookies.get(accessTokenCookieName);
  