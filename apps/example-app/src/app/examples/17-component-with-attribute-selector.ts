import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-fixture-component-with-attribute-selector[value]',
  template: ` <span data-testid="value">{{ value }}</span> `,
})
export class ComponentWithAttributeSelectorComponent {
  @Input() value!: number;
}
