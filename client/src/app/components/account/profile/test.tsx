import * as React from "react";

import * as nock from 'nock';
import { serverUrl } from 'configuration';

import Profile from "./index";
import { UpdateAccountNotification } from "./types";
import { invalidPassword, invalidEmail, genericValidPassword, genericSessionState } from "../../../../tests/testUtils";
import { render, RenderResult, fireEvent, waitForElement } from "@testing-library/react";
import { SessionStateContext } from "services/session/state";

describe('Create Account component', () => {

  // Main container for the CreateAccount Component
  let container: RenderResult;

  // Input fields
  let newUsernameInput: HTMLElement;
  let changeUsernameButton: HTMLElement
  let newEmailInput: HTMLElement;
  let changeEmailButton: HTMLElement
  let newPasswordInput: HTMLElement;
  let changePasswordButton: HTMLElement;
  let passwordInput: HTMLElement;

  // Submit Button
  let submitButton: HTMLElement;

  // React testing library queries
  let getAllByRole: Function;
  let getByText: Function;
  let getByRole: Function;

  beforeEach(async () => {
    container = render(
      <SessionStateContext.Provider value={genericSessionState}>
        <Profile />
      </SessionStateContext.Provider>
    );

    getAllByRole = container.getAllByRole;
    getByText = container.getByText;
    getByRole = container.getByRole;

    changeUsernameButton = getAllByRole('button')[1];
    expect(changeUsernameButton).toBeTruthy();

    changeEmailButton = container.getAllByRole('button')[0];
    expect(changeEmailButton).toBeTruthy();

    changePasswordButton = container.getAllByRole('button')[2];
    expect(changePasswordButton).toBeTruthy();

  });

  afterEach(() => {
    container.unmount();
  });

  it('Shows short password notification for new password correctly', async (done) => {
    fireEvent.click(changePasswordButton);
    newPasswordInput = getByRole("textbox");
    expect(newPasswordInput).toBeTruthy();

    // Typing new value and clicking on Add button
    fireEvent.change(newPasswordInput, { target: { value: invalidPassword } });
    fireEvent.click(getByText('Add'));

    passwordInput = container.container.querySelector('.profile__update-box__password-input');
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitForElement(() => container.findByText(UpdateAccountNotification.shortPassword));
    done();
  });

  it('Shows invalid password notification for current password correctly with short password', async (done) => {
    fireEvent.click(changePasswordButton);
    newPasswordInput = getByRole("textbox");
    expect(newPasswordInput).toBeTruthy();

    // Typing new value and clicking on Add button
    fireEvent.change(newPasswordInput, { target: { value: genericValidPassword } });
    fireEvent.click(getByText('Add'));

    passwordInput = container.container.querySelector('.profile__update-box__password-input');
    fireEvent.change(passwordInput, { target: { value: invalidPassword } });
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitForElement(() => container.findByText(UpdateAccountNotification.incorrectCurrentPassword));
    done();

  });

  it('Shows invalid email notification correctly', async (done) => {
    fireEvent.click(changeEmailButton);
    newEmailInput = getByRole("textbox");
    expect(newEmailInput).toBeTruthy();

    // Typing new value and clicking on Add button
    fireEvent.change(newEmailInput, { target: { value: invalidEmail } });
    fireEvent.click(getByText('Add'));

    passwordInput = container.container.querySelector('.profile__update-box__password-input');
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitForElement(() => container.findByText(UpdateAccountNotification.invalidEmail));
    done();
  });

  it('Wrong current password', async (done) => {
    nock(serverUrl)
      .post('/api/user/edit')
      .reply(403);

    fireEvent.click(changePasswordButton);
    newPasswordInput = getByRole("textbox");
    expect(newPasswordInput).toBeTruthy();

    // Typing new value and clicking on Add button
    fireEvent.change(newPasswordInput, { target: { value: genericValidPassword } });
    fireEvent.click(getByText('Add'));

    passwordInput = container.container.querySelector('.profile__update-box__password-input');
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitForElement(() => container.findByText(UpdateAccountNotification.incorrectCurrentPassword));
    done();
  });

  it('Try to update to same email', async (done) => {
    fireEvent.click(changeEmailButton);
    newEmailInput = getByRole("textbox");
    expect(newEmailInput).toBeTruthy();

    // Typing new value and clicking on Add button
    fireEvent.change(newEmailInput, { target: { value: genericSessionState.accountInfo.email } });
    fireEvent.click(getByText('Add'));
    passwordInput = container.container.querySelector('.profile__update-box__password-input');
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitForElement(() => container.findByText(UpdateAccountNotification.sameEmail));
    done();
  });

  it('Try to update to same username', async (done) => {
    fireEvent.click(changeUsernameButton);
    newUsernameInput = getByRole("textbox");
    expect(newUsernameInput).toBeTruthy();

    // Typing new value and clicking on Add button
    fireEvent.change(newUsernameInput, { target: { value: genericSessionState.accountInfo.username } });
    fireEvent.click(getByText('Add'));
    passwordInput = container.container.querySelector('.profile__update-box__password-input');
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitForElement(() => container.findByText(UpdateAccountNotification.sameUsername));
    done();
  });

  it('Duplicate email or username', async (done) => {
    nock(serverUrl)
      .post('/api/user/edit')
      .reply(409);

    fireEvent.click(changeEmailButton);
    newEmailInput = getByRole("textbox");
    expect(newEmailInput).toBeTruthy();

    // Typing new value and clicking on Add button
    fireEvent.change(newEmailInput, { target: { value: 'new@test.com' } });
    fireEvent.click(getByText('Add'));
    passwordInput = container.container.querySelector('.profile__update-box__password-input');
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');
    fireEvent.click(submitButton);

    await waitForElement(() => container.findByText(UpdateAccountNotification.duplicatedKey));
    done();
  });


  it('Email update successfull', async (done) => {
    nock(serverUrl)
      .post('/api/user/edit')
      .reply(200);

    fireEvent.click(changeEmailButton);
    newEmailInput = getByRole("textbox");
    expect(newEmailInput).toBeTruthy();

    // Typing new value and clicking on Add button
    fireEvent.change(newEmailInput, { target: { value: 'new@test.com' } });
    fireEvent.click(getByText('Add'));
    passwordInput = container.container.querySelector('.profile__update-box__password-input');
    fireEvent.change(passwordInput, { target: { value: genericValidPassword } });
    expect(passwordInput).toBeTruthy();

    submitButton = getByText('Submit');

    // We need to simulate the rerender of the whole component now
    container.rerender(
      <SessionStateContext.Provider value={genericSessionState}>
        <Profile />
      </SessionStateContext.Provider>
    );

    await waitForElement(() => container.findByText('new@test.com'));
    done();
  })
})