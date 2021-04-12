import { render, screen, fireEvent } from '@testing-library/angular';

import { SingleComponent } from './00-single-component';

test('renders the current value and can increment and decrement', async () => {
  await render(SingleComponent);

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl.textContent).toBe('0');

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl.textContent).toBe('2');

  fireEvent.click(decrementControl);
  expect(valueControl.textContent).toBe('1');
});
