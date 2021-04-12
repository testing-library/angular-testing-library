import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  template: ' <button (click)="raise.emit()">{{ name }}</button> ',
})
export class NestedButtonComponent {
  @Input() name: string;
  @Output() raise = new EventEmitter<void>();
}

@Component({
  selector: 'app-value',
  template: ' <span data-testid="value">{{ value }}</span> ',
})
export class NestedValueComponent {
  @Input() value: number;
}

@Component({
  selector: 'app-fixture',
  template: `
    <app-button (raise)="value = value - 1" name="Decrement"></app-button>
    <app-value [value]="value"></app-value>
    <app-button (raise)="value = value + 1" name="Increment"></app-button>
  `,
})
export class NestedContainerComponent {
  value = 0;
}
