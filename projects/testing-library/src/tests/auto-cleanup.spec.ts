import { Component, Input } from '@angular/core';
import { describe, test, expect } from 'vitest';
import { render } from '../public_api';

@Component({
  selector: 'atl-fixture',
  template: `Hello {{ name }}!`,
})
class FixtureComponent {
  @Input() name = '';
}

describe('Angular auto clean up - previous components only get cleanup up on init', () => {
  test('first', async () => {
    await render(FixtureComponent, {
      componentProperties: {
        name: 'first',
      },
    });
  });

  test('second', async () => {
    await render(FixtureComponent, {
      componentProperties: {
        name: 'second',
      },
    });
    expect(document.body.innerHTML).not.toContain('first');
  });
});
