import { createMock, provideMock, Mock } from '../../src/jest-utils';
import { render } from '../../src/public_api';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

class FixtureService {
  constructor(private foo: string, public bar: string) {}

  print() {
    console.log(this.foo, this.bar);
  }
}

@Component({
  selector: 'fixture',
  template: `
    <button (click)="print()">Print</button>
  `,
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
  const { click, getByText } = await render(FixtureComponent, {
    providers: [provideMock(FixtureService)],
  });
  const service = TestBed.get<FixtureService>(FixtureService);

  click(getByText('Print'));
  expect(service.print).toHaveBeenCalledTimes(1);
});

it('is possible to write a mock implementation', async done => {
  const { click, getByText } = await render(FixtureComponent, {
    providers: [provideMock(FixtureService)],
  });

  const service = TestBed.get<FixtureService>(FixtureService) as Mock<FixtureService>;
  service.print.mockImplementation(() => done());

  click(getByText('Print'));
});
