import { Component, inject, Injectable, model, output, outputBinding, signal, twoWayBinding } from '@angular/core';
import { test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../zoneless';

@Injectable()
class CounterService {
  private count = signal(0);

  getCount() {
    return this.count();
  }

  increment() {
    this.count.set(this.count() + 1);
  }

  decrement() {
    this.count.set(this.count() - 1);
  }
}

@Component({
  selector: 'atl-service-fixture',
  template: `
    <button (click)="decrement()">-</button>
    <span data-testid="counter">{{ count }}</span>
    <button (click)="increment()">+</button>
  `,
})
class ServiceFixtureComponent {
  private counterService = inject(CounterService);
  count = this.counterService.getCount();

  increment() {
    this.counterService.increment();
    this.count = this.counterService.getCount();
  }

  decrement() {
    this.counterService.decrement();
    this.count = this.counterService.getCount();
  }
}

@Component({
  selector: 'atl-fixture',
  template: `
    <button (click)="decrement()">-</button>
    <span data-testid="value">{{ value() }}</span>
    <button (click)="increment()">+</button>
  `,
})
class FixtureComponent {
  value = model(5);
  valueUpdated = output<number>();

  decrement() {
    this.value.set(this.value() - 1);
    this.valueUpdated.emit(this.value());
  }

  increment() {
    this.value.set(this.value() + 1);
    this.valueUpdated.emit(this.value());
  }
}

test('renders and interacts with the component', async () => {
  const user = userEvent.setup();
  await render(FixtureComponent);

  const incrementControl = screen.getByRole('button', { name: '+' });
  const decrementControl = screen.getByRole('button', { name: '-' });
  const valueControl = screen.getByTestId('value');

  await vi.waitFor(() => expect(valueControl).toHaveTextContent('5'));

  await user.click(incrementControl);
  await user.click(incrementControl);

  await waitFor(() => expect(valueControl).toHaveTextContent('7'));

  await user.click(decrementControl);
  await waitFor(() => expect(valueControl).toHaveTextContent('6'));
});

test('can set properties', async () => {
  const user = userEvent.setup();
  const spy = vi.fn();
  await render(FixtureComponent, {
    bindings: [twoWayBinding('value', signal(3)), outputBinding('valueUpdated', spy)],
  });

  const valueControl = screen.getByTestId('value');
  const incrementControl = screen.getByRole('button', { name: '+' });

  await vi.waitFor(() => expect(valueControl).toHaveTextContent('3'));

  await user.click(incrementControl);
  expect(spy).toHaveBeenCalledWith(4);
});

test('renders and interacts with the component using a template', async () => {
  const user = userEvent.setup();
  const wrapperValue = signal(10);
  const wrapperOutput = vi.fn();
  await render(`<atl-fixture [value]="wrapperValue()" (valueUpdated)="valueUpdated($event)" />`, {
    imports: [FixtureComponent],
    wrapperProperties: {
      wrapperValue: wrapperValue,
      valueUpdated: wrapperOutput,
    },
  });

  await vi.waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('10'));
  const incrementControl = screen.getByRole('button', { name: '+' });
  const decrementControl = screen.getByRole('button', { name: '-' });
  const valueControl = screen.getByTestId('value');

  await user.click(incrementControl);
  expect(wrapperOutput).toHaveBeenCalled();

  await user.click(incrementControl);
  await waitFor(() => expect(valueControl).toHaveTextContent('12'));

  await user.click(decrementControl);
  await vi.waitFor(() => expect(valueControl).toHaveTextContent('11'));

  wrapperValue.set(20);
  await vi.waitFor(() => expect(valueControl).toHaveTextContent('20'));
});

test('can provide custom service providers', async () => {
  const user = userEvent.setup();
  await render(ServiceFixtureComponent, {
    providers: [CounterService],
  });

  const incrementControl = screen.getByRole('button', { name: '+' });
  const decrementControl = screen.getByRole('button', { name: '-' });
  const counterControl = screen.getByTestId('counter');

  await vi.waitFor(() => expect(counterControl).toHaveTextContent('0'));

  await user.click(incrementControl);
  await waitFor(() => expect(counterControl).toHaveTextContent('1'));

  await user.click(incrementControl);
  await waitFor(() => expect(counterControl).toHaveTextContent('2'));

  await user.click(decrementControl);
  await waitFor(() => expect(counterControl).toHaveTextContent('1'));
});
