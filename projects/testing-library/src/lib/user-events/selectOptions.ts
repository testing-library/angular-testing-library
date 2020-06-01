import { FireFunction, FireObject, Matcher, screen, ByRoleOptions } from '@testing-library/dom';

// implementation from https://github.com/testing-library/user-event
export function createSelectOptions(fireEvent: FireFunction & FireObject) {
  function clickElement(element: HTMLElement) {
    fireEvent.mouseOver(element);
    fireEvent.mouseMove(element);
    fireEvent.mouseDown(element);
    fireEvent.focus(element);
    fireEvent.mouseUp(element);
    fireEvent.click(element);
  }

  function selectOption(select: HTMLSelectElement, index: number, options: Matcher | ByRoleOptions) {
    const query =
      typeof options === 'string'
        ? (({ name: new RegExp(options, 'i') } as unknown) as ByRoleOptions)
        : options instanceof RegExp
        ? (({ name: options } as unknown) as ByRoleOptions)
        : typeof options === 'function'
        ? (({ name: options } as unknown) as ByRoleOptions)
        : options;
    const option = screen.getByRole('option', query) as HTMLOptionElement;

    fireEvent.mouseOver(option);
    fireEvent.mouseMove(option);
    fireEvent.mouseDown(option);
    fireEvent.focus(option);
    fireEvent.mouseUp(option);
    fireEvent.click(option, { ctrlKey: index > 0 });

    option.selected = true;
    fireEvent.change(select);
  }

  return async function selectOptions(
    element: HTMLElement,
    options: Matcher | ByRoleOptions | ((Matcher | ByRoleOptions)[]),
  ) {
    const selectElement = element as HTMLSelectElement;

    if (selectElement.selectedOptions) {
      Array.from(selectElement.selectedOptions).forEach(option => (option.selected = false));
    }

    const focusedElement = document.activeElement;
    const wasAnotherElementFocused = focusedElement !== document.body && focusedElement !== selectElement;

    if (wasAnotherElementFocused) {
      fireEvent.mouseMove(focusedElement);
      fireEvent.mouseLeave(focusedElement);
    }

    clickElement(selectElement);

    const values = Array.isArray(options) ? options : [options];
    values
      .filter((_, index) => index === 0 || selectElement.multiple)
      .forEach((val, index) => selectOption(selectElement, index, val));

    if (wasAnotherElementFocused) {
      fireEvent.blur(focusedElement);
    }
  };
}
