import { Component, OnInit } from '@angular/core';
import { render, screen, waitForElementToBeRemoved as waitForElementToBeRemovedATL } from '../src/public_api';
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

describe('from import', () => {
  test('waits for element to be removed (callback)', async () => {
    await render(FixtureComponent);

    await waitForElementToBeRemovedATL(() => screen.getByTestId('im-here'));

    expect(screen.queryByTestId('im-here')).toBeNull();
  });

  test('waits for element to be removed (element)', async () => {
    await render(FixtureComponent);

    await waitForElementToBeRemovedATL(screen.getByTestId('im-here'));

    expect(screen.queryByTestId('im-here')).toBeNull();
  });

  test('allows to override options', async () => {
    await render(FixtureComponent);

    await expect(waitForElementToBeRemovedATL(() => screen.getByTestId('im-here'), { timeout: 200 })).rejects.toThrow(
      /Timed out in waitForElementToBeRemoved/i,
    );
  });
});
describe('from render', () => {
  test('waits for element to be removed (callback)', async () => {
    const { queryByTestId, getByTestId, waitForElementToBeRemoved } = await render(FixtureComponent);

    await waitForElementToBeRemoved(() => getByTestId('im-here'));

    expect(queryByTestId('im-here')).toBeNull();
  });

  test('waits for element to be removed (element)', async () => {
    const { queryByTestId, getByTestId, waitForElementToBeRemoved } = await render(FixtureComponent);

    const node = getByTestId('im-here');
    await waitForElementToBeRemoved(node);

    expect(queryByTestId('im-here')).toBeNull();
  });

  test('allows to override options', async () => {
    const { getByTestId, waitForElementToBeRemoved } = await render(FixtureComponent);

    await expect(waitForElementToBeRemoved(() => getByTestId('im-here'), { timeout: 200 })).rejects.toThrow(
      /Timed out in waitForElementToBeRemoved/i,
    );
  });
});
