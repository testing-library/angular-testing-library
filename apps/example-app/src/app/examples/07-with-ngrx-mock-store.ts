import { AsyncPipe, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { createSelector, Store, select } from '@ngrx/store';

export const selectItems = createSelector(
  (state: any) => state.items,
  (items) => items,
);

@Component({
  standalone: true,
  imports: [AsyncPipe, NgForOf],
  selector: 'atl-fixture',
  template: `
    <ul>
      <li *ngFor="let item of items | async">
        <button (click)="send(item)">{{ item }}</button>
      </li>
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
