import * as React from "react";
import { render, wait, fireEvent, RenderResult, waitForElement } from '@testing-library/react';

import * as nock  from 'nock';
import { serverUrl } from 'configuration';

import LogIn from "./index";
import { LogInNotification } from "./types";
import { genericUsername, genericValidPassword, invalidPassword, noUsername } from "../../../../../tests/testUtils";

describe('Log In Account component', () => {

  // Elements to be reused and query functions
  let usernameInput: HTMLElement;
  let passwordInput: HTMLElement;
  let submitButton: HTMLElement;
  let container: RenderResult;
  let getByText: Function; 
  let getAllByRole: Function;
  let findByText: Function;

  beforeEach(() => {
    container = render(<LogIn setAccountIntialiseStatus={() => { }} />);
    getByText = container.getByText;
    getAllByRole = container.getAllByRole;
    findByText = container.findByText;

    usernameInput = getAllByRole('textbox')[0];
    expect(usernameInput).toBeTruthy();

    passwordInput = getAllByRole('textbox')[1];
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');
  });

  afterEach(() => {
    container.unmount();
  });
 
  it('Shows no username notification correctly', async (done) => {
    fireEvent.change(usernameInput, { target: { value: noUsername } });
    fireEvent.click(submitButton);

    await wait(expect(getByText(LogInNotification.noUsername)).toBeTruthy());
    done();
  });

  it('Shows short password notification correctly', async (done) => {
    fireEvent.change(usernameInput, { target: { value: genericUsername } });
    fireEvent.change(passwordInput, { target: { value: invalidPassword } });
    fireEvent.click(submitButton);

    await wait(expect(getByText(LogInNotification.shortPassword)).toBeTruthy());
    done();
  });


  it('Invalid credentials when trying to logIn', async (done) => {
    // Mocking fetch request to fail with code 401
    nock(serverUrl)
      .post('/api/user/login')
      .reply(401);
  
    fireEvent.change(usernameInput, { target: { value: genericUsername } });
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    fireEvent.click(submitButton);

    await waitForElement(() => findByText(LogInNotification.invalid));
    done();
  })

  it('Account logIn succesfully', async (done) => {
    // Mocking fetch request to be successfull
    nock(serverUrl)
    .post('/api/user/login')
    .reply(200, {
      userInformation: {},
      userToken: {} 
    });

    fireEvent.change(usernameInput, { target: { value: genericUsername } });
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    fireEvent.click(submitButton);

    await wait(() => {
      const errorNotification = container.container.querySelector('.log-in__notification');
      return expect(errorNotification.textContent).toBe(LogInNotification.initial);
    })

    done();
  })
});