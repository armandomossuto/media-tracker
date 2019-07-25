import { SessionState, SessionStatus } from './types';

export const initialState: SessionState = {
  accountInfo: null,
  status: SessionStatus.notInitialised,
}
