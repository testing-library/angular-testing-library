import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { render, screen, fireEvent, waitFor as waitForATL } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: `
    <button data-testid="button" (click)="load()">Load</button>
    <div>{{ result }}</div>
  `,
})
class FixtureComponent {
  result = '';

  load() {
    timer(500).subscribe(() => (this.result = 'Success'));
  }
}

test('waits for assertion to become true', async () => {
  await render(FixtureComponent);

  expect(screen.queryByText('Success')).toBeNull();

  fireEvent.click(screen.getByTestId('button'));

  await waitForATL(() => screen.getByText('Success'));
  screen.getByText('Success');
});

test('allows to override options', async () => {
  await render(FixtureComponent);

  fireEvent.click(screen.getByTestId('button'));

  await expect(waitForATL(() => screen.getByText('Success'), { timeout: 200 })).rejects.toThrow(
    /Unable to find an element with the text: Success/i,
  );
});
