import { render, screen } from '@testing-library/angular';
import { SignalInputComponent } from './22-signal-inputs.component';

test('works with signal inputs', async () => {
  await render(SignalInputComponent, {
    componentInputs: {
      name: 'world',
      greeting: 'Hello',
    },
  });

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();
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
