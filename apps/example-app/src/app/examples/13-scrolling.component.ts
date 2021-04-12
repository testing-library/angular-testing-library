import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cdk-virtual-scroll-overview-example',
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="example-viewport" data-testid="scroll-viewport">
      <div *cdkVirtualFor="let item of items" class="example-item">{{ item }}</div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      .example-viewport {
        height: 200px;
        width: 200px;
        border: 1px solid black;
      }

      .example-item {
        height: 50px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdkVirtualScrollOverviewExampleComponent {
  items = Array.from({ length: 100 }).map((_, i) => `Item #${i}`);
}
