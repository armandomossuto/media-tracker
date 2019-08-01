import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import * as nock  from 'nock';
import { serverUrl } from 'configuration';

import CreateAccount from "./index";
import { CreateAccountNotification } from "./types";
import { simulateInputChange, invalidPassword, genericValidPassword, invalidEmail, noUsername, genericUsername, genericValidEmail } from "../../../../../tests/testUtils";

describe('Create Account component', () => {

  // Main container for the CreateAccount Component
  let container: ReactWrapper;

  // Input fields
  let usernameInput: ReactWrapper;
  let emailInput: ReactWrapper;
  let passwordInput: ReactWrapper;

  // Submit Button
  let submitButton: ReactWrapper;

  const createAccountNotificationSelector = '.create-account__notification';

  // Must call this function after testing something that will trigger an async operation
  const flushPromises = () => new Promise(setImmediate);

  beforeEach(() => {
    container = mount(<CreateAccount setAccountIntialiseStatus={() => { }} />);

    const textInputs = container.find('input[type="text"]');
    expect(textInputs.length).toEqual(2);

    usernameInput = textInputs.at(0);
    emailInput = textInputs.at(1);

    passwordInput = container.find('input[type="password"]');
    expect(passwordInput.length).toEqual(1);

    const initialNotification = container.find(createAccountNotificationSelector);
    expect(initialNotification.text()).toBe(CreateAccountNotification.initial);

    submitButton = container.find('.create-account__submit');

  });

  it('Shows no username notification correctly', async (done) => {

    simulateInputChange(usernameInput, noUsername);

    await flushPromises();
    container.update();

    submitButton.simulate('click');
    const invalidPasswordNotification = container.find(createAccountNotificationSelector);
    expect(invalidPasswordNotification.text()).toBe(CreateAccountNotification.noUsername);
    done();
  });
 
  it('Shows short password notification correctly', async (done) => {

    simulateInputChange(usernameInput, genericUsername);
    simulateInputChange(passwordInput, invalidPassword);
    simulateInputChange(emailInput, genericValidEmail);

    await flushPromises();
    container.update();

    submitButton.simulate('click');
    const invalidPasswordNotification = container.find(createAccountNotificationSelector);
    expect(invalidPasswordNotification.text()).toBe(CreateAccountNotification.shortPassword);
    done();
  });

  it('Shows invalid email notification correctly', async (done) => {

    simulateInputChange(usernameInput, genericUsername);
    simulateInputChange(passwordInput, genericValidPassword);
    simulateInputChange(emailInput, invalidEmail);

    submitButton.simulate('click');
    
    await flushPromises();
    container.update();

    const errorNotification = container.find(createAccountNotificationSelector);
    expect(errorNotification.text()).toBe(CreateAccountNotification.invalidEmail);
    done();
  })

  it('Account Creation succesfully', async (done) => {
    nock(serverUrl)
    .post('/api/user')
    .reply(200, {
      userInformation: {},
      userToken: {} 
    });

    simulateInputChange(usernameInput, genericUsername);
    simulateInputChange(passwordInput, genericValidPassword);
    simulateInputChange(emailInput, genericValidEmail);

    submitButton.simulate('click');
    
    await flushPromises();
    container.update();

    const noNotification = container.find(createAccountNotificationSelector);
    expect(noNotification.text()).toBe(CreateAccountNotification.initial);

    done();
  })
})