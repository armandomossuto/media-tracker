import { EnumLiteralsOf } from 'types';

export type UserCreate = { 
    username: string,
    email: string,
    [password: string]: string
}

export type CreateAccountNotification = EnumLiteralsOf<typeof CreateAccountNotification>

export const CreateAccountNotification = Object.freeze({
    initial: '' as 'initial',
    shortPassword: 'The password introduced is invalid. Passwords must have at least 6 characters.' as 'shortPassword',
    invalidEmail: 'Please introduce a valid e-mail.' as 'invalidEmail',
    duplicatedKey: 'The username or email is already in use, please choose another one' as  'duplicatedKey',
    error: 'Something went wrong. Please try again.' as 'error'
})