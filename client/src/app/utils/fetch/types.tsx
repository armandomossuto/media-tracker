import { EnumLiteralsOf } from 'types/index';

export type RequestType = EnumLiteralsOf<typeof RequestType>;

const RequestType = Object.freeze({
    GET: 'GET' as 'GET',
    POST: 'POST' as 'POST',
    DELETE: 'DELETE' as 'DELETE' 
})
