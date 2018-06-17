import { Component, Input } from '@angular/core';
import { createComponent, fireEvent } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `<p>rawr</p>  `,
})
class FixtureComponent {}

test('calls detect changes on the fixture', async () => {
  const { fixture, detectChanges } = await createComponent('<fixture></fixture>', {
    declarations: [FixtureComponent],
  });
  fixture.detectChanges = jest.fn();

  detectChanges();
  expect(fixture.detectChanges).toBeCalledWith(undefined);

  detectChanges(true);
  expect(fixture.detectChanges).toBeCalledWith(true);
});
