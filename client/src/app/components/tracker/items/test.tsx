import * as React from "react";
import { render, RenderResult, fireEvent, waitForElement, wait } from '@testing-library/react'

import * as nock from 'nock';
import { serverUrl } from 'configuration';

import Items from './index';
import { UserItemView, ItemsProps } from "./types";
import { Category } from "../categories/types";
import { SessionStateContext } from "services/session/state";
import { genericSessionState } from "../../../../tests/testUtils";


describe("Items Component", () => {

  // Mocked data
  const categoryId = '1';
  const userId = genericSessionState.accountInfo.id;
  const allCategories: Array<Category> = [
    { id: "1", name: "Category1", description: "" },
    { id: "2", name: "Category2", description: "" },
    { id: "3", name: "Category3", description: "" }
  ];
  const userItems: Array<UserItemView> = [
    { id: "1", categoryId, rating: "5", state: "1", name: "Item1", description: "" },
    { id: "2", categoryId, rating: "3", state: "0", name: "Item2", description: "description2" }
  ];
  // Mocking the props for the component
  const ItemsProps: ItemsProps = {
    match: {
      params: {
        categoryName: 'Category1',
      },
      isExact: true,
      path: '',
      url: ''
    }
  }

  let container: RenderResult;

  beforeEach(async (done) => {
    // Mocking fetch requests
    nock(serverUrl)
      .get('/api/categories')
      .reply(200, allCategories);

    nock(serverUrl)
      .get(`/api/entries/${categoryId}/${userId}`)
      .reply(200, userItems);

    // Test first render and effect
    container = render(
      <SessionStateContext.Provider value={genericSessionState}>
        <Items match={ItemsProps.match} />)
      </SessionStateContext.Provider>,
    );

    // Wait for async code and DOM to get updated
    await waitForElement(() => container.getByText('Item1'));

    done();
  });

  afterEach(() => container.unmount());

  it('Can render Items properly', () => expect(container.queryByText('Item2')).toBeTruthy());

  it("Renders correctly the options matching the search term", async (done) => {
    const searchInput = container.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: 'Item' } });
    // Expects both items
    expect(container.queryByText('Item1')).toBeTruthy();
    expect(container.queryByText('Item2')).toBeTruthy();
    done();
  })

  it("Renders correctly the option matching the search term", async (done) => {
    const searchInput = container.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: 'em1' } });
    expect(container.queryByText('Item1')).toBeTruthy();
    expect(container.queryByText('Item2')).toBeFalsy();
    done();
  })

  it("Works when changing search type dropdown", async (done) => {
    // Click on dropdown button to open options
    fireEvent.click(container.getByText("Search by name"));
    fireEvent.click(container.getByText("description"));
    expect(container.queryByText('Item1')).toBeTruthy();
    expect(container.queryByText('Item2')).toBeTruthy();

    const searchInput = container.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: 'description2' } });
    expect(container.queryByText('Item1')).toBeFalsy();
    expect(container.queryByText('Item2')).toBeTruthy();
    done();
  })

  it("Renders item rating and updates it", async (done) => {
    nock(serverUrl)
      .post('/api/entries/update')
      .reply(200);

    // Calculate the total number of full starts that should be in the screen according to the items' rating
    const totalStars: number = userItems.map(item => item.rating).reduce((a, b) => Number(a) + Number(b), 0);
    expect(container.queryAllByText('★')).toHaveLength(totalStars);

    // We are clicking the 3rd star of the first item, changing its rating from 5 to 3. So we should have now totalStarts - 2 in total in the screen
    fireEvent.click(container.getAllByText('★')[2])
    await wait(() => expect(container.queryAllByText('★')).toHaveLength(totalStars - 2));
    done();
  })


  it("Renders item state and updates it", async (done) => {
    nock(serverUrl)
      .post('/api/entries/update')
      .reply(200);

    // Items number 2 has not set state at the beggining
    expect(container.queryByText('Not set')).toBeTruthy();

    // Let's open the options menu by clicking on the item state
    fireEvent.click(container.getByText('Not set'));

    // Dropdown menu with options is open
    expect(container.container.querySelector('.item-state__options')).toBeTruthy();

    // Click on Completed option to trigger a change of state to it
    fireEvent.click(container.getByText('Completed'));

    // Dropdown menu with options should be closed now
    expect(container.container.querySelector('.item-state__options')).toBeFalsy();

    await wait(() => expect(container.findAllByText('Completed')).toBeTruthy());
    done();
  })

  it("Sort items properly", () => {

    expect(container.getByText('Sort by name'));
    // By default items are sorted by name and in increasing order
    expect(container.container.querySelector('.items-element__name').textContent).toBe('Item1');

    // Click on the sort dropdown meny and change to rating option
    fireEvent.click(container.getByText('Sort by name'));
    fireEvent.click(container.getByText('rating'));

    // Tect of the button changed to current option
    expect(container.getByText('Sort by rating'));

    // Now Item2 is the first one becuase it has the lowest rating
    expect(container.container.querySelector('.items-element__name').textContent).toBe('Item2');

    // Change sorting order
    fireEvent.click(container.getByText('↓'));
    expect(container.container.querySelector('.items-element__name').textContent).toBe('Item1');
    expect(container.queryByText('↑')).toBeTruthy();
    expect(container.queryByText('↓')).toBeFalsy();
  })
});
