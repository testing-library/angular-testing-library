import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fixture',
  template: `
    <span data-testid="value">{{ derivedValue }}</span>
    <span data-testid="value-getter">{{ value }}</span>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class InputGetterSetter {
  @Input() set value(value: string) {
    this.originalValue = value;
    this.derivedValue = 'I am value from setter ' + value;
  }

  get value() {
    return 'I am value from getter ' + this.originalValue;
  }

  private originalValue: string;
  derivedValue: string;
}
