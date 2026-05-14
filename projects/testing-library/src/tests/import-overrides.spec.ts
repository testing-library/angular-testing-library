import { Component } from '@angular/core';
import { expect, test } from 'vitest';
import { render, screen } from '../public_api';

@Component({
  selector: 'atl-child',
  template: `Hello from child`,
  standalone: true,
})
class ChildComponent {}

@Component({
  selector: 'atl-child',
  template: `Hello from stub`,
  standalone: true,
  host: { 'collision-id': 'StubComponent' },
})
class StubChildComponent {}

@Component({
  selector: 'atl-other',
  template: `Hello from other`,
  standalone: true,
})
class OtherComponent {}

@Component({
  selector: 'atl-fixture',
  template: `<atl-child /><atl-other />`,
  standalone: true,
  imports: [ChildComponent, OtherComponent],
})
class FixtureComponent {}

@Component({
  selector: 'atl-non-standalone',
  template: `non-standalone`,
  standalone: false,
})
class NonStandaloneComponent {}

test('importOverrides - replaces a single import', async () => {
  await render(FixtureComponent, {
    importOverrides: [{ replace: ChildComponent, with: StubChildComponent }],
  });

  expect(screen.getByText('Hello from stub')).toBeInTheDocument();
  expect(screen.queryByText('Hello from child')).not.toBeInTheDocument();
});

test('importOverrides - leaves other imports intact', async () => {
  await render(FixtureComponent, {
    importOverrides: [{ replace: ChildComponent, with: StubChildComponent }],
  });

  expect(screen.getByText('Hello from stub')).toBeInTheDocument();
  expect(screen.getByText('Hello from other')).toBeInTheDocument();
});

test('importOverrides - throws on non-standalone component', async () => {
  await expect(
    render(NonStandaloneComponent, {
      declarations: [NonStandaloneComponent],
      excludeComponentDeclaration: true,
      importOverrides: [{ replace: ChildComponent, with: StubChildComponent }],
    } as any),
  ).rejects.toThrow(/Cannot specify importOverrides on a template or non-standalone component/);
});

test('importOverrides - throws when used with componentImports', async () => {
  await expect(
    render(FixtureComponent, {
      componentImports: [ChildComponent],
      importOverrides: [{ replace: ChildComponent, with: StubChildComponent }],
    }),
  ).rejects.toThrow(/Cannot specify both componentImports and importOverrides/);
});

test('importOverrides - empty array is a no-op', async () => {
  await render(FixtureComponent, {
    importOverrides: [],
  });

  expect(screen.getByText('Hello from child')).toBeInTheDocument();
  expect(screen.getByText('Hello from other')).toBeInTheDocument();
});
