import * as React from "react";
import { render, wait } from '@testing-library/react'

import * as nock from 'nock';
import { serverUrl } from 'configuration';

import Categories from './index';
import { Category } from "./types";
import { SessionStateContext } from "services/session/state";
import { CategoriesStateProvider } from "./state";
import { genericSessionState } from "../../../../tests/testUtils";
import { BrowserRouter as Router } from 'react-router-dom';

describe("Categories Component", () => {
  const mockedUserCategories: Array<Category> = [{ id: "1", name: "Category1", description: "" }, { id: "2", name: "Category2", description: "" }]
  const allCategories: Array<Category> = [{ id: "1", name: "Category1", description: "" }, { id: "2", name: "Category2", description: "" }, { id: "3", name: "Category3", description: "" }];

  it('Shows correctly the user categories', async (done) => {

    // Mocking fetch requests
    nock(serverUrl)
    .get(`/api/categories/${genericSessionState.accountInfo.id}`)
    .reply(200, mockedUserCategories);

    nock(serverUrl)
    .get('/api/categories')
    .reply(200, allCategories);

    const CategoriesComponent = CategoriesStateProvider(Categories);

    const { getByText } = render(
      <Router>
        <SessionStateContext.Provider value={genericSessionState}>
          <CategoriesComponent />)
        </SessionStateContext.Provider>
      </Router>)

      // Wait for async code and DOM to get updated
      await wait(() => expect(getByText('Category1')).toBeTruthy());
      expect(getByText('Category2')).toBeTruthy();
      done();
  });

})