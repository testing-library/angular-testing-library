import { Component, OnInit } from '@angular/core';
import { render } from '../src/public_api';
import { timer } from 'rxjs';

@Component({
  selector: 'fixture',
  template: `
    <div *ngIf="oneVisible" data-testid="block-one">One</div>
    <div *ngIf="twoVisible" data-testid="block-two">Two</div>
  `,
})
class FixtureComponent implements OnInit {
  oneVisible = false;
  twoVisible = false;

  ngOnInit() {
    timer(200).subscribe(() => (this.oneVisible = true));
    timer(400).subscribe(() => (this.twoVisible = true));
  }
}

test('waits for the DOM to change', async () => {
  const { queryByTestId, getByTestId, waitForDomChange } = await render(FixtureComponent);

  await waitForDomChange();

  getByTestId('block-one');
  expect(queryByTestId('block-two')).toBeNull();

  await waitForDomChange();

  getByTestId('block-one');
  getByTestId('block-two');
});

test('allows to override options', async () => {
  const { waitForDomChange } = await render(FixtureComponent);

  await expect(waitForDomChange({ timeout: 100 })).rejects.toThrow(/Timed out in waitForDomChange/i);
});
