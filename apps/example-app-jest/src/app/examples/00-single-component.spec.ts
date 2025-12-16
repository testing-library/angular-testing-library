import { provideZoneChangeDetection } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { SingleComponent } from './00-single-component';

test('renders the current value and can increment and decrement', async () => {
  const user = userEvent.setup();
  await render(SingleComponent, {
    providers: [provideZoneChangeDetection()],
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('0');

  await user.click(incrementControl);
  await user.click(incrementControl);
  expect(valueControl).toHaveTextContent('2');

  await user.click(decrementControl);
  expect(valueControl).toHaveTextContent('1');
});
