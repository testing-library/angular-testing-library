import { Component, Input } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `
    <p>rawr</p>
  `,
})
class FixtureComponent {}

test('debug', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  const { debug } = await render('<fixture></fixture>', {
    declarations: [FixtureComponent],
  });
  debug();
  expect(console.log).toBeCalledWith(expect.stringContaining('rawr'));
  (<any>console.log).mockRestore();
});
