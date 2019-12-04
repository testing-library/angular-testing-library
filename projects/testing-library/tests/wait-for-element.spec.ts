import { Component } from '@angular/core';
import { render } from '../src/public_api';
import { timer } from 'rxjs';

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

test('waits for element to be visible', async () => {
  const { getByTestId, click, waitForElement, getByText } = await render(FixtureComponent);

  click(getByTestId('button'));

  await waitForElement(() => getByText('Success'));
  getByText('Success');
});

test('allows to override options', async () => {
  const { getByTestId, click, waitForElement, getByText } = await render(FixtureComponent);

  click(getByTestId('button'));

  await expect(waitForElement(() => getByText('Success'), { timeout: 200 })).rejects.toThrow(
    /Unable to find an element with the text: Success/i,
  );
});
