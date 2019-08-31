import { render } from '@testing-library/angular';

import { InputOutputComponent } from './02-input-output';

test('is possible to set input and listen for output', async () => {
  const sendValue = jest.fn();

  const component = await render(InputOutputComponent, {
    componentProperties: {
      value: 47,
      sendValue: {
        emit: sendValue,
      } as any,
    },
  });

  const incrementControl = component.getByText('Increment');
  const valueControl = component.getByTestId('value');
  const sendControl = component.getByText('Send');

  expect(valueControl.textContent).toBe('47');

  component.click(incrementControl);
  component.click(incrementControl);
  component.click(incrementControl);
  expect(valueControl.textContent).toBe('50');

  component.click(sendControl);
  expect(sendValue).toHaveBeenCalledTimes(1);
  expect(sendValue).toHaveBeenCalledWith(50);
});
