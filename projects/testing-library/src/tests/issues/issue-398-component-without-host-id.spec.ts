import { Component } from '@angular/core';
import { describe, test, expect } from 'vitest';
import { render, screen } from '../../public_api';

describe.concurrent('Issue #398 - Component with host id attribute', () => {
  test('should create the app', async () => {
    await render(FixtureComponent);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('should re-create the app', async () => {
    await render(FixtureComponent);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
@Component({
  selector: 'atl-fixture-398',
  standalone: true,
  template: '<h1>My title</h1>',
  host: {
    '[attr.id]': 'null', // this breaks the cleaning up of tests
  },
})
class FixtureComponent {}
