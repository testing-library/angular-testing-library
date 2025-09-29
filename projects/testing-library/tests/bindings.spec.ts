import { Component, input, output, inputBinding, outputBinding, twoWayBinding, signal, model } from '@angular/core';
import { render, screen, aliasedInput } from '../src/public_api';

describe('Bindings API Support', () => {
  @Component({
    selector: 'atl-bindings-test',
    template: `
      <div data-testid="value">{{ value() }}</div>
      <div data-testid="greeting">{{ greeting() }}</div>
      <button data-testid="emit-button" (click)="clicked.emit('clicked: ' + value())">Click me</button>
    `,
    standalone: true,
  })
  class BindingsTestComponent {
    value = input<string>('default');
    greeting = input<string>('hello', { alias: 'greet' });
    clicked = output<string>();
  }

  @Component({
    selector: 'atl-two-way-test',
    template: `
      <div data-testid="name-display">{{ name() }}</div>
      <input data-testid="name-input" [value]="name()" (input)="name.set($any($event.target).value)" />
      <button data-testid="update-button" (click)="updateName()">Update</button>
    `,
    standalone: true,
  })
  class TwoWayBindingTestComponent {
    name = model<string>('default');

    updateName() {
      this.name.set('updated from component');
    }
  }

  it('supports inputBinding for regular inputs', async () => {
    await render(BindingsTestComponent, {
      bindings: [inputBinding('value', () => 'test-value'), inputBinding('greet', () => 'hi there')],
    });

    expect(screen.getByTestId('value')).toHaveTextContent('test-value');
    expect(screen.getByTestId('greeting')).toHaveTextContent('hi there');
  });

  it('supports outputBinding for outputs', async () => {
    const clickHandler = jest.fn();

    await render(BindingsTestComponent, {
      bindings: [inputBinding('value', () => 'bound-value'), outputBinding('clicked', clickHandler)],
    });

    const button = screen.getByTestId('emit-button');
    button.click();

    expect(clickHandler).toHaveBeenCalledWith('clicked: bound-value');
  });

  it('supports inputBinding with writable signal for re-rendering scenario', async () => {
    const valueSignal = signal('initial-value');

    await render(BindingsTestComponent, {
      bindings: [inputBinding('value', valueSignal), inputBinding('greet', () => 'hi there')],
    });

    expect(screen.getByTestId('value')).toHaveTextContent('initial-value');
    expect(screen.getByTestId('greeting')).toHaveTextContent('hi there');

    // Update the signal and verify it reflects in the component
    valueSignal.set('updated-value');

    // The binding should automatically update the component
    expect(await screen.findByText('updated-value')).toBeInTheDocument();
  });

  it('supports twoWayBinding for model signals', async () => {
    const nameSignal = signal('initial name');

    await render(TwoWayBindingTestComponent, {
      bindings: [twoWayBinding('name', nameSignal)],
    });

    // Verify initial value
    expect(screen.getByTestId('name-display')).toHaveTextContent('initial name');
    expect(screen.getByTestId('name-input')).toHaveValue('initial name');

    // Update from outside (signal change)
    nameSignal.set('updated from signal');
    expect(await screen.findByDisplayValue('updated from signal')).toBeInTheDocument();
    expect(screen.getByTestId('name-display')).toHaveTextContent('updated from signal');

    // Update from component - let's trigger change detection after the click
    const updateButton = screen.getByTestId('update-button');
    updateButton.click();

    // Give Angular a chance to process the update and check both the signal and display
    // The twoWayBinding should update the external signal
    expect(await screen.findByText('updated from component')).toBeInTheDocument();
    expect(nameSignal()).toBe('updated from component');
  });

  it('warns when mixing bindings with traditional inputs but still works', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const clickHandler = jest.fn();
    const bindingClickHandler = jest.fn();

    await render(BindingsTestComponent, {
      bindings: [inputBinding('value', () => 'binding-value'), outputBinding('clicked', bindingClickHandler)],
      inputs: {
        ...aliasedInput('greet', 'traditional-greeting'), // This will be ignored due to bindings
      },
      on: {
        clicked: clickHandler, // This should still work alongside bindings
      },
    });

    // Only binding should work for inputs
    expect(screen.getByTestId('value')).toHaveTextContent('binding-value');
    expect(screen.getByTestId('greeting')).toHaveTextContent('hello'); // Default value, not traditional

    const button = screen.getByTestId('emit-button');
    button.click();

    // Both binding and traditional handlers are called for outputs
    expect(bindingClickHandler).toHaveBeenCalledWith('clicked: binding-value');
    expect(clickHandler).toHaveBeenCalledWith('clicked: binding-value');

    // Shows warning about mixed usage for inputs
    expect(consoleSpy).toHaveBeenCalledWith(
      '[@testing-library/angular]: You specified both bindings and traditional inputs. ' +
        'Only bindings will be used for inputs. Use bindings for all inputs to avoid this warning.',
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      '[@testing-library/angular]: You specified both bindings and traditional output listeners. ' +
        'Consider using outputBinding() for all outputs for consistency.',
    );

    consoleSpy.mockRestore();
  });
});
