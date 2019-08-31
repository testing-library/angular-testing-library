import { render } from '@testing-library/angular';

import { NestedButtonComponent, NestedValueComponent, NestedContainerComponent } from './01-nested-component';

test('renders the current value and can increment and decrement', async () => {
  const component = await render(NestedContainerComponent, {
    declarations: [NestedButtonComponent, NestedValueComponent],
  });

  const incrementControl = component.getByText('Increment');
  const decrementControl = component.getByText('Decrement');
  const valueControl = component.getByTestId('value');

  expect(valueControl.textContent).toBe('0');

  component.click(incrementControl);
  component.click(incrementControl);
  expect(valueControl.textContent).toBe('2');

  component.click(decrementControl);
  expect(valueControl.textContent).toBe('1');
});
