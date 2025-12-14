import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { StoreModule } from '@ngrx/store';
import userEvent from '@testing-library/user-event';

import { WithNgRxStoreComponent, reducer } from './06-with-ngrx-store';

test('works with ngrx store', async () => {
  const user = userEvent.setup();

  await render(WithNgRxStoreComponent, {
    imports: [
      StoreModule.forRoot(
        {
          value: reducer,
        },
        {
          runtimeChecks: {},
        },
      ),
    ],
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('0');

  await user.click(incrementControl);
  await user.click(incrementControl);
  expect(valueControl).toHaveTextContent('20');

  await user.click(decrementControl);
  expect(valueControl).toHaveTextContent('10');
});
