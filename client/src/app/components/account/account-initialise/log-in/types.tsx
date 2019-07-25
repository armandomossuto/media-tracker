import { EnumLiteralsOf } from "types";

export type UserLogIn = {
    username: string,
    [password: string]: string
}

export type LogInNotification = EnumLiteralsOf<typeof LogInNotification>

export const LogInNotification = Object.freeze({
    initial: '' as 'initial',
    shortPassword: 'The password introduced is invalid. Passwords have at least 6 characters.' as 'shortPassword',
    invalid: 'You used an invalid password or account.' as  'invalid',
    error: 'Something went wrong. Please try again.' as 'error'
})