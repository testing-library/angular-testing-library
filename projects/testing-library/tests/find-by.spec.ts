import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { render, screen } from '../src/public_api';
import { mapTo, timeout } from 'rxjs/operators';

@Component({
  selector: 'fixture',
  template: `
    <div>{{ result | async }}</div>
  `,
})
class FixtureComponent {
  result = timer(30).pipe(mapTo('I am visible'));
}

describe('screen', () => {
  test('waits for element to be added to the DOM', async () => {
    await render(FixtureComponent);
    await expect(screen.findByText('I am visible')).resolves.toBeTruthy();
  });

  test('rejects when something cannot be found', async () => {
    await render(FixtureComponent);
    await expect(screen.findByText('I am invisible', {}, { timeout: 40 })).rejects.toThrow('x');
  });
});

describe('rendered component', () => {
  test('waits for element to be added to the DOM', async () => {
    const { findByText } = await render(FixtureComponent);
    await expect(findByText('I am visible')).resolves.toBeTruthy();
  });

  test('rejects when something cannot be found', async () => {
    const { findByText } = await render(FixtureComponent);
    await expect(findByText('I am invisible', {}, { timeout: 40 })).rejects.toThrow('x');
  });
});
