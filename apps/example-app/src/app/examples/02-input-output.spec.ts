import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { InputOutputComponent } from './02-input-output';

test('is possible to set input and listen for output', async () => {
  const user = userEvent.setup();
  const sendValue = jest.fn();

  await render(InputOutputComponent, {
    inputs: {
      value: 47,
    },
    on: {
      sendValue,
    },
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const sendControl = screen.getByRole('button', { name: /send/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('47');

  await user.click(incrementControl);
  await user.click(incrementControl);
  await user.click(incrementControl);
  expect(valueControl).toHaveTextContent('50');

  await user.click(sendControl);
  expect(sendValue).toHaveBeenCalledTimes(1);
  expect(sendValue).toHaveBeenCalledWith(50);
});

test.skip('is possible to set input and listen for output with the template syntax', async () => {
  const user = userEvent.setup();
  const sendSpy = jest.fn();

  await render('<app-fixture [value]="47" (sendValue)="sendValue($event)" />', {
    imports: [InputOutputComponent],
    on: {
      sendValue: sendSpy,
    },
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const sendControl = screen.getByRole('button', { name: /send/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('47');

  await user.click(incrementControl);
  await user.click(incrementControl);
  await user.click(incrementControl);
  expect(valueControl).toHaveTextContent('50');

  await user.click(sendControl);
  expect(sendSpy).toHaveBeenCalledTimes(1);
  expect(sendSpy).toHaveBeenCalledWith(50);
});

test('is possible to set input and listen for output (deprecated)', async () => {
  const user = userEvent.setup();
  const sendValue = jest.fn();

  await render(InputOutputComponent, {
    inputs: {
      value: 47,
    },
    componentOutputs: {
      sendValue: {
        emit: sendValue,
      } as any,
    },
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const sendControl = screen.getByRole('button', { name: /send/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('47');

  await user.click(incrementControl);
  await user.click(incrementControl);
  await user.click(incrementControl);
  expect(valueControl).toHaveTextContent('50');

  await user.click(sendControl);
  expect(sendValue).toHaveBeenCalledTimes(1);
  expect(sendValue).toHaveBeenCalledWith(50);
});

test('is possible to set input and listen for output with the template syntax (deprecated)', async () => {
  const user = userEvent.setup();
  const sendSpy = jest.fn();

  await render('<app-fixture [value]="47" (sendValue)="sendValue($event)" />', {
    imports: [InputOutputComponent],
    componentProperties: {
      sendValue: sendSpy,
    },
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const sendControl = screen.getByRole('button', { name: /send/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('47');

  await user.click(incrementControl);
  await user.click(incrementControl);
  await user.click(incrementControl);
  expect(valueControl).toHaveTextContent('50');

  await user.click(sendControl);
  expect(sendSpy).toHaveBeenCalledTimes(1);
  expect(sendSpy).toHaveBeenCalledWith(50);
});
