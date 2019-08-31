import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
import { provideMock, Mock, createMock } from '@testing-library/angular/jest-utils';

import { ComponentWithProviderComponent, CounterService } from './05-component-provider';

test('renders the current value and can increment and decrement', async () => {
  const component = await render(ComponentWithProviderComponent, {
    componentProviders: [
      {
        provide: CounterService,
        useValue: new CounterService(),
      },
    ],
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

test('renders the current value and can increment and decrement with a mocked jest-utils service', async () => {
  const counter = createMock(CounterService);
  let fakeCounterValue = 50;
  counter.increment.mockImplementation(() => (fakeCounterValue += 10));
  counter.decrement.mockImplementation(() => (fakeCounterValue -= 10));
  counter.value.mockImplementation(() => fakeCounterValue);

  const component = await render(ComponentWithProviderComponent, {
    componentProviders: [
      {
        provide: CounterService,
        useValue: counter,
      },
    ],
  });

  const incrementControl = component.getByText('Increment');
  const decrementControl = component.getByText('Decrement');
  const valueControl = component.getByTestId('value');

  expect(valueControl.textContent).toBe('50');

  component.click(incrementControl);
  component.click(incrementControl);
  expect(valueControl.textContent).toBe('70');

  component.click(decrementControl);
  expect(valueControl.textContent).toBe('60');
});

test('renders the current value and can increment and decrement with provideMocked from jest-utils', async () => {
  const component = await render(ComponentWithProviderComponent, {
    componentProviders: [provideMock(CounterService)],
  });

  const incrementControl = component.getByText('Increment');
  const decrementControl = component.getByText('Decrement');

  component.click(incrementControl);
  component.click(incrementControl);
  component.click(decrementControl);

  const counterService = TestBed.get<CounterService>(CounterService) as Mock<CounterService>;
  expect(counterService.increment).toHaveBeenCalledTimes(2);
  expect(counterService.decrement).toHaveBeenCalledTimes(1);
});
