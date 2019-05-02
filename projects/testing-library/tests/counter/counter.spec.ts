import { Component, Input } from '@angular/core';
import { render } from '../../src/public_api';

@Component({
  selector: 'counter',
  template: `
    <button (click)="decrement()">-</button> <span data-testid="count">Current Count: {{ counter }}</span>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  @Input()
  counter = 0;
  increment() {
    this.counter += 1;
  }
  decrement() {
    this.counter -= 1;
  }
}

test('Counter actions via template syntax', async () => {
  const { getByText, getByTestId, click } = await render('<counter [counter]="10"></counter>', {
    declarations: [CounterComponent],
  });

  click(getByText('+'));
  expect(getByText('Current Count: 11')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 11');

  click(getByText('-'));
  expect(getByText('Current Count: 10')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 10');
});

test('Counter actions via template syntax with parameters', async () => {
  const { getByText, getByTestId, click } = await render<CounterComponent>('<counter></counter>', {
    declarations: [CounterComponent],
    componentProperties: {
      counter: 10,
    },
  });

  click(getByText('+'));
  expect(getByText('Current Count: 11')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 11');

  click(getByText('-'));
  expect(getByText('Current Count: 10')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 10');
});

test('Counter actions via component syntax', async () => {
  const { getByText, getByTestId, click } = await render(CounterComponent, {
    declarations: [CounterComponent],
    componentProperties: {
      counter: 10,
    },
  });

  click(getByText('+'));
  expect(getByText('Current Count: 11')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 11');

  click(getByText('-'));
  expect(getByText('Current Count: 10')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 10');
});

test('Counter actions via component syntax without parameters', async () => {
  const { getByText, getByTestId, click } = await render(CounterComponent, {
    declarations: [CounterComponent],
  });

  click(getByText('+'));
  expect(getByText('Current Count: 1')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 1');

  click(getByText('-'));
  expect(getByText('Current Count: 0')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 0');
});
