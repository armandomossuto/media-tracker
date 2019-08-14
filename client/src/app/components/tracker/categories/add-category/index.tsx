import * as React from 'react';
import { useEffect, useState } from 'react';

import { useSessionState, closeModal, setModalNotification, openModal } from 'state';
import { useCategoriesState } from '../state';
import { useModal } from 'components/common/modal';
import { fetchRequest } from 'utils/fetch';
import { Category, UserCategory } from '../types';
import { setCategories, addUserCategory } from '../actions';
import { ModalParams, ModalType } from 'types';
import { AddCategoryNotification } from './types';

/**
 * Manages the Add-button and the process of adding a new Category to the User
 */
const AddCategory = () => {
  const [{ userCategories, categories }, dispatch] = useCategoriesState();
  const [{ accountInfo }, sessionStateDispatch] = useSessionState();

  // We fetch the list of all categories available for showing them as options during the process
  useEffect(() => {
    if (categories.length === 0) {
      fetchRequest('api/categories', 'GET', sessionStateDispatch)
        .then((categories: Array<Category>) => dispatch(setCategories(categories)
        ));
    }
  }, [])

  /**
   * Searches which categories match with the value introduced by the user in the modal input field
   * @param value - current value of the input field
   * @returns a list of options for the modal input
   */
  const onSearchAction = (value: string) => {
    try {
      return categories.filter(category => category.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())).map(category => category.name);
    } catch (err) {
      // We just return empty options in case of error
      return [];
    }
  };

  // Use Modal control methods
  const [, modalDispatch] = useModal();

  /**
   * Action for when the user decides to add a new Categoru
   * @param categoryName 
   */
  const onConfirmAction = (categoryName: string) => {
    const category = categories.find(category => category.name == categoryName);

    // If the category doesn't exist, we display an error message
    if (category === undefined) {
      return modalDispatch(setModalNotification(AddCategoryNotification.notFound));
    }

    // If the category is already in the userCategories we indicate it to the user
    if (userCategories.filter(userCategory => userCategory.id === category.id).length > 0) {
      return modalDispatch(setModalNotification(AddCategoryNotification.repeated));
    }

    fetchRequest('api/categories', 'POST', sessionStateDispatch, new UserCategory(category, accountInfo))
      .then(() => {
        dispatch(addUserCategory(category));
        modalDispatch(closeModal());
      })
      .catch((error) => {
        switch(error.status) {
          case 409:
            modalDispatch(setModalNotification(AddCategoryNotification.repeated));
            break;

          case 404:
            modalDispatch(setModalNotification(AddCategoryNotification.notFound));
            break;

          default:
            modalDispatch(setModalNotification(AddCategoryNotification.error));
            break;
        }
      });
  }

  const modalParams: ModalParams = {
    type: ModalType.addValueInput,
    message: 'Add a new category to your tracker:',
    onSearchAction,
    onConfirmAction,
  }
  
  return(
    <span onClick={() => modalDispatch(openModal(modalParams))}>
      Add a new element
    </span>
  )
}

export default AddCategory;