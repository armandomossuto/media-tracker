import * as React from "react";
import { render, RenderResult, fireEvent } from '@testing-library/react'


import Dropdown from './index';



describe("Dropdown Component", () => {

  // Mocked data
  const options = ["option1", "option2", "option3"];
  let selectedOption = '';
  const buttonText = "Choose an option";
  const onSelect = jest.fn(option => selectedOption = option);
  let container: RenderResult;

  beforeEach(() => {
    // Test first render and effect
    container = render(
      <Dropdown options={options} buttonText={buttonText} onSelect={onSelect} />,
    );
  });

  afterEach(() => {
    container.unmount()
    selectedOption = '';
    onSelect.mockClear();
  });

  it('Can select an option', () => {
    // Open the dropdown
    fireEvent.click(container.getByText(buttonText));

    fireEvent.click(container.getByText("option1"));

    expect(onSelect.mock.calls.length).toBe(1);
    expect(selectedOption).toBe("option1");

    // The dropdown should be closed now
    expect(container.container.querySelector("dropdown__content__option")).toBeFalsy();
  });

  it('Can change an option after one has been selected', () => {
    // Open the dropdown
    fireEvent.click(container.getByText(buttonText));
    fireEvent.click(container.getByText("option1"));

    expect(onSelect.mock.calls.length).toBe(1);
    expect(selectedOption).toBe("option1");

    // The dropdown should be closed now
    expect(container.container.querySelector(".dropdown__content__option")).toBeFalsy();

    // Open agian the dropdown
    fireEvent.click(container.getByText(buttonText));
    container.debug();
    fireEvent.click(container.getByText("option3"));

    expect(onSelect.mock.calls.length).toBe(2);
    expect(selectedOption).toBe("option3");

    // The dropdown should be closed now
    expect(container.container.querySelector(".dropdown__content__option")).toBeFalsy();
  });


});

