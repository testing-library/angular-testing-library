import { Component } from '@angular/core';

@Component({
  selector: 'app-deferable-view-child',
  template: ` <p>Hello from deferred child component</p> `,
  standalone: true,
})
export class DeferableViewChildComponent {}

@Component({
  template: `
    @defer (on timer(2s)) {
        <app-deferable-view-child />
    } @placeholder {
        <p>Hello from placeholder</p>
    } @loading {
        <p>Hello from loading</p>
    } @error {
        <p>Hello from error</p>
    }
  `,
  imports: [DeferableViewChildComponent],
  standalone: true,
})
export class DeferableViewComponent {}
