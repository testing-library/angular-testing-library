import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
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
  const { queryByText, getByTestId, click, wait, getByText } = await render(FixtureComponent);

  expect(queryByText('Success')).toBeNull();

  click(getByTestId('button'));

  await wait(() => getByText('Success'));
  getByText('Success');
});

test('allows to override options', async () => {
  const { getByTestId, click, wait, getByText } = await render(FixtureComponent);

  click(getByTestId('button'));

  await expect(wait(() => getByText('Success'), { timeout: 200 })).rejects.toThrow(
    /Unable to find an element with the text: Success/i,
  );
});
