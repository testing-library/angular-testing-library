import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { provideMock, Mock, createMock } from '@testing-library/angular/jest-utils';

import { ComponentWithProviderComponent, CounterService } from './05-component-provider';

test('renders the current value and can increment and decrement', async () => {
  await render(ComponentWithProviderComponent, {
    componentProviders: [
      {
        provide: CounterService,
        useValue: new CounterService(),
      },
    ],
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('0');

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl).toHaveTextContent('2');

  fireEvent.click(decrementControl);
  expect(valueControl).toHaveTextContent('1');
});

test('renders the current value and can increment and decrement with a mocked jest-utils service', async () => {
  const counter = createMock(CounterService);
  let fakeCounterValue = 50;
  counter.increment.mockImplementation(() => (fakeCounterValue += 10));
  counter.decrement.mockImplementation(() => (fakeCounterValue -= 10));
  counter.value.mockImplementation(() => fakeCounterValue);

  await render(ComponentWithProviderComponent, {
    componentProviders: [
      {
        provide: CounterService,
        useValue: counter,
      },
    ],
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('50');

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  expect(valueControl).toHaveTextContent('70');

  fireEvent.click(decrementControl);
  expect(valueControl).toHaveTextContent('60');
});

test('renders the current value and can increment and decrement with provideMocked from jest-utils', async () => {
  await render(ComponentWithProviderComponent, {
    componentProviders: [provideMock(CounterService)],
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });

  fireEvent.click(incrementControl);
  fireEvent.click(incrementControl);
  fireEvent.click(decrementControl);

  const counterService = TestBed.inject(CounterService) as Mock<CounterService>;
  expect(counterService.increment).toHaveBeenCalledTimes(2);
  expect(counterService.decrement).toHaveBeenCalledTimes(1);
});
