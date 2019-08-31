import { fireEvent } from '@testing-library/dom';
import { createType } from './type';
import { createSelectOptions } from './selectOptions';

export interface UserEvents {
  /**
   * @description
   * Types a value in an input field just like the user would do
   *
   * @argument
   * element: HTMLElement - the form field to type in
   * value: string - the value to type in
   *
   * @example
   * component.type(component.getByLabelText('Firstname'), 'Tim')
   * component.type(component.getByLabelText('Firstname'), 'Tim', { delay: 100 })
   * component.type(component.getByLabelText('Firstname'), 'Tim', { allAtOnce: true })
   */
  type: ReturnType<typeof createType>;

  /**
   * @description
   * Select an option(s) from a select just like the user would do
   *
   * @argument
   * element: HTMLElement - the select box to select an option in
   * matcher: Matcher | Matcher[] - the value(s) to select
   *
   * @example
   * component.selectOptions(component.getByLabelText('Fruit'), 'Blueberry')
   * component.selectOptions(component.getByLabelText('Fruit'), ['Blueberry'. 'Grape'])
   */
  selectOptions: ReturnType<typeof createSelectOptions>;
}

const type = createType(fireEvent);
const selectOptions = createSelectOptions(fireEvent);

export { createType, type, createSelectOptions, selectOptions };
