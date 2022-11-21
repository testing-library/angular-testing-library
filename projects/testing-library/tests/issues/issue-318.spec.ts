import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {Subject, takeUntil} from 'rxjs';
import {render} from "@testing-library/angular";

@Component({
  selector: 'atl-app-fixture',
  template: '',
})
class FixtureComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((evt) => {
      this.eventReceived(evt)
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
  const eventReceived = jest.fn();
  await render(FixtureComponent, {
    imports: [RouterTestingModule],
    componentProperties: {
      eventReceived
    }
  });
  expect(eventReceived).not.toHaveBeenCalled();
});

