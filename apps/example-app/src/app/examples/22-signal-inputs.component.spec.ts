import { render, screen } from '@testing-library/angular';
import { SignalInputComponent } from './22-signal-inputs.component';
import userEvent from '@testing-library/user-event';

test('works with signal inputs', async () => {
  await render(SignalInputComponent, {
    componentInputs: {
      greeting: 'Hello',
      name: 'world',
    },
  });

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});

test('can update signal inputs', async () => {
  const { fixture } = await render(SignalInputComponent, {
    componentInputs: {
      greeting: 'Hello',
      name: 'world',
    },
  });

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();

  fixture.componentInstance.name.set('updated');
  // set doesn't trigger change detection within the test, findBy is needed to update the template
  expect(await screen.findByText(/hello updated/i)).toBeInTheDocument();
  // it's not recommended to access the model directly, but it's possible
  expect(fixture.componentInstance.name()).toBe('updated');
});

test('output emits a value', async () => {
  const submitFn = jest.fn();
  await render(SignalInputComponent, {
    componentInputs: {
      greeting: 'Hello',
      name: 'world',
    },
    componentOutputs: {
      submit: { emit: submitFn } as any,
    },
  });

  await userEvent.click(screen.getByRole('button'));

  expect(submitFn).toHaveBeenCalledWith('world');
});

test('model update also updates the template', async () => {
  const { fixture } = await render(SignalInputComponent, {
    componentInputs: {
      greeting: 'Hello',
      name: 'initial',
    },
  });

  expect(screen.getByText(/hello initial/i)).toBeInTheDocument();

  await userEvent.clear(screen.getByRole('textbox'));
  await userEvent.type(screen.getByRole('textbox'), 'updated');

  expect(screen.getByText(/hello updated/i)).toBeInTheDocument();
  expect(fixture.componentInstance.name()).toBe('updated');

  fixture.componentInstance.name.set('new value');
  // set doesn't trigger change detection within the test, findBy is needed to update the template
  expect(await screen.findByText(/hello new value/i)).toBeInTheDocument();
  // it's not recommended to access the model directly, but it's possible
  expect(fixture.componentInstance.name()).toBe('new value');
});

test('works with signal inputs and rerenders', async () => {
  const view = await render(SignalInputComponent, {
    componentInputs: {
      greeting: 'Hello',
      name: 'world',
    },
  });

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();

  await view.rerender({
    componentInputs: {
      greeting: 'bye',
      name: 'test',
    },
  });

  expect(screen.getByText(/bye test/i)).toBeInTheDocument();
});
