import { EnumLiteralsOf  } from 'types';

export type AddCategoryNotification = EnumLiteralsOf<typeof AddCategoryNotification>

export const AddCategoryNotification = Object.freeze({
  initial: '' as 'initial',
  notFound: 'The selected category does not exist in our database.' as 'notFound', 
  repeated: 'You already have this category added in your tracler.' as 'repeated',
  error: 'Something went wrong with your request. Please try again.' as 'error'
})
