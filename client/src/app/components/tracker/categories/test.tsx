import * as React from "react";
import { render, wait, RenderResult, waitForElement, fireEvent, waitForElementToBeRemoved, waitForDomChange } from '@testing-library/react'

import * as nock from 'nock';
import { serverUrl } from 'configuration';

import Categories from './index';
import { Category } from "./types";
import { SessionStateContext } from "services/session/state";
import { CategoriesStateProvider } from "./state";
import { genericSessionState } from "../../../../tests/testUtils";
import { BrowserRouter as Router } from 'react-router-dom';
import { WithModal } from "components/common/modal";
import { AddCategoryNotification } from "./add-category/types";

describe("Categories Component", () => {
  const mockedUserCategories: Array<Category> = [{ id: "1", name: "Category1", description: "" }, { id: "2", name: "Category2", description: "" }]
  const allCategories: Array<Category> = [{ id: "1", name: "Category1", description: "" }, { id: "2", name: "Category2", description: "" }, { id: "3", name: "Category3", description: "" }];

  const CategoriesComponent = WithModal(CategoriesStateProvider(Categories));
  const TestComponent = (
    <Router>
      <SessionStateContext.Provider value={genericSessionState}>
        <CategoriesComponent />)
      </SessionStateContext.Provider>
    </Router>
  );

  let container: RenderResult;


  beforeEach(async () => {
    // Mocking fetch requests
    nock(serverUrl)
      .get(`/api/categories/${genericSessionState.accountInfo.id}`)
      .reply(200, mockedUserCategories);

    nock(serverUrl)
      .get('/api/categories')
      .reply(200, allCategories);

    nock(serverUrl)
      .post('/api/categories')
      .reply(200, mockedUserCategories);

    container = render(TestComponent);
  });

  afterEach(() => container.unmount());

  it('Shows correctly the user categories', async (done) => {
    // Wait for async code and DOM to get updated
    await waitForElement(() => container.findByText('Category1'));
    done();
  });

  it('Can add a category', async (done) => {
    // Wait for async code and DOM to get updated
    await waitForElement(() => container.findByText('Add a new element'));

    // Open add category modal
    const openButton = container.getByText('Add a new element');
    fireEvent.click(openButton);

    const modalInput = container.getByRole('textbox');
    expect(modalInput).toBeTruthy();

    // Add a correct category
    fireEvent.change(modalInput, { target: { value: 'Category3' } });

    // Options are rendered correctly
    container.rerender(TestComponent);
    await waitForElement(() => container.findByRole('option'));

    // Click on confirm button to initiate the request to add the category
    fireEvent.click(container.getByText('Confirm'));

    // We make sure that the components are fully updated
    await waitForDomChange(container);
    container.rerender(TestComponent);

    // The new category should be present on the list
    await waitForElement(() => container.findByText('Category3'));
    done();
  });

  it('Tries to add a non existing category', async (done) => {
    // Wait for async code and DOM to get updated
    await waitForElement(() => container.findByText('Add a new element'));

    // Open add category modal
    const openButton = container.getByText('Add a new element');
    fireEvent.click(openButton);

    const modalInput = container.getByRole('textbox');
    expect(modalInput).toBeTruthy();

    // Add a non existing category
    fireEvent.change(modalInput, { target: { value: 'Category5' } });

    // Rerender component to make sure that async process finished
    container.rerender(TestComponent);

    // Click on confirm button to initiate the request to add the category
    fireEvent.click(container.getByText('Confirm'));

    // We make sure that the components are fully updated
    await waitForElement(() => container.findByText(AddCategoryNotification.notFound));

    done();
  });

  it('Tries to add a category that is already on the user categories', async (done) => {
    // Wait for async code and DOM to get updated
    await waitForElement(() => container.findByText('Add a new element'));

    // Open add category modal
    const openButton = container.getByText('Add a new element');
    fireEvent.click(openButton);

    const modalInput = container.getByRole('textbox');
    expect(modalInput).toBeTruthy();

    // Add a non existing category
    fireEvent.change(modalInput, { target: { value: 'Category1' } });

    // Rerender component to make sure that async process finished
    container.rerender(TestComponent);

    // Click on confirm button to initiate the request to add the category
    fireEvent.click(container.getByText('Confirm'));

    // We make sure that the components are fully updated
    await waitForElement(() => container.findByText(AddCategoryNotification.repeated));

    done();
  });
});