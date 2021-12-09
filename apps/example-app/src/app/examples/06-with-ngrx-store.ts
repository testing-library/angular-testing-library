import { Component } from '@angular/core';
import { createSelector, Store, createAction, createReducer, on, select } from '@ngrx/store';

const increment = createAction('increment');
const decrement = createAction('decrement');
export const reducer = createReducer(
  0,
  on(increment, (state) => state + 1),
  on(decrement, (state) => state - 1),
);

const selectValue = createSelector(
  (state: any) => state.value,
  (value) => value * 10,
);

@Component({
  selector: 'app-fixture',
  template: `
    <button (click)="decrement()">Decrement</button>
    <span data-testid="value">{{ value | async }}</span>
    <button (click)="increment()">Increment</button>
  `,
})
export class WithNgRxStoreComponent {
  value = this.store.pipe(select(selectValue));
  constructor(private store: Store<any>) {}

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }
}
