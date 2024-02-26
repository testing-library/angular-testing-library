import { Component, input } from '@angular/core';

@Component({
  selector: 'app-signal-input',
  template: ` {{ greetings() }} {{ name() }} `,
  standalone: true,
})
export class SignalInputComponent {
  greetings = input<string>('', {
    alias: 'greeting',
  });
  name = input.required<string>();
}
