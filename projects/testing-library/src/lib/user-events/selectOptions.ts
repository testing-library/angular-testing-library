import {
  FireFunction,
  FireObject,
  Matcher,
  getByText,
  SelectorMatcherOptions,
  queryByText,
} from '@testing-library/dom';

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

  function selectOption(select: HTMLSelectElement, index: number, matcher: Matcher, options?: SelectorMatcherOptions) {
    if (!select.multiple && index > 0) {
      return;
    }

    // fallback to document.body, because libraries as Angular Material will have their custom select component
    const option = (queryByText(select, matcher, options) ||
      getByText(document.body, matcher, options)) as HTMLOptionElement;

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
    matcher: Matcher | Matcher[],
    matcherOptions?: SelectorMatcherOptions,
  ) {
    const selectElement = element as HTMLSelectElement;
    Array.from(selectElement.selectedOptions).forEach(option => (option.selected = false));
    const focusedElement = document.activeElement;
    const wasAnotherElementFocused = focusedElement !== document.body && focusedElement !== selectElement;

    if (wasAnotherElementFocused) {
      fireEvent.mouseMove(focusedElement);
      fireEvent.mouseLeave(focusedElement);
    }

    clickElement(selectElement);

    const values = Array.isArray(matcher) ? matcher : [matcher];
    values.forEach((val, index) => selectOption(selectElement, index, val, matcherOptions));

    if (wasAnotherElementFocused) {
      fireEvent.blur(focusedElement);
    }
  };
}
