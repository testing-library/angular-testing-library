import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  template: `
    <p>
      <ng-content></ng-content>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent {}
