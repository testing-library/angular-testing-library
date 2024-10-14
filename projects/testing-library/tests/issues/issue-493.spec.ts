import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, input } from '@angular/core';
import { render, screen } from '../../src/public_api';

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
  value = input.required<string>();
  // @ts-ignore
  constructor(private http: HttpClient) {}
}
