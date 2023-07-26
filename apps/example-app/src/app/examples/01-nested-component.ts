import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-button',
  template: ' <button (click)="raise.emit()">{{ name }}</button> ',
})
export class NestedButtonComponent {
  @Input() name = '';
  @Output() raise = new EventEmitter<void>();
}

@Component({
  standalone: true,
  selector: 'app-value',
  template: ' <span data-testid="value">{{ value }}</span> ',
})
export class NestedValueComponent {
  @Input() value?: number;
}

@Component({
  standalone: true,
  selector: 'app-fixture',
  template: `
    <app-button (raise)="value = value - 1" name="Decrement" />
    <app-value [value]="value" />
    <app-button (raise)="value = value + 1" name="Increment" />
  `,
  imports: [NestedButtonComponent, NestedValueComponent],
})
export class NestedContainerComponent {
  value = 0;
}
