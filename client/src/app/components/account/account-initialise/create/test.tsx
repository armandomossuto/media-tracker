import * as React from "react";
import { render, wait, fireEvent, RenderResult } from '@testing-library/react';

import * as nock from 'nock';
import { serverUrl } from 'configuration';

import CreateAccount from "./index";
import { CreateAccountNotification } from "./types";
import { invalidPassword, genericValidPassword, invalidEmail, noUsername, genericUsername, genericValidEmail } from "../../../../../tests/testUtils";

describe('Create Account component', () => {

  // Main container for the CreateAccount Component
  let container: RenderResult;

  // Input fields
  let usernameInput: HTMLElement;
  let emailInput: HTMLElement;
  let passwordInput: HTMLElement;

  // Submit Button
  let submitButton: HTMLElement;

  // React testing queries
  let getByText: Function;
  let getAllByRole: Function;

  beforeEach(() => {
    container = render(<CreateAccount setAccountIntialiseStatus={(): void => { }} />);
    getByText = container.getByText;
    getAllByRole = container.getAllByRole;

    usernameInput = getAllByRole('textbox')[0];
    expect(usernameInput).toBeTruthy();

    emailInput = getAllByRole('textbox')[1];
    expect(emailInput).toBeTruthy();

    passwordInput = getAllByRole('textbox')[2];
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Create Account');
  });

  afterEach(() => {
    container.unmount();
  });

  it('Shows no username notification correctly', async (done) => {
    fireEvent.change(usernameInput, { target: { value: noUsername } });
    fireEvent.click(submitButton);

    await wait(expect(getByText(CreateAccountNotification.noUsername)).toBeTruthy());
    done();
  });

  it('Shows short password notification correctly', async (done) => {
    fireEvent.change(usernameInput, { target: { value: genericUsername } });
    fireEvent.change(passwordInput, { target: { value: invalidPassword } });
    fireEvent.click(submitButton);

    await wait(expect(getByText(CreateAccountNotification.shortPassword)).toBeTruthy());
    done();
  });

  it('Shows invalid email notification correctly', async (done) => {

    fireEvent.change(usernameInput, { target: { value: genericUsername } });
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    fireEvent.change(emailInput, { target: { value: invalidEmail } });
    fireEvent.click(submitButton);

    await wait(expect(getByText(CreateAccountNotification.invalidEmail)).toBeTruthy());
    done();
  })

  it('Account Creation succesfully', async (done) => {
    nock(serverUrl)
      .post('/api/user')
      .reply(200, {
        userInformation: {},
        userToken: {}
      });

    fireEvent.change(usernameInput, { target: { value: genericUsername } });
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    fireEvent.change(emailInput, { target: { value: genericValidEmail } });
    fireEvent.click(submitButton);

    await wait(() => {
      const errorNotification = container.container.querySelector('.create-account__notification');
      return expect(errorNotification.textContent).toBe(CreateAccountNotification.initial);
    })
    done();
  })
})