import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from 'react-dom/test-utils';
import * as nock  from 'nock';
import { serverUrl } from 'configuration'

import LogIn from "./index";
import { LogInNotification } from "./types";

describe('Log In Account component', () => {

  let container: ReactWrapper;
  let usernameInput: ReactWrapper;
  let passwordInput: ReactWrapper;
  let submitButton: ReactWrapper;

  // Must call this function after testing something that will trigger an async operation
  const flushPromises = () => new Promise(setImmediate);

  beforeEach(() => {
    container = mount(<LogIn setAccountIntialiseStatus={() => { }} />);

    usernameInput = container.find('input[type="text"]');
    expect(usernameInput.length).toEqual(1);

    passwordInput = container.find('input[type="password"]');
    expect(passwordInput.length).toEqual(1);

    submitButton = container.find('.log-in__submit');

  });
 
  it('Shows short password notification correctly', async (done) => {

    const initialNotification = container.find('div[className="log-in__notification"]');
    expect(initialNotification.text()).toBe(LogInNotification.initial);

    usernameInput.simulate('change', {
      target: {
        value: 'testUser'
      }
    });

    passwordInput.simulate('change', {
      target: {
        value: '1234'
      }
    });

    await flushPromises();
    container.update();

    submitButton.simulate('click');
    const invalidPasswordNotification = container.find('div[className="log-in__notification"]');
    expect(invalidPasswordNotification.text()).toBe(LogInNotification.shortPassword);
    done();
  });

  it('Invalid credentials when trying to logIn', async (done) => {

    nock(serverUrl)
      .post('/api/user/login')
      .reply(401);
  

    passwordInput.simulate('change', {
      target: {
        value: '1234567'
      }
    });

    submitButton.simulate('click');
    
    await flushPromises();
    container.update();

    const errorNotification = container.find('div[className="log-in__notification"]');
    expect(errorNotification.text()).toBe(LogInNotification.invalid);
    done();
  })

  it('Account logIn succesfully', async (done) => {
    nock(serverUrl)
    .post('/api/user/login')
    .reply(200, {
      userInformation: {},
      userToken: {} 
    });

    passwordInput.simulate('change', {
      target: {
        value: '1234567'
      }
    });

    submitButton.simulate('click');
    
    await flushPromises();
    container.update();

    const errorNotification = container.find('div[className="log-in__notification"]');
    expect(errorNotification.text()).toBe(LogInNotification.initial);

    done();
  })
})