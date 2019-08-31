import { Component } from '@angular/core';

@Component({
  selector: 'app-fixture',
  template: `
    <button (click)="value = value - 1">Decrement</button>
    <span data-testid="value">{{ value }}</span>
    <button (click)="value = value + 1">Increment</button>
  `,
})
export class SingleComponent {
  value = 0;
}
