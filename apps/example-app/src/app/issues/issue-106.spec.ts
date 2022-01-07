import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { render, screen, fireEvent } from '@testing-library/angular';
import { waitFor } from '@testing-library/dom';

@Component({
  template: `<button (click)="toggleShow()" data-testid="toggle">toggle</button>
    <div *ngIf="show$ | async" data-testid="getme">Here I am</div>`,
})
class TestSelectComponent {
  showSubj = new BehaviorSubject(false);
  show$ = this.showSubj.asObservable();

  toggleShow() {
    this.showSubj.next(true);
  }
}

test('https://github.com/testing-library/angular-testing-library/issues/106', async () => {
  await render(TestSelectComponent);
  const toggle = screen.getByTestId('toggle');
  const hiddenText = screen.queryByTestId('getme');

  expect(hiddenText).not.toBeInTheDocument();
  fireEvent.click(toggle);

  // fails
  // await waitFor(() => expect(hiddenText).not.toBeNull());

  // succeeds
  /// Next line is disabled, because we wish to test the behavior of the library and test the bug/issue #106
  /// @see https://github.com/testing-library/angular-testing-library/pull/277/files#r779743116
  // eslint-disable-next-line testing-library/prefer-presence-queries, testing-library/prefer-find-by
  await waitFor(() => expect(screen.queryByTestId('getme')).toBeInTheDocument());
});

test('better https://github.com/testing-library/angular-testing-library/issues/106', async () => {
  await render(TestSelectComponent);
  const toggle = screen.getByTestId('toggle');
  const hiddenText = screen.queryByTestId('getme');

  expect(hiddenText).not.toBeInTheDocument();
  fireEvent.click(toggle);

  expect(screen.getByTestId('getme')).toBeInTheDocument();
});
