import { Component } from '@angular/core';
import { render, screen } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: `
    <p>rawr</p>
    <button data-testid="btn">I'm a button</button>
  `,
})
class FixtureComponent {}

test('debug', async () => {
  jest.spyOn(console, 'log').mockImplementation();
  const { debug } = await render(FixtureComponent);

  // eslint-disable-next-line testing-library/no-debugging-utils
  debug();

  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('rawr'));
  (console.log as any).mockRestore();
});

test('debug allows to be called with an element', async () => {
  jest.spyOn(console, 'log').mockImplementation();
  const { debug } = await render(FixtureComponent);
  const btn = screen.getByTestId('btn');

  // eslint-disable-next-line testing-library/no-debugging-utils
  debug(btn);

  expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('rawr'));
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`I'm a button`));
  (console.log as any).mockRestore();
});
