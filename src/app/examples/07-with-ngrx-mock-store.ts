import { Component } from '@angular/core';
import { createSelector, Store, select } from '@ngrx/store';

export const selectItems = createSelector(
  (state: any) => state.items,
  items => items,
);

@Component({
  selector: 'app-fixture',
  template: `
    <ul>
      <li *ngFor="let item of items | async">{{ item }}</li>
    </ul>
  `,
})
export class WithNgRxMockStoreComponent {
  items = this.store.pipe(select(selectItems));
  constructor(private store: Store<any>) {}
}
