import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';

@Component({
  template: `<button (click)="toggleShow()" data-testid="toggle">toggle</button>
    <div *ngIf="show$ | async" data-testid="getme">Here I am</div>`,
})
export class TestSelectComponent {
  showSubj = new BehaviorSubject(false);
  show$ = this.showSubj.asObservable();

  toggleShow() {
    this.showSubj.next(true);
  }
}

it('should show hidden text', async () => {
  await render(TestSelectComponent);
  const toggle = screen.getByTestId('toggle');
  const hiddenText = screen.queryByTestId('getme');

  expect(hiddenText).toBeNull();
  fireEvent.click(toggle);

  // fails
  // await waitFor(() => expect(hiddenText).not.toBeNull());

  // succeeds
  await waitFor(() => expect(screen.queryByTestId('getme')).not.toBeNull());
});
