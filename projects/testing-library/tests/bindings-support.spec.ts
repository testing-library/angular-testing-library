import { Component, input, output, inputBinding, outputBinding } from '@angular/core';
import { render, screen, aliasedInput } from '../src/public_api';

describe('ATL Bindings API Support', () => {
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

  it('should support inputBinding for regular inputs', async () => {
    await render(BindingsTestComponent, {
      bindings: [inputBinding('value', () => 'test-value'), inputBinding('greet', () => 'hi there')],
    });

    expect(screen.getByTestId('value')).toHaveTextContent('test-value');
    expect(screen.getByTestId('greeting')).toHaveTextContent('hi there');
  });

  it('should support outputBinding for outputs', async () => {
    const clickHandler = jest.fn();

    await render(BindingsTestComponent, {
      bindings: [inputBinding('value', () => 'bound-value'), outputBinding('clicked', clickHandler)],
    });

    const button = screen.getByTestId('emit-button');
    button.click();

    expect(clickHandler).toHaveBeenCalledWith('clicked: bound-value');
  });

  it('should warn when mixing bindings with traditional inputs but still work', async () => {
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

    // Both binding and traditional handlers should be called for outputs
    expect(bindingClickHandler).toHaveBeenCalledWith('clicked: binding-value');
    expect(clickHandler).toHaveBeenCalledWith('clicked: binding-value');

    // Should show warning about mixed usage for inputs
    expect(consoleSpy).toHaveBeenCalledWith(
      'ATL: You specified both bindings and traditional inputs. ' +
        'Angular does not allow mixing setInput() with inputBinding(). ' +
        'Only bindings will be used for inputs. Use bindings for all inputs to avoid this warning.',
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'ATL: You specified both bindings and traditional output listeners. ' +
        'Consider using outputBinding() for all outputs for consistency.',
    );

    consoleSpy.mockRestore();
  });
});
