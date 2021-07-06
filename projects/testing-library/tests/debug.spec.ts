import { Component } from '@angular/core';
import { render } from '../src/public_api';

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

  debug();

  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('rawr'));
  (<any>console.log).mockRestore();
});

test('debug allows to be called with an element', async () => {
  jest.spyOn(console, 'log').mockImplementation();
  const { debug, getByTestId } = await render(FixtureComponent);
  const btn = getByTestId('btn');

  debug(btn);

  expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('rawr'));
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`I'm a button`));
  (<any>console.log).mockRestore();
});
