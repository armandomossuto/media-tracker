import { EnumLiteralsOf } from 'types/index';

const RequestType = Object.freeze({
  GET: 'GET' as 'GET',
  POST: 'POST' as 'POST',
  DELETE: 'DELETE' as 'DELETE'
})

export type RequestType = EnumLiteralsOf<typeof RequestType>;
