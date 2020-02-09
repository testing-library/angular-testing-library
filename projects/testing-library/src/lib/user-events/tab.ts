import userEvent from '@testing-library/user-event';

export interface ITabUserOptions {
  shift?: boolean;
  focusTrap?: Document | Element;
}

export function tab(options?: ITabUserOptions) {
  return userEvent.tab(options);
}
