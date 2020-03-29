import { render, screen, fireEvent } from '@testing-library/angular';

import { NestedButtonComponent, NestedValueComponent, NestedContainerComponent } from './01-nested-component';

test('renders the current value and can increment and decrement', async () => {
  await render(NestedContainerComponent, {
    declarations: [NestedButtonComponent, NestedValueComponent],
  });

  const incrementControl = screen.getByText('Increment');
  const decrementControl = screen.getByText('Decrement');
  const valueControl = screen.getByTestId('value');

  expect(valueControl.textContent).toBe('0');

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl.textContent).toBe('2');

  fireEvent.click(decrementControl);
  expect(valueControl.textContent).toBe('1');
});
