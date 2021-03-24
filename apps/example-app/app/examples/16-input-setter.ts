import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fixture',
  template: ` <span data-testid="value">{{ modifiedValue }}</span> `,
})
export class InputSetterComponet {
  @Input() set value(value: number) {
    this.modifiedValue = `Value is ${value}`;
  }

  modifiedValue: string;
}
