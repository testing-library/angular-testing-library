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
      <li *ngFor="let item of items | async" (click)="send(item)">{{ item }}</li>
    </ul>
  `,
})
export class WithNgRxMockStoreComponent {
  items = this.store.pipe(select(selectItems));
  constructor(private store: Store<any>) {}

  send(item: string) {
    this.store.dispatch({ type: '[Item List] send', item });
  }
}
