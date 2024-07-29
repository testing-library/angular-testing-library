import { aliasedInputWithValue, render, screen, within } from '@testing-library/angular';
import { SignalInputComponent } from './22-signal-inputs.component';
import userEvent from '@testing-library/user-event';

test('works with signal inputs', async () => {
  await render(SignalInputComponent, {
    inputs: {
      greeting: aliasedInputWithValue('Hello'),
      name: 'world',
    },
  });

  const inputValue = within(screen.getByTestId('input-value'));
  expect(inputValue.getByText(/hello world/i)).toBeInTheDocument();
});

test('works with computed', async () => {
  await render(SignalInputComponent, {
    inputs: {
      greeting: aliasedInputWithValue('Hello'),
      name: 'world',
    },
  });

  const computedValue = within(screen.getByTestId('computed-value'));
  expect(computedValue.getByText(/hello world/i)).toBeInTheDocument();
});

test('can update signal inputs', async () => {
  const { fixture } = await render(SignalInputComponent, {
    inputs: {
      greeting: aliasedInputWithValue('Hello'),
      name: 'world',
    },
  });

  const inputValue = within(screen.getByTestId('input-value'));
  const computedValue = within(screen.getByTestId('computed-value'));

  expect(inputValue.getByText(/hello world/i)).toBeInTheDocument();

  fixture.componentInstance.name.set('updated');
  // set doesn't trigger change detection within the test, findBy is needed to update the template
  expect(await inputValue.findByText(/hello updated/i)).toBeInTheDocument();
  expect(await computedValue.findByText(/hello updated/i)).toBeInTheDocument();

  // it's not recommended to access the model directly, but it's possible
  expect(fixture.componentInstance.name()).toBe('updated');
});

test('output emits a value', async () => {
  const submitFn = jest.fn();
  await render(SignalInputComponent, {
    inputs: {
      greeting: aliasedInputWithValue('Hello'),
      name: 'world',
    },
    on: {
      submit: submitFn,
    },
  });

  await userEvent.click(screen.getByRole('button'));

  expect(submitFn).toHaveBeenCalledWith('world');
});

test('model update also updates the template', async () => {
  const { fixture } = await render(SignalInputComponent, {
    inputs: {
      greeting: aliasedInputWithValue('Hello'),
      name: 'initial',
    },
  });

  const inputValue = within(screen.getByTestId('input-value'));
  const computedValue = within(screen.getByTestId('computed-value'));

  expect(inputValue.getByText(/hello initial/i)).toBeInTheDocument();
  expect(computedValue.getByText(/hello initial/i)).toBeInTheDocument();

  await userEvent.clear(screen.getByRole('textbox'));
  await userEvent.type(screen.getByRole('textbox'), 'updated');

  expect(inputValue.getByText(/hello updated/i)).toBeInTheDocument();
  expect(computedValue.getByText(/hello updated/i)).toBeInTheDocument();
  expect(fixture.componentInstance.name()).toBe('updated');

  fixture.componentInstance.name.set('new value');
  // set doesn't trigger change detection within the test, findBy is needed to update the template
  expect(await inputValue.findByText(/hello new value/i)).toBeInTheDocument();
  expect(await computedValue.findByText(/hello new value/i)).toBeInTheDocument();

  // it's not recommended to access the model directly, but it's possible
  expect(fixture.componentInstance.name()).toBe('new value');
});

test('works with signal inputs, computed values, and rerenders', async () => {
  const view = await render(SignalInputComponent, {
    inputs: {
      greeting: aliasedInputWithValue('Hello'),
      name: 'world',
    },
  });

  const inputValue = within(screen.getByTestId('input-value'));
  const computedValue = within(screen.getByTestId('computed-value'));

  expect(inputValue.getByText(/hello world/i)).toBeInTheDocument();
  expect(computedValue.getByText(/hello world/i)).toBeInTheDocument();

  await view.rerender({
    inputs: {
      greeting: aliasedInputWithValue('bye'),
      name: 'test',
    },
  });

  expect(inputValue.getByText(/bye test/i)).toBeInTheDocument();
  expect(computedValue.getByText(/bye test/i)).toBeInTheDocument();
});
