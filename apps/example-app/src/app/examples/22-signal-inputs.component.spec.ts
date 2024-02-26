import { render, screen } from '@testing-library/angular';
import { SignalInputComponent } from './22-signal-inputs.component';
import { Component } from '@angular/core';

test('works with signal inputs using a wrapper component', async () => {
  @Component({
    template: `
      <app-signal-input [greeting]="greeting" [name]="name"/>
    `,
    standalone: true,
    imports: [SignalInputComponent],
  })
  class WrapperComponent {
    greeting = 'Hello';
    name = 'world';
  }

  await render(WrapperComponent);

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});
