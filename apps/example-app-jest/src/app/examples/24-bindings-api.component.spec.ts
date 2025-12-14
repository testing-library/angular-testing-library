import { signal, inputBinding, outputBinding, twoWayBinding } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { BindingsApiExampleComponent } from './24-bindings-api.component';

test('displays computed greeting message with input values', async () => {
  await render(BindingsApiExampleComponent, {
    bindings: [
      inputBinding('greeting', () => 'Hello'),
      inputBinding('age', () => 25),
      twoWayBinding('name', signal('John')),
    ],
  });

  expect(screen.getByTestId('input-value')).toHaveTextContent('Hello John of 25 years old');
  expect(screen.getByTestId('computed-value')).toHaveTextContent('Hello John of 25 years old');
  expect(screen.getByTestId('current-age')).toHaveTextContent('Current age: 25');
});

test('emits submitValue output when submit button is clicked', async () => {
  const submitHandler = jest.fn();
  const nameSignal = signal('Alice');

  await render(BindingsApiExampleComponent, {
    bindings: [
      inputBinding('greeting', () => 'Good morning'),
      inputBinding('age', () => 28),
      twoWayBinding('name', nameSignal),
      outputBinding('submitValue', submitHandler),
    ],
  });

  const submitButton = screen.getByTestId('submit-button');
  submitButton.click();
  expect(submitHandler).toHaveBeenCalledWith('Alice');
});

test('emits ageChanged output when increment button is clicked', async () => {
  const ageChangedHandler = jest.fn();

  await render(BindingsApiExampleComponent, {
    bindings: [
      inputBinding('greeting', () => 'Hi'),
      inputBinding('age', () => 20),
      twoWayBinding('name', signal('Charlie')),
      outputBinding('ageChanged', ageChangedHandler),
    ],
  });

  const incrementButton = screen.getByTestId('increment-button');
  incrementButton.click();

  expect(ageChangedHandler).toHaveBeenCalledWith(21);
});

test('updates name through two-way binding when input changes', async () => {
  const nameSignal = signal('Initial Name');

  await render(BindingsApiExampleComponent, {
    bindings: [
      inputBinding('greeting', () => 'Hello'),
      inputBinding('age', () => 25),
      twoWayBinding('name', nameSignal),
    ],
  });

  const nameInput = screen.getByTestId('name-input') as HTMLInputElement;

  // Verify initial value
  expect(nameInput.value).toBe('Initial Name');
  expect(screen.getByTestId('input-value')).toHaveTextContent('Hello Initial Name of 25 years old');

  // Update the signal externally
  nameSignal.set('Updated Name');

  // Verify the input and display update
  expect(await screen.findByDisplayValue('Updated Name')).toBeInTheDocument();
  expect(screen.getByTestId('input-value')).toHaveTextContent('Hello Updated Name of 25 years old');
  expect(screen.getByTestId('computed-value')).toHaveTextContent('Hello Updated Name of 25 years old');
});

test('updates computed value when inputs change', async () => {
  const greetingSignal = signal('Good day');
  const nameSignal = signal('David');
  const ageSignal = signal(35);

  const { fixture } = await render(BindingsApiExampleComponent, {
    bindings: [
      inputBinding('greeting', greetingSignal),
      inputBinding('age', ageSignal),
      twoWayBinding('name', nameSignal),
    ],
  });

  // Initial state
  expect(screen.getByTestId('computed-value')).toHaveTextContent('Good day David of 35 years old');

  // Update greeting
  greetingSignal.set('Good evening');
  fixture.detectChanges();
  expect(screen.getByTestId('computed-value')).toHaveTextContent('Good evening David of 35 years old');

  // Update age
  ageSignal.set(36);
  fixture.detectChanges();
  expect(screen.getByTestId('computed-value')).toHaveTextContent('Good evening David of 36 years old');

  // Update name
  nameSignal.set('Daniel');
  fixture.detectChanges();
  expect(screen.getByTestId('computed-value')).toHaveTextContent('Good evening Daniel of 36 years old');
});

test('handles multiple output emissions correctly', async () => {
  const submitHandler = jest.fn();
  const ageChangedHandler = jest.fn();
  const nameSignal = signal('Emma');

  await render(BindingsApiExampleComponent, {
    bindings: [
      inputBinding('greeting', () => 'Hey'),
      inputBinding('age', () => 22),
      twoWayBinding('name', nameSignal),
      outputBinding('submitValue', submitHandler),
      outputBinding('ageChanged', ageChangedHandler),
    ],
  });

  // Click submit button multiple times
  const submitButton = screen.getByTestId('submit-button');
  submitButton.click();
  submitButton.click();

  expect(submitHandler).toHaveBeenCalledTimes(2);
  expect(submitHandler).toHaveBeenNthCalledWith(1, 'Emma');
  expect(submitHandler).toHaveBeenNthCalledWith(2, 'Emma');

  // Click increment button multiple times
  const incrementButton = screen.getByTestId('increment-button');
  incrementButton.click();
  incrementButton.click();
  incrementButton.click();

  expect(ageChangedHandler).toHaveBeenCalledTimes(3);
  expect(ageChangedHandler).toHaveBeenNthCalledWith(1, 23);
  expect(ageChangedHandler).toHaveBeenNthCalledWith(2, 23); // Still 23 because age input doesn't change
  expect(ageChangedHandler).toHaveBeenNthCalledWith(3, 23);
});
