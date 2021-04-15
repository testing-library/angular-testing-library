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

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const sendControl = screen.getByRole('button', { name: /send/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('47');

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl).toHaveTextContent('50');

  fireEvent.click(sendControl);
  expect(sendValue).toHaveBeenCalledTimes(1);
  expect(sendValue).toHaveBeenCalledWith(50);
});

test('is possible to set input and listen for output with the template syntax', async () => {
  const sendSpy = jest.fn();

  await render(InputOutputComponent, {
    template: '<app-fixture [value]="47" (sendValue)="sendValue($event)" (clicked)="clicked()"></app-fixture>',
    componentProperties: {
      sendValue: sendSpy,
    },
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const sendControl = screen.getByRole('button', { name: /send/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('47');

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl).toHaveTextContent('50');

  fireEvent.click(sendControl);
  expect(sendSpy).toHaveBeenCalledTimes(1);
  expect(sendSpy).toHaveBeenCalledWith(50);
});
