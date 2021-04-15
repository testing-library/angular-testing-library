import { render, screen, fireEvent } from '@testing-library/angular';

import { NestedButtonComponent, NestedValueComponent, NestedContainerComponent } from './01-nested-component';

test('renders the current value and can increment and decrement', async () => {
  await render(NestedContainerComponent, {
    declarations: [NestedButtonComponent, NestedValueComponent],
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('0');

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl).toHaveTextContent('2');

  fireEvent.click(decrementControl);
  expect(valueControl).toHaveTextContent('1');
});
