import { Component, OnInit, signal } from '@angular/core';
import { render, screen, waitForElementToBeRemoved } from '../public_api';
import { timer } from 'rxjs';
import { test, expect } from 'vitest';

@Component({
  selector: 'atl-fixture',
  template: `
    @if (visible()) {
    <div data-testid="im-here">👋</div>
    }
  `,
})
class FixtureComponent implements OnInit {
  visible = signal(true);
  ngOnInit() {
    timer(500).subscribe(() => this.visible.set(false));
  }
}

test('waits for element to be removed (callback)', async () => {
  await render(FixtureComponent);

  await waitForElementToBeRemoved(() => screen.queryByTestId('im-here'));

  expect(screen.queryByTestId('im-here')).not.toBeInTheDocument();
});

test('waits for element to be removed (element)', async () => {
  await render(FixtureComponent);

  await waitForElementToBeRemoved(screen.queryByTestId('im-here'));

  expect(screen.queryByTestId('im-here')).not.toBeInTheDocument();
});

test('allows to override options', async () => {
  await render(FixtureComponent);

  await expect(waitForElementToBeRemoved(() => screen.queryByTestId('im-here'), { timeout: 200 })).rejects.toThrow(
    /Timed out in waitForElementToBeRemoved/i,
  );
});
