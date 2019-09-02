import { CommonWrapper } from "enzyme";
import { SessionState, SessionStatus } from "types";

export const simulateInputChange = (container: CommonWrapper, value: string) => container.simulate('change', {
  target: {
    value: value
  }
});

export const genericValidEmail = 'test@test.com';

export const invalidEmail = 'invalidEmail';

export const genericValidPassword = '123456';

export const invalidPassword = '123';

export const noUsername = '';

export const genericUsername = 'testUser';

export const genericSessionState: SessionState = { 
  status: SessionStatus.ok, 
  accountInfo: {
    id: "1", 
    username: genericUsername, 
    email: genericValidEmail, 
    creationDate: new Date(), 
    modificationDate: new Date() 
  }
};
