import { Component, computed, input, model, numberAttribute, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'atl-signal-input',
  template: `
    <div data-testid="input-value">{{ greetings() }} {{ name() }} of {{ age() }} years old</div>
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
  age = input.required<number, string>({ transform: numberAttribute });
  name = model.required<string>();
  submitValue = output<string>();

  greetingMessage = computed(() => `${this.greetings()} ${this.name()} of ${this.age()} years old`);

  submitName() {
    this.submitValue.emit(this.name());
  }
}
