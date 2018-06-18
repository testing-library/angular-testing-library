import { Component, Input } from '@angular/core';
import { createComponent, fireEvent } from '../../src/public_api';

@Component({
  selector: 'counter',
  template: `
    <button (click)="decrement()">-</button>
    <span data-testid="count">Current Count: {{ counter }}</span>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  @Input() counter = 0;
  increment() {
    this.counter += 1;
  }
  decrement() {
    this.counter -= 1;
  }
}

test('Counter actions via template syntax', async () => {
  const { detectChanges, getByText, getByTestId } = await createComponent('<counter [counter]="10"></counter>', {
    declarations: [CounterComponent],
  });

  fireEvent.click(getByText('+'));
  detectChanges();
  expect(getByText('Current Count: 11')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 11');

  getByText('-').click();
  detectChanges();
  expect(getByText('Current Count: 10')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 10');
});

test('Counter actions via component syntax', async () => {
  const { getByText, detectChanges, getByTestId } = await createComponent(
    {
      component: CounterComponent,
      parameters: {
        counter: 10,
      },
    },
    {
      declarations: [CounterComponent],
    },
  );

  getByText('+').click();
  detectChanges();
  expect(getByText('Current Count: 11')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 11');

  getByText('-').click();
  detectChanges();
  expect(getByText('Current Count: 10')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 10');
});

test('Counter actions via component syntax without parameters', async () => {
  const { getByText, detectChanges, getByTestId } = await createComponent(
    {
      component: CounterComponent,
    },
    {
      declarations: [CounterComponent],
    },
  );

  getByText('+').click();
  detectChanges();
  expect(getByText('Current Count: 1')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 1');

  getByText('-').click();
  detectChanges();
  expect(getByText('Current Count: 0')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 0');
});
