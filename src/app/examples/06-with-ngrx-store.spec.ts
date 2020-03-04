import { render, screen } from '@testing-library/angular';
import { StoreModule } from '@ngrx/store';

import { WithNgRxStoreComponent, reducer } from './06-with-ngrx-store';

test('works with ngrx store', async () => {
  const { click } = await render(WithNgRxStoreComponent, {
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

  const incrementControl = screen.getByText('Increment');
  const decrementControl = screen.getByText('Decrement');
  const valueControl = screen.getByTestId('value');

  expect(valueControl.textContent).toBe('0');

  click(incrementControl);
  click(incrementControl);
  expect(valueControl.textContent).toBe('20');

  click(decrementControl);
  expect(valueControl.textContent).toBe('10');
});
