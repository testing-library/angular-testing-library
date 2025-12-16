import { provideZoneChangeDetection } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { AsyncComponent } from './14-async-component';

test.skip('can use fakeAsync utilities', fakeAsync(async () => {
  await render(AsyncComponent, {
    providers: [provideZoneChangeDetection()],
  });

  const load = await screen.findByRole('button', { name: /load/i });
  fireEvent.click(load);

  // Error: The code should be running in the fakeAsync zone to call this function
  tick(10_000);

  const hello = await screen.findByText('Hello world');
  expect(hello).toBeInTheDocument();
}));

test('can use fakeTimer utilities', async () => {
  jest.useFakeTimers();
  await render(AsyncComponent, {
    providers: [provideZoneChangeDetection()],
  });

  const load = await screen.findByRole('button', { name: /load/i });

  // userEvent not working with fake timers
  fireEvent.click(load);

  jest.advanceTimersByTime(10_000);

  const hello = await screen.findByText('Hello world');
  expect(hello).toBeInTheDocument();
});
