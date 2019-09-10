import * as React from "react";
import { render, fireEvent, wait, waitForDomChange } from '@testing-library/react'

import * as nock from 'nock';
import { serverUrl } from 'configuration';

import Items from './index';
import { UserItemView, ItemsStatus, ItemState, ItemsProps } from "./types";
import { Category } from "../categories/types";
import { SessionStateContext } from "services/session/state";
import { genericSessionState } from "../../../../tests/testUtils";


describe("Items Component", () => {

  const flushPromises = () => new Promise(setImmediate);

  // Mocked data
  const categoryId = '1';
  const userId = genericSessionState.accountInfo.id;
  const allCategories: Array<Category> = [{ id: "1", name: "Category1", description: "" }, { id: "2", name: "Category2", description: "" }, { id: "3", name: "Category3", description: "" }];
  const userItems: Array<UserItemView> = [{ id: "1", categoryId, rating: "5", state: ItemState.inProgress, name: "Item1", description: "" }, { id: "2", categoryId, rating: "3", state: ItemState.notSet, name: "Item2", description: "" }];
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

  it('Can render Items properly', async (done) => {

    // Mocking fetch requests
    nock(serverUrl)
      .get('/api/categories')
      .reply(200, allCategories);

    nock(serverUrl)
      .get(`/api/entries/${categoryId}/${userId}`)
      .reply(200, userItems);


    // Test first render and effect
    const { container, getByText } = render(
      <SessionStateContext.Provider value={genericSessionState}>
        <Items match={ItemsProps.match} />)
        </SessionStateContext.Provider>,
    );

    // Wait for async code and DOM to get updated
    await wait(() => expect(getByText('Item1')).toBeTruthy());
    expect(getByText('Item2')).toBeTruthy();
    done();
  });

});
