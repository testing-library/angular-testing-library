import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signal-input',
  template: `
    <div>{{ greetings() }} {{ name() }}</div>
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

  submitName() {
    this.submit.emit(this.name());
  }
}
