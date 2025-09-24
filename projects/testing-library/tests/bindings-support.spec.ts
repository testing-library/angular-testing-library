import { Component, input, output } from '@angular/core';
import { render, screen, inputBinding, outputBinding } from '../src/public_api';

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
});
