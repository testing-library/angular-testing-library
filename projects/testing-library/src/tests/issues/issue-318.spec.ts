import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { vi, test, expect } from 'vitest';
import { Subject, takeUntil } from 'rxjs';
import { render } from '../../public_api';

@Component({
  selector: 'atl-app-fixture',
  template: '',
})
class FixtureComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((evt) => {
      this.eventReceived(evt);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  eventReceived(evt: any) {
    console.log(evt);
  }
}

test('it does not invoke router events on init', async () => {
  const eventReceived = vi.fn();
  await render(FixtureComponent, {
    imports: [RouterTestingModule],
    componentProperties: {
      eventReceived,
    },
  });
  expect(eventReceived).not.toHaveBeenCalled();
});
