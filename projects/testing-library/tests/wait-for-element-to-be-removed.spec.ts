import { Component, OnInit } from '@angular/core';
import { render } from '../src/public_api';
import { timer } from 'rxjs';

@Component({
  selector: 'fixture',
  template: `
    <div *ngIf="visible" data-testid="im-here">👋</div>
  `,
})
class FixtureComponent implements OnInit {
  visible = true;
  ngOnInit() {
    timer(500).subscribe(() => (this.visible = false));
  }
}

test('waits for element to be removed', async () => {
  const { queryByTestId, getByTestId, waitForElementToBeRemoved } = await render(FixtureComponent);

  await waitForElementToBeRemoved(() => getByTestId('im-here'));

  expect(queryByTestId('im-here')).toBeNull();
});

test('allows to override options', async () => {
  const { getByTestId, waitForElementToBeRemoved } = await render(FixtureComponent);

  await expect(waitForElementToBeRemoved(() => getByTestId('im-here'), { timeout: 200 })).rejects.toThrow(
    /Timed out in waitForElementToBeRemoved/i,
  );
});
