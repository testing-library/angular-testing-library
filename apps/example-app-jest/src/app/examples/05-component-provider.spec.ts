import { provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { provideMock, Mock, createMock } from '@testing-library/angular/jest-utils';
import userEvent from '@testing-library/user-event';

import { ComponentWithProviderComponent, CounterService } from './05-component-provider';

test('renders the current value and can increment and decrement', async () => {
  const user = userEvent.setup();

  await render(ComponentWithProviderComponent, {
    componentProviders: [
      {
        provide: CounterService,
        useValue: new CounterService(),
      },
    ],
    providers: [provideZoneChangeDetection()],
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

test('renders the current value and can increment and decrement with a mocked jest-utils service', async () => {
  const user = userEvent.setup();

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
    providers: [provideZoneChangeDetection()],
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });
  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('50');

  await user.click(incrementControl);
  await user.click(incrementControl);
  expect(valueControl).toHaveTextContent('70');

  await user.click(decrementControl);
  expect(valueControl).toHaveTextContent('60');
});

test('renders the current value and can increment and decrement with provideMocked from jest-utils', async () => {
  const user = userEvent.setup();

  await render(ComponentWithProviderComponent, {
    componentProviders: [provideMock(CounterService)],
    providers: [provideZoneChangeDetection()],
  });

  const incrementControl = screen.getByRole('button', { name: /increment/i });
  const decrementControl = screen.getByRole('button', { name: /decrement/i });

  await user.click(incrementControl);
  await user.click(incrementControl);
  await user.click(decrementControl);

  const counterService = TestBed.inject(CounterService) as Mock<CounterService>;
  expect(counterService.increment).toHaveBeenCalledTimes(2);
  expect(counterService.decrement).toHaveBeenCalledTimes(1);
});
