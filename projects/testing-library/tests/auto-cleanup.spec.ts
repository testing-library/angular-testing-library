import { Component } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `
    Hello!
  `,
})
class FixtureComponent {}

test('first', async () => {
  await render(FixtureComponent);
});

test('second', () => {
  expect(document.body.innerHTML).toEqual('');
});
