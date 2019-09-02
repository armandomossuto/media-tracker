import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import * as nock from 'nock';
import { serverUrl } from 'configuration';

import Categories from './index';
import { Category } from "./types";
import { SessionStateContext } from "services/session/state";
import { CategoriesStateProvider } from "./state";
import { genericSessionState } from "../../../../tests/testUtils";

describe("Categories Component", () => {
  let container: ReactWrapper;

  // Must call this function after testing something that will trigger an async operation
  const flushPromises = () => new Promise(setImmediate);

  const mockedUserCategories: Array<Category> = [{ id: "1", name: "Category1", description: "" }, { id: "2", name: "Category2", description: "" }]

  beforeEach( async () => {
    nock(serverUrl)
    .get(`/api/categories/${genericSessionState.accountInfo.id}`)
    .reply(200, mockedUserCategories);


    const CategoriesComponent = CategoriesStateProvider(Categories);

    container = mount(
        <SessionStateContext.Provider value={genericSessionState}>
          <CategoriesComponent />)
        </SessionStateContext.Provider>
      , )
      await flushPromises();
      container.update();

      const categories = container.find(Categories);
      expect(categories.exists()).toEqual(true);

      // Need to wait for 2 cycles to have the component fully updated after the async operations
      await flushPromises();
      container.update();
      await flushPromises();
      container.update();
  })

  it('Shows correctly the user categories', async (done) => {
    expect(container.find(".categories__list__element")).toHaveLength(2);
    done();
  });

})