import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fireEvent, render } from '@testing-library/angular';

import { createMock, provideMock, Mock } from '../src/public_api';

class FixtureService {
  constructor(private foo: string, public bar: string) {}

  print() {
    console.log(this.foo, this.bar);
  }
}

@Component({
  selector: 'atl-fixture',
  template: ` <button (click)="print()">Print</button> `,
})
export class FixtureComponent {
  constructor(private service: FixtureService) {}

  print() {
    this.service.print();
  }
}

it('mocks all functions', () => {
  const mock = createMock(FixtureService);
  expect(mock.print.mock).toBeDefined();
});

it('provides a mock service', async () => {
  const { getByText } = await render(FixtureComponent, {
    providers: [provideMock(FixtureService)],
  });
  const service = TestBed.inject(FixtureService);

  fireEvent.click(getByText('Print'));
  expect(service.print).toHaveBeenCalledTimes(1);
});

it('is possible to write a mock implementation', async (done) => {
  const { getByText } = await render(FixtureComponent, {
    providers: [provideMock(FixtureService)],
  });

  const service = TestBed.inject(FixtureService) as Mock<FixtureService>;
  service.print.mockImplementation(() => done());

  fireEvent.click(getByText('Print'));
});
