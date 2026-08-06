import { Component, inject, Injectable, model, output, outputBinding, signal, twoWayBinding } from '@angular/core';
import { test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, queries, queryHelpers } from '../index';

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

  expect(valueControl).toHaveTextContent('5');

  await user.click(incrementControl);
  await user.click(incrementControl);

  expect(valueControl).toHaveTextContent('7');

  await user.click(decrementControl);
  expect(valueControl).toHaveTextContent('6');
});

test('renders and interacts with the component with skipDetectChanges set to true', async () => {
  const user = userEvent.setup();
  await render(FixtureComponent, { skipDetectChanges: true });

  const incrementControl = screen.getByRole('button', { name: '+' });
  const decrementControl = screen.getByRole('button', { name: '-' });
  const valueControl = screen.getByTestId('value');

  // The initial value is not rendered until the first change detection runs, so we need to wait for it.
  expect(valueControl).not.toHaveTextContent('5');
  await vi.waitFor(() => expect(valueControl).toHaveTextContent('5'));

  await user.click(incrementControl);
  await user.click(incrementControl);

  expect(valueControl).toHaveTextContent('7');

  await user.click(decrementControl);
  expect(valueControl).toHaveTextContent('6');
});

test('can set properties', async () => {
  const user = userEvent.setup();
  const spy = vi.fn();
  await render(FixtureComponent, {
    bindings: [twoWayBinding('value', signal(3)), outputBinding('valueUpdated', spy)],
  });

  const valueControl = screen.getByTestId('value');
  const incrementControl = screen.getByRole('button', { name: '+' });

  expect(valueControl).toHaveTextContent('3');

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

  expect(screen.getByTestId('value')).toHaveTextContent('10');

  const incrementControl = screen.getByRole('button', { name: '+' });
  const decrementControl = screen.getByRole('button', { name: '-' });
  const valueControl = screen.getByTestId('value');

  await user.click(incrementControl);
  expect(wrapperOutput).toHaveBeenCalled();

  await user.click(incrementControl);
  expect(valueControl).toHaveTextContent('12');

  await user.click(decrementControl);
  expect(valueControl).toHaveTextContent('11');

  wrapperValue.set(20);
  // Wait for the component to update after changing the signal value
  await vi.waitFor(() => expect(valueControl).toHaveTextContent('20'));
});

@Component({
  selector: 'atl-child',
  template: `<span data-testid="child">Real Child</span>`,
})
class ChildComponent {}

@Component({
  selector: 'atl-child',
  template: `<span data-testid="child">Mock Child</span>`,
})
class MockChildComponent {}

@Component({
  selector: 'atl-other',
  template: `<span data-testid="other">Other</span>`,
})
class OtherComponent {}

@Component({
  selector: 'atl-parent',
  template: `<atl-child /><atl-other />`,
  imports: [ChildComponent, OtherComponent],
})
class ParentComponent {}

@Component({
  selector: 'atl-non-standalone',
  template: `non-standalone`,
  standalone: false,
})
class NonStandaloneComponent {}

test('replaces an import with importOverrides', async () => {
  await render(ParentComponent, {
    importOverrides: [{ replace: ChildComponent, with: MockChildComponent }],
  });

  expect(screen.getByTestId('child')).toHaveTextContent('Mock Child');
});

test('importOverrides leaves other imports intact', async () => {
  await render(ParentComponent, {
    importOverrides: [{ replace: ChildComponent, with: MockChildComponent }],
  });

  expect(screen.getByTestId('child')).toHaveTextContent('Mock Child');
  expect(screen.getByTestId('other')).toHaveTextContent('Other');
});

test('importOverrides throws on non-standalone component', async () => {
  await expect(
    render(NonStandaloneComponent, {
      importOverrides: [{ replace: ChildComponent, with: MockChildComponent }],
    } as any),
  ).rejects.toThrow(/Cannot specify importOverrides on a template or non-standalone component/);
});

test('throws when importOverrides is used on a template', async () => {
  await expect(
    render(`<atl-parent />`, {
      imports: [ParentComponent],
      importOverrides: [{ replace: ChildComponent, with: MockChildComponent }],
    } as any),
  ).rejects.toThrow(/Cannot specify importOverrides on a template or non-standalone component/);
});

test('importOverrides empty array is a no-op', async () => {
  await render(ParentComponent, {
    importOverrides: [],
  });

  expect(screen.getByTestId('child')).toHaveTextContent('Real Child');
  expect(screen.getByTestId('other')).toHaveTextContent('Other');
});

test('can provide custom service providers', async () => {
  const user = userEvent.setup();
  await render(ServiceFixtureComponent, {
    providers: [CounterService],
  });

  const incrementControl = screen.getByRole('button', { name: '+' });
  const decrementControl = screen.getByRole('button', { name: '-' });
  const counterControl = screen.getByTestId('counter');

  expect(counterControl).toHaveTextContent('0');

  await user.click(incrementControl);
  expect(counterControl).toHaveTextContent('1');

  await user.click(incrementControl);
  expect(counterControl).toHaveTextContent('2');

  await user.click(decrementControl);
  expect(counterControl).toHaveTextContent('1');
});

@Component({
  selector: 'atl-custom-query-fixture',
  template: `<div data-test-id="my-fixture">Hello world</div>`,
})
class CustomQueryFixtureComponent {}

test('custom queries passed to render are available on the render result', async () => {
  const myQueryByTestId = queryHelpers.queryByAttribute.bind(null, 'data-test-id');

  const view = await render(CustomQueryFixtureComponent, {
    queries: {
      ...queries,
      myQueryByTestId,
    },
  });

  expect(view.myQueryByTestId('my-fixture')).not.toBeNull();
  // eslint-disable-next-line testing-library/prefer-screen-queries
  expect(view.myQueryByTestId('my-fixture')).toBe(view.getByText('Hello world'));
});
