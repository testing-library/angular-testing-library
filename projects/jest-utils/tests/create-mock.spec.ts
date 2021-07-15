import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { createMock, provideMock, provideMockWithValues, Mock } from '../src/public_api';
import { render, fireEvent } from '../../testing-library/src/public_api';

class FixtureService {
  constructor(private foo: string, public bar: string) {}

  print() {
    console.log(this.foo, this.bar);
  }

  concat() {
    return this.foo + this.bar;
  }
}

@Component({
  selector: 'fixture',
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

it('provides a mock service with values', async () => {
  const { getByText } = await render(FixtureComponent, {
    providers: [provideMockWithValues(FixtureService, {
      bar: 'value',
      concat: jest.fn(() => 'a concatenated value')
    })],
  });

  const service = TestBed.inject(FixtureService);

  fireEvent.click(getByText('Print'));

  expect(service.bar).toEqual('value');
  expect(service.concat()).toEqual('a concatenated value');
  expect(service.print).toHaveBeenCalled();
});

it('is possible to write a mock implementation', async (done) => {
  const { getByText } = await render(FixtureComponent, {
    providers: [provideMock(FixtureService)],
  });

  const service = TestBed.inject(FixtureService) as Mock<FixtureService>;
  service.print.mockImplementation(() => done());

  fireEvent.click(getByText('Print'));
});
