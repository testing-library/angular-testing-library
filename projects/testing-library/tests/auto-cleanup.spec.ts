import { Component, Input } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: `Hello {{ name }}!`,
})
class FixtureComponent {
  @Input() name: string;
}

describe('Angular auto clean up - previous components only get cleanup up on init (based on root-id)', () => {
  it('first', async () => {
    await render(FixtureComponent, {
      componentProperties: {
        name: 'first',
      },
    });
  });

  it('second', async () => {
    await render(FixtureComponent, {
      componentProperties: {
        name: 'second',
      },
    });
    expect(document.body.innerHTML).not.toContain('first');
  });
});

describe('ATL auto clean up - after each test the containers get removed', () => {
  it('first', async () => {
    await render(FixtureComponent, {
      removeAngularAttributes: true,
    });
  });

  it('second', () => {
    expect(document.body).toBeEmptyDOMElement();
  });
});
