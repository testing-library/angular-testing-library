import { render, screen, fireEvent } from '@testing-library/angular';

import { InputOutputComponent } from './02-input-output';

test('is possible to set input and listen for output', async () => {
  const sendValue = jest.fn();

  await render(InputOutputComponent, {
    componentProperties: {
      value: 47,
      sendValue: {
        emit: sendValue,
      } as any,
    },
  });

  const incrementControl = screen.getByText('Increment');
  const valueControl = screen.getByTestId('value');
  const sendControl = screen.getByText('Send');

  expect(valueControl.textContent).toBe('47');

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl.textContent).toBe('50');

  fireEvent.click(sendControl);
  expect(sendValue).toHaveBeenCalledTimes(1);
  expect(sendValue).toHaveBeenCalledWith(50);
});
