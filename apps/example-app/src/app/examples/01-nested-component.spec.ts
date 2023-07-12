import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { NestedButtonComponent, NestedValueComponent, NestedContainerComponent } from './01-nested-component';

test('renders the current value and can increment and decrement', async () => {
  const user = userEvent.setup();
  await render(NestedContainerComponent, {
    declarations: [NestedButtonComponent, NestedValueComponent],
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
