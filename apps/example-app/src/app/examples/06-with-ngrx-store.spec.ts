import { render, screen, fireEvent } from '@testing-library/angular';
import { StoreModule } from '@ngrx/store';

import { WithNgRxStoreComponent, reducer } from './06-with-ngrx-store';

test('works with ngrx store', async () => {
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

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl).toHaveTextContent('20');

  fireEvent.click(decrementControl);
  expect(valueControl).toHaveTextContent('10');
});
