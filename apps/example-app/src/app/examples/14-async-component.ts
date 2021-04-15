import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, filter, mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-fixture',
  template: `
    <button (click)="load()">Load</button>
    <div *ngIf="data$ | async as data">{{ data }}</div>
  `,
})
export class AsyncComponent implements OnDestroy {
  actions = new Subject<string>();
  data$ = this.actions.pipe(
    filter((x) => x === 'LOAD'),
    mapTo('Hello world'),
    delay(10_000),
  );

  load() {
    this.actions.next('LOAD');
  }

  ngOnDestroy() {
    this.actions.complete();
  }
}
