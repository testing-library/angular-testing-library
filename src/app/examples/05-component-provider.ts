import { Component, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private _value = 0;

  increment() {
    this._value += 1;
  }

  decrement() {
    this._value -= 1;
  }

  value() {
    return this._value;
  }
}

@Component({
  selector: 'app-fixture',
  template: `
    <button (click)="counter.decrement()">Decrement</button>
    <span data-testid="value">{{ counter.value() }}</span>
    <button (click)="counter.increment()">Increment</button>
  `,
  providers: [CounterService],
})
export class ComponentWithProviderComponent {
  constructor(public counter: CounterService) {}
}
