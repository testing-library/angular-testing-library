import { Component } from '@angular/core';
import { createSelector, Store, createAction, createReducer, on, select } from '@ngrx/store';

const increment = createAction('increment');
const decrement = createAction('decrement');
const counterReducer = createReducer(
  0,
  on(increment, (state) => state + 1),
  on(decrement, (state) => state - 1),
);

export function reducer(state, action) {
  return counterReducer(state, action);
}

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
