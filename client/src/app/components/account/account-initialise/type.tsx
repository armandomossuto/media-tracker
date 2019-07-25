import { EnumLiteralsOf } from 'types';

export type AccountInitialiseStatus = EnumLiteralsOf<typeof AccountInitialiseStatus>

export const AccountInitialiseStatus = Object.freeze({
  logIn: 'logIn',
  create: 'create',
})

export type AccountInitialiseProps = {
  setAccountIntialiseStatus: React.Dispatch<React.SetStateAction<AccountInitialiseStatus>>
}