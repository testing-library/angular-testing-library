import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, inject, input } from '@angular/core';
import { test, expect } from 'vitest';
import { render, screen } from '../../public_api';

test('succeeds', async () => {
  await render(DummyComponent, {
    inputs: {
      value: 'test',
    },
    providers: [provideHttpClientTesting(), provideHttpClient()],
  });

  expect(screen.getByText('test')).toBeVisible();
});

@Component({
  selector: 'atl-dummy',
  standalone: true,
  imports: [],
  template: '<p>{{ value() }}</p>',
})
class DummyComponent {
  // @ts-expect-error - testing purpose
  private _http = inject(HttpClient);
  value = input.required<string>();
}
