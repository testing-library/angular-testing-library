import { Component, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signal-input',
  template: `
    <div data-testid="input-value">{{ greetings() }} {{ name() }}</div>
    <div data-testid="computed-value">{{ greetingMessage() }}</div>
    <button (click)="submitName()">Submit</button>
    <input type="text" [(ngModel)]="name" />
  `,
  standalone: true,
  imports: [FormsModule],
})
export class SignalInputComponent {
  greetings = input<string>('', {
    alias: 'greeting',
  });
  name = model.required<string>();
  submit = output<string>();

  greetingMessage = computed(() => `${this.greetings()} ${this.name()}`);

  submitName() {
    this.submit.emit(this.name());
  }
}
