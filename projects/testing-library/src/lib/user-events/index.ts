import { createType } from './type';
import { createSelectOptions } from './selectOptions';
import { tab } from './tab';

export interface UserEvents {
  /**
   * @deprecated
   * Use `userEvents.type` from @testing-library/user-event
   *
   * @description
   * Types a value in an input field with the same interactions as the user would do.
   *
   * @argument
   * element: HTMLElement - the form field to type in
   * value: string | number - the value to type in
   *
   * @example
   * component.type(component.getByLabelText('Firstname'), 'Tim')
   * component.type(component.getByLabelText('Firstname'), 'Tim', { delay: 100 })
   * component.type(component.getByLabelText('Firstname'), 'Tim', { allAtOnce: true })
   */
  type: ReturnType<typeof createType>;

  /**
   * @deprecated
   * Use `userEvents.selectOptions` from @testing-library/user-event
   *
   * @description
   * Select an option(s) from a select field with the same interactions as the user would do.
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

  /**
   * @deprecated
   * Use `userEvents.tab` from @testing-library/user-event
   *
   * @description
   * Fires a tab event changing the document.activeElement in the same way the browser does.
   *
   * @argument
   * shift: can be set to true to invert tab direction (default false)
   * focusTrap: a container element to restrict the tabbing within (default document)
   *
   * @example
   * component.tab()
   */
  tab: typeof tab;
}

export { createType, createSelectOptions, tab };
