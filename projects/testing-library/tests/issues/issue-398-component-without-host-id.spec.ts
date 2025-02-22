import { Component } from '@angular/core';
import { render, screen } from '../../src/public_api';

test('should create the app', async () => {
  await render(FixtureComponent);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});

test('should re-create the app', async () => {
  await render(FixtureComponent);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});

@Component({
  selector: 'atl-fixture',
  standalone: true,
  template: '<h1>My title</h1>',
  host: {
    '[attr.id]': 'null', // this breaks the cleaning up of tests
  },
})
class FixtureComponent {}
