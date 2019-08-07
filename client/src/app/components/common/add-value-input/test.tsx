import * as React from "react";
import { mount, ReactWrapper } from "enzyme";

import AddValueInput from "./index";
import { simulateInputChange } from "../../../../tests/testUtils";

describe('Common Add Value Input component', () => {

  let container: ReactWrapper;
  let input: ReactWrapper;
  let showButton: ReactWrapper;
  let addButton: ReactWrapper;
  let cancelButton: ReactWrapper;

  // Must call this function after testing something that will trigger an async operation
  const flushPromises = () => new Promise(setImmediate);

  let mockedValue: string = '';
  const mockedOnAddValue = (value: string) =>  mockedValue = value;

  const updateWrappers = () => {
    input = container.find('input[type="text"]');
    showButton = container.find('.add-value-input__show-button');
    addButton = container.find('.add-value-input__button').at(0);
    cancelButton = container.find('.add-value-input__button').at(1);
  }

  beforeEach(() => {
    container = mount(<AddValueInput onAddValue={mockedOnAddValue} showButton={true} />);
    mockedValue = '';
    updateWrappers();
  });
 
  it('Show button should be displayed or hidden properly', async (done) => {

    expect(showButton.length).toEqual(1);
    expect(addButton.exists()).toEqual(false);
    expect(cancelButton.exists()).toEqual(false);

    showButton.simulate('click');

    await flushPromises();
    container.update();
    updateWrappers();
    expect(showButton.length).toEqual(0);
    expect(addButton.exists()).toEqual(true);
    expect(cancelButton.exists()).toEqual(true);
    done();
  });

  it('Input Add button should add the value properly', async (done) => {
   
    showButton.simulate('click');
    await flushPromises();
    container.update();
    updateWrappers();

    const value = 'value';
    simulateInputChange(input, value);
    addButton.simulate('click');
    expect(mockedValue).toBe(value);
    done();
  });

  it('Input Add cancel button works properly properly', async (done) => {
   
    showButton.simulate('click');
    await flushPromises();
    container.update();
    updateWrappers();

    const value = 'value1';
    simulateInputChange(input, value);
    cancelButton.simulate('click');

    await flushPromises();
    container.update();
    updateWrappers();

    expect(showButton.exists()).toEqual(true);
    expect(addButton.exists()).toEqual(false);
    expect(cancelButton.exists()).toEqual(false);
    expect(mockedValue).toBe('');
    done();
  });

})