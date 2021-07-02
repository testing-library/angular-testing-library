import { fakeAsync, tick } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';

import { AsyncComponent } from './14-async-component';

test('can use fakeAsync utilities', fakeAsync(async () => {
  await render(AsyncComponent);

  const load = await screen.findByRole('button', { name: /load/i });
  fireEvent.click(load);

  tick(10_000);

  const hello = await screen.findByText('Hello world');
  expect(hello).toBeInTheDocument();
}));

test('can use fakeTimer utilities', async () => {
  jest.useFakeTimers();
  await render(AsyncComponent);

  const load = await screen.findByRole('button', { name: /load/i });
  fireEvent.click(load);

  jest.advanceTimersByTime(10_000);

  const hello = await screen.findByText('Hello world');
  expect(hello).toBeInTheDocument();
});
