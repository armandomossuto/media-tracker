import { Cookies } from 'react-cookie';

// types
import { UserToken } from 'services/session/types';

const cookies = new Cookies();

export const createAuthenticationCookie = (userToken: UserToken) => {
  // For the expiration date, we will add one year to the current date
  var expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const cookieOptions = {
    path: "/",
    expires: expirationDate,
    secure: true,
    httpOnly: true,
  }

  cookies.set('media-tracker-authentication', userToken, cookieOptions);
}

export const getAuthenticationCookie = () => {
  const tokens: UserToken = cookies.get('media-tracker-authentication');
  return  tokens;
}
  