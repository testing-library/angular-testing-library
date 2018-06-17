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

test('Counter actions', async () => {
  const { detectChanges, getByText, getByTestId } = await createComponent('<counter [counter]="10"></counter>', {
    declarations: [CounterComponent],
  });

  getByText('+').click();
  getByText('+').click();
  getByText('+').click();
  detectChanges();
  expect(getByText('Current Count: 13')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 13');

  getByText('-').click();
  detectChanges();
  expect(getByText('Current Count: 12')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 12');
});

test('Counter actions - fireEvent', async () => {
  const { detectChanges, getByText, getByTestId } = await createComponent('<counter [counter]="10"></counter>', {
    declarations: [CounterComponent],
  });

  fireEvent.click(getByText('+'));
  fireEvent.click(getByText('+'));
  fireEvent.click(getByText('+'));
  detectChanges();
  expect(getByText('Current Count: 13')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 13');

  fireEvent.click(getByText('-'));
  detectChanges();
  expect(getByText('Current Count: 12')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 12');
});

test('Counter actions via component', async () => {
  const { getComponentInstance } = await createComponent(
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

  const counter = getComponentInstance();
  counter.increment();
  counter.increment();
  counter.increment();
  expect(counter.counter).toBe(13);

  counter.decrement();
  expect(counter.counter).toBe(12);
});

test('Counter actions via component without parameters', async () => {
  const { getComponentInstance } = await createComponent(
    {
      component: CounterComponent,
    },
    {
      declarations: [CounterComponent],
    },
  );

  const counter = getComponentInstance();
  counter.increment();
  counter.increment();
  counter.increment();
  expect(counter.counter).toBe(3);

  counter.decrement();
  expect(counter.counter).toBe(2);
});

test('Counter via component - test template', async () => {
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
  getByText('+').click();
  getByText('+').click();
  detectChanges();
  expect(getByText('Current Count: 13')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 13');

  getByText('-').click();
  detectChanges();
  expect(getByText('Current Count: 12')).toBeTruthy();
  expect(getByTestId('count').textContent).toBe('Current Count: 12');
});
