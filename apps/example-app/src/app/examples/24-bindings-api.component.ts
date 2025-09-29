import { Component, computed, input, model, numberAttribute, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'atl-bindings-api-example',
  template: `
    <div data-testid="input-value">{{ greetings() }} {{ name() }} of {{ age() }} years old</div>
    <div data-testid="computed-value">{{ greetingMessage() }}</div>
    <button data-testid="submit-button" (click)="submitName()">Submit</button>
    <button data-testid="increment-button" (click)="incrementAge()">Increment Age</button>
    <input type="text" data-testid="name-input" [(ngModel)]="name" />
    <div data-testid="current-age">Current age: {{ age() }}</div>
  `,
  standalone: true,
  imports: [FormsModule],
})
export class BindingsApiExampleComponent {
  greetings = input<string>('', {
    alias: 'greeting',
  });
  age = input.required<number, string>({ transform: numberAttribute });
  name = model.required<string>();
  submitValue = output<string>();
  ageChanged = output<number>();

  greetingMessage = computed(() => `${this.greetings()} ${this.name()} of ${this.age()} years old`);

  submitName() {
    this.submitValue.emit(this.name());
  }

  incrementAge() {
    const newAge = this.age() + 1;
    this.ageChanged.emit(newAge);
  }
}
