import { render } from '@testing-library/angular';

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

// test('renders the current value and can increment and decrement with a mocked jest-utils service', async () => {
//   const component = await render(FixtureComponent, {
//     componentProviders: [provideMock(CounterService)],
//   });

//   const counter = TestBed.get<CounterService>(CounterService) as Mock<CounterService>;
//   let fakeCounter = 50;
//   counter.increment.mockImplementation(() => (fakeCounter += 10));
//   counter.decrement.mockImplementation(() => (fakeCounter -= 10));
//   counter.value.mockImplementation(() => fakeCounter);

//   const incrementControl = component.getByText('Increment');
//   const decrementControl = component.getByText('Decrement');
//   const valueControl = component.getByTestId('value');

//   expect(valueControl.textContent).toBe('50');

//   component.click(incrementControl);
//   component.click(incrementControl);
//   expect(valueControl.textContent).toBe('70');

//   component.click(decrementControl);
//   expect(valueControl.textContent).toBe('60');
// });
