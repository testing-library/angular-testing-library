import { test } from 'vitest';
// import 'zone.js';
// import 'zone.js/testing';

// From v21:
// Error: zone-testing.js is needed for the fakeAsync() test helper but could not be found.
// Please make sure that your environment includes zone.js/testing
// test.fails('can use fakeAsync utilities', fakeAsync(async () => {
//   await render(AsyncComponent, {
//     configureTestBed: (testBed) => {
//       testBed.configureTestingModule({
//         providers: [provideZoneChangeDetection()],
//       });
//     },
//   });

//   const load = await screen.findByRole('button', { name: /load/i });
//   fireEvent.click(load);

//   tick(10_000);

//   const hello = await screen.findByText('Hello world');
//   expect(hello).toBeInTheDocument();
// }));

// test('can use fakeTimer utilities', async () => {
//   vi.useFakeTimers();
//   await render(AsyncComponent);

//   const load = await screen.findByRole('button', { name: /load/i });

//   // userEvent not working with fake timers
//   fireEvent.click(load);

//   vi.advanceTimersByTime(10_000);

//   const hello = await screen.findByText('Hello world');
//   expect(hello).toBeInTheDocument();
// });

test('placeholder test to avoid empty test file error', () => {
  expect(true).toBe(true);
});
