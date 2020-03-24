import { Component, Input } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `
    Hello {{ name }}!
  `,
})
class FixtureComponent {
  @Input() name: string;
}

describe('Angular auto clean up - previous components only get cleanup up on init (based on root-id)', () => {
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

describe('ATL auto clean up - after each test the containers get removed', () => {
  test('first', async () => {
    await render(FixtureComponent, {
      removeAngularAttributes: true,
    });
  });

  test('second', () => {
    expect(document.body.innerHTML).toEqual('');
  });
});
