import { EnumLiteralsOf, User } from "types";
import { UserAccessToken } from "services/session/types";

export type UserLogIn = {
  username: string;
  [password: string]: string;
}

export type UserLogInResponse = {
  userInformation: User;
  userToken: UserAccessToken;
}

export const LogInNotification = Object.freeze({
  initial: '' as 'initial',
  shortPassword: 'The password introduced is invalid. Passwords have at least 6 characters.' as 'shortPassword',
  noUsername: 'Please Introduce an Username' as 'noUsername',
  invalid: 'You used an invalid password or account.' as 'invalid',
  error: 'Something went wrong. Please try again.' as 'error'
})

export type LogInNotification = EnumLiteralsOf<typeof LogInNotification>