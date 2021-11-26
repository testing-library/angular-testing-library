import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-fixture',
  template: `
    <p>
      <ng-content></ng-content>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent {}
