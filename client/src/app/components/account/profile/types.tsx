import { User, EnumLiteralsOf } from "types";
import { UserCreate } from "../account-initialise/create/types";
import { validateEmail } from "utils/validations";


export interface UpdatedElements extends Partial<UserCreate> {
};

export interface UpdateUser {
  id: string,
  password: string,
  newUserInformation: UpdatedElements,
}

/**
 * We are using a class for generating an UpdateUser object. This way we have access to some handy validations in the internal methods
 */
export class UpdateUser implements UpdateUser {

  id: string;
  password: string;
  newUserInformation: UpdatedElements;

  constructor(id: string, password: string, newUserInformation: UpdatedElements) {
    this.id = id;
    this.password = password;
    this.newUserInformation = newUserInformation;
    this.validateNewEmail = this.validateNewEmail.bind(this);
    this.validateNewPassword = this.validateNewPassword.bind(this);
  }

  /**
   * Validates password if it exists in the new User Information
   */
  validateNewPassword() {
    return this.newUserInformation.password == undefined || this.newUserInformation.password.length > 5;
  }

  /**
   * Validates email if it exists in the new User Information
   */
  validateNewEmail() {
    return this.newUserInformation.email == undefined || validateEmail(this.newUserInformation.email);
  }
}

export type UpdateAccountNotification = EnumLiteralsOf<typeof UpdateAccountNotification>

export const UpdateAccountNotification = Object.freeze({
  initial: '' as 'initial',
  shortPassword: 'The password introduced is invalid. Passwords must have at least 6 characters' as 'shortPassword',
  error: 'Something went wrong. Please try again' as 'error',
  invalidEmail: 'Please introduce a valid e-mail' as 'invalidEmail',
  insertPassword: 'If you want to proceed with the changes, please insert your current password' as 'insertPassword',
  incorrectCurrentPassword: 'The current password you introduced is wrong',
  duplicatedKey: 'The username or email is already in use, please choose another one' as 'duplicatedKey',
  successful: 'Your account was updated successfully' as 'successful',
  sameEmail: 'You are trying to update your email to the one that you are currently using',
  sameUsername: 'You are trying to update your username to the one that you are currently using'
})

/**
 * UserView is the same as the User type, minus the id, that we don't whow to the user
 */
export interface UserView extends Partial<User> {
  id?: never;
}

// For having a handy constructor for generating a UserView from a User object
export class UserView implements UserView {
  constructor(user: User) {
    this.email = user.email;
    this.username = user.username;
    this.creationDate = user.creationDate;
    this.modificationDate = user.modificationDate;
  }
}

export type ChangeEnum<UserView> = {
  [Key in keyof UserView]: boolean
};

/**
 * Enum to check with properties of UserView we are allowed to change
 */
export const changeEnum: ChangeEnum<UserView> = Object.freeze({
  username: true,
  email: true,
  creationDate: false,
  modificationDate: false
})

export type ElementChangeStatus = EnumLiteralsOf<typeof ElementChangeStatus>

export const ElementChangeStatus = Object.freeze({
  change: 'change',
  confirm: 'confirm'
})

export type ProfileElementsProps = {
  accountInfoView: UserView,
  updatedElements: UpdatedElements,
  onElementsChange: Function
}

export type ElementsNamesEnum<UserView> = {
  [Key in keyof UserView]: string
} 

/**
 * Enum for having a name that we are going to use in the UI for each corresponding UserView property
 */
export const ElementsNamesEnum: ElementsNamesEnum<UserView> = Object.freeze({
  username: 'Username',
  email: 'Email Address',
  creationDate: 'Date of the creation of the account',
  modificationDate: 'Last date this account settings were modified'
})

export type UpdateBoxProps = {
  notification: UpdateAccountNotification,
  onSubmitUpdateAccount: Function
  currentPassword: string,
  setCurrentPassword: React.Dispatch<React.SetStateAction<string>>
}