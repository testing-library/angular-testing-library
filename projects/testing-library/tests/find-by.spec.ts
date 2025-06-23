import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { render, screen } from '../src/public_api';
import { mapTo } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'atl-fixture',
  template: ` <div>{{ result | async }}</div> `,
  imports: [AsyncPipe],
})
class FixtureComponent {
  result = timer(30).pipe(mapTo('I am visible'));
}

describe('screen', () => {
  it('waits for element to be added to the DOM', async () => {
    await render(FixtureComponent);
    await expect(screen.findByText('I am visible')).resolves.toBeTruthy();
  });

  it('rejects when something cannot be found', async () => {
    await render(FixtureComponent);
    await expect(screen.findByText('I am invisible', {}, { timeout: 40 })).rejects.toThrow('x');
  });
});

describe('rendered component', () => {
  it('waits for element to be added to the DOM', async () => {
    const { findByText } = await render(FixtureComponent);
    /// We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    await expect(findByText('I am visible')).resolves.toBeTruthy();
  });

  it('rejects when something cannot be found', async () => {
    const { findByText } = await render(FixtureComponent);
    /// We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    await expect(findByText('I am invisible', {}, { timeout: 40 })).rejects.toThrow('x');
  });
});
