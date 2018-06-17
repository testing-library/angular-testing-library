import { Component, Input, Injectable } from '@angular/core';
import { createComponent, fireEvent } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `<p>rawr</p>  `,
})
class FixtureComponent {}

@Injectable()
class FixtureService {}

test('gets TestBed tokens', async () => {
  const { getFromTestBed } = await createComponent('<fixture></fixture>', {
    declarations: [FixtureComponent],
    providers: [FixtureService],
  });

  expect(getFromTestBed(FixtureService)).toBeDefined();
});
