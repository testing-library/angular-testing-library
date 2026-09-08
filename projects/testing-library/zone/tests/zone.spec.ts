import { Component } from '@angular/core';
import { test, expect } from 'vitest';
import * as root from '../../index';
import * as zone from '../index';
import { render, screen } from '../index';

test('re-exports the same public API as @testing-library/angular', () => {
  const rootExports = root as Record<string, unknown>;
  const zoneExports = zone as Record<string, unknown>;

  expect(Object.keys(zoneExports).sort()).toEqual(Object.keys(rootExports).sort());

  for (const key of Object.keys(rootExports)) {
    expect(zoneExports[key]).toBe(rootExports[key]);
  }
});

@Component({
  selector: 'atl-fixture',
  template: `<span>Hello {{ name }}</span>`,
})
class FixtureComponent {
  name = 'world';
}

test('renders a component', async () => {
  await render(FixtureComponent);

  expect(screen.getByText('Hello world')).toBeInTheDocument();
});
