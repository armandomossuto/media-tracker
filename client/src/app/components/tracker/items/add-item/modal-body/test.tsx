import * as React from "react";

import * as nock from 'nock';
import { serverUrl } from 'configuration';

import AddItemModal from './index';

import { genericSessionState } from "../../../../../../tests/testUtils";
import { AddItemModalProps, ItemSearchView } from "../types";
import { RenderResult, render, waitForElement, fireEvent } from "@testing-library/react";
import { SessionStateContext } from "services/session/state";
import { UserItemView } from "../../types";
import { AddItemNotification } from "./item-result/types";


describe("Items Component", () => {

  // Mocked data
  const categoryId = '1';
  const results: Array<ItemSearchView> = [ 
    { externalId: "123", title: "Result1", description: "", genres: [], imageUrl: "", originalLanguage: "", releaseDate: "" },
    { externalId: "321", title: "Result2", description: "", genres: [], imageUrl: "", originalLanguage: "", releaseDate: "" },
  ];

  // For checking if an item was added properly
  let addedItem: UserItemView;
  const addItem = jest.fn((userItemView: UserItemView) => addedItem = userItemView);

  // Mocking the props for the component
  const AddItemModalProps: AddItemModalProps = {
    categoryId,
    addItem,
  }

  let container: RenderResult;

  beforeEach(() => {
    // Test first render and effect
    container = render(
      <SessionStateContext.Provider value={genericSessionState}>
        <AddItemModal categoryId={AddItemModalProps.categoryId} addItem={AddItemModalProps.addItem}/>)
      </SessionStateContext.Provider>,
    );
  });

  afterEach(() => {
    container.unmount();
    addItem.mockClear();
  });

  it("Searches for results correctly", async (done) => {
    // Mocking server response for search results
    nock(serverUrl)
      .post('/api/entries/search')
      .reply(200, results);
    
    // We write a term to search in the search input
    const searchInput = container.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: 'Placeholder' } });

    // Wait until the results are rendered and check that we have all of them
    await waitForElement(() => container.getByText('Result1'));
    expect(container.queryByText('Result1')).toBeTruthy();
    done();
  });


  it("Adds an item that wasn't in the DB", async (done) => {
    // Mocking server response for search results
    nock(serverUrl)
      .post('/api/entries/search')
      .reply(200, results);

    // Server response for adding a new item
    const newItemId = "50";
    nock(serverUrl)
      .post('/api/entries/add/new')
      .reply(200, newItemId);
    
    // We write a term to search in the search input
    const searchInput = container.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Placeholder' } });

    // Wait until the results get rendered
    await waitForElement(() => container.getByText('Result1'));

    // We click on the add button of the first result
    const addResultButtons = container.getAllByText('+');
    fireEvent.click(addResultButtons[0]);

    // Wait until the item has been added properly
    await waitForElement(() => container.getByText('✓'));

    // Check that addItem was called once and the value of the new userItemView
    expect(addItem.mock.calls.length).toBe(1);
    expect(addedItem.title).toEqual(results[0].title);
    expect(addedItem.id.toString()).toEqual(newItemId);
    done();
  });

  it("Adds an item that was already in the DB", async (done) => {
    const results: Array<ItemSearchView> = [ 
      { itemId: "20",  externalId: "123", title: "Result1", description: "", genres: [], imageUrl: "", originalLanguage: "", releaseDate: "" },
      { itemId: "21", externalId: "321", title: "Result2", description: "", genres: [], imageUrl: "", originalLanguage: "", releaseDate: "" },
    ];

    // Mocking server response for search results
    nock(serverUrl)
      .post('/api/entries/search')
      .reply(200, results);

    // Server response for adding an user item
    nock(serverUrl)
      .post('/api/entries/add')
      .reply(200);
    
    // We write a term to search in the search input
    const searchInput = container.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Placeholder' } });

    // Wait until the results get rendered
    await waitForElement(() => container.getByText('Result1'));

    // We click on the add button of the second result
    const addResultButtons = container.getAllByText('+');
    fireEvent.click(addResultButtons[1]);

    // Wait until the item has been added properly
    await waitForElement(() => container.getByText('✓'));

    // Check that addItem was called once and the value of the new userItemView
    expect(addItem.mock.calls.length).toBe(1);
    expect(addedItem.title).toEqual(results[1].title);
    expect(addedItem.id.toString()).toEqual(results[1].itemId);
    done();
  });

  it("Fails to add an item", async (done) => {
    const results: Array<ItemSearchView> = [ 
      { itemId: "20",  externalId: "123", title: "Result1", description: "", genres: [], imageUrl: "", originalLanguage: "", releaseDate: "" },
      { itemId: "21", externalId: "321", title: "Result2", description: "", genres: [], imageUrl: "", originalLanguage: "", releaseDate: "" },
    ];

    // Mocking server response for search results
    nock(serverUrl)
      .post('/api/entries/search')
      .reply(200, results);

    // Server response for adding an user item
    nock(serverUrl)
      .post('/api/entries/add')
      .reply(500);
    
    // We write a term to search in the search input
    const searchInput = container.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Placeholder' } });

    // Wait until the results get rendered
    await waitForElement(() => container.getByText('Result1'));

    // We click on the add button of the second result
    const addResultButtons = container.getAllByText('+');
    fireEvent.click(addResultButtons[1]);

    // Wait until the error notification showed correctly
    await waitForElement(() => container.getByText(AddItemNotification.error));

    // Add item shouldn't have been called and the result status should be the same
    expect(addItem.mock.calls.length).toBe(0);
    expect(container.getAllByText('+')).toHaveLength(2);
    done();
  });
});
