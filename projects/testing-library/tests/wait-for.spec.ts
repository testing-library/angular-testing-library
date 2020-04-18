import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { render, screen, fireEvent, waitFor as waitForATL } from '../src/public_api';

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

describe('from import', () => {
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
});

describe('from render', () => {
  test('waits for assertion to become true', async () => {
    const { queryByText, getByTestId, click, waitFor, getByText } = await render(FixtureComponent);

    expect(queryByText('Success')).toBeNull();

    click(getByTestId('button'));

    await waitFor(() => getByText('Success'));
    getByText('Success');
  });

  test('allows to override options', async () => {
    const { getByTestId, click, waitFor, getByText } = await render(FixtureComponent);

    click(getByTestId('button'));

    await expect(waitFor(() => getByText('Success'), { timeout: 200 })).rejects.toThrow(
      /Unable to find an element with the text: Success/i,
    );
  });
});
