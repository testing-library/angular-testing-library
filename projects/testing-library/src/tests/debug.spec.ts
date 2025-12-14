import { Component } from '@angular/core';
import { vi, test } from 'vitest';
import { render, screen } from '../public_api';

@Component({
  selector: 'atl-fixture',
  template: `
    <p>rawr</p>
    <button data-testid="btn">I'm a button</button>
  `,
})
class FixtureComponent {}

test('debug', async () => {
  vi.spyOn(console, 'log').mockImplementation(() => void 0);
  const { debug } = await render(FixtureComponent);

  // eslint-disable-next-line testing-library/no-debugging-utils
  debug();

  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('rawr'));
  (console.log as any).mockRestore();
});

test('debug allows to be called with an element', async () => {
  vi.spyOn(console, 'log').mockImplementation(() => void 0);
  const { debug } = await render(FixtureComponent);
  const btn = screen.getByTestId('btn');

  // eslint-disable-next-line testing-library/no-debugging-utils
  debug(btn);

  expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('rawr'));
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`I'm a button`));
  (console.log as any).mockRestore();
});
