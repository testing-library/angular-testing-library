import { render } from '@testing-library/angular';
import { StoreModule } from '@ngrx/store';

import { WithNgRxStoreComponent, reducer } from './06-with-ngrx-store';

test('works with ngrx store', async () => {
  const component = await render(WithNgRxStoreComponent, {
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

  const incrementControl = component.getByText('Increment');
  const decrementControl = component.getByText('Decrement');
  const valueControl = component.getByTestId('value');

  expect(valueControl.textContent).toBe('0');

  component.click(incrementControl);
  component.click(incrementControl);
  expect(valueControl.textContent).toBe('20');

  component.click(decrementControl);
  expect(valueControl.textContent).toBe('10');
});
