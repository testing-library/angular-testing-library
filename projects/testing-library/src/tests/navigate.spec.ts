import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi, test, expect } from 'vitest';
import { render } from '../public_api';

@Component({
  selector: 'atl-fixture',
  template: ``,
})
class FixtureComponent {}

test('should navigate correctly', async () => {
  const { navigate } = await render(FixtureComponent, {
    routes: [{ path: 'details', component: FixtureComponent }],
  });

  const router = TestBed.inject(Router);
  const navSpy = vi.spyOn(router, 'navigate');

  navigate('details');

  expect(navSpy).toHaveBeenCalledWith(['details']);
});

test('should pass queryParams if provided', async () => {
  const { navigate } = await render(FixtureComponent, {
    routes: [{ path: 'details', component: FixtureComponent }],
  });

  const router = TestBed.inject(Router);
  const navSpy = vi.spyOn(router, 'navigate');

  navigate('details?sortBy=name&sortOrder=asc');

  expect(navSpy).toHaveBeenCalledWith(['details'], {
    queryParams: {
      sortBy: 'name',
      sortOrder: 'asc',
    },
  });
});

test('should navigate from UrlTree', async () => {
  const { navigate } = await render(FixtureComponent, {
    routes: [{ path: 'docs', component: FixtureComponent }],
  });

  const router = TestBed.inject(Router);

  const result = await navigate(router.createUrlTree(['docs']));

  expect(result).toBe(true);
  expect(router.url).toBe('/docs');
});

test('should use query params and fragment from UrlTree', async () => {
  const { navigate } = await render(FixtureComponent, {
    routes: [{ path: 'docs', component: FixtureComponent }],
  });

  const router = TestBed.inject(Router);

  await navigate(router.createUrlTree(['docs'], { queryParams: { lang: 'en' }, fragment: 'getting-started' }));

  expect(router.url).toBe('/docs?lang=en#getting-started');
});

test('should not accept basePath when UrlTree is provided', async () => {
  const { navigate } = await render(FixtureComponent, {
    routes: [{ path: 'docs', component: FixtureComponent }],
  });

  const router = TestBed.inject(Router);

  // @ts-expect-error basePath is not part of the UrlTree overload
  await navigate(router.createUrlTree(['docs']), 'base/');

  expect(router.url).toBe('/docs');
});
