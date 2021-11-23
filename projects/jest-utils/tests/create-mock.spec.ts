import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';

import { createMock, provideMock, provideMockWithValues, Mock } from '../src/public_api';

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
  selector: 'atl-fixture',
  template: ` <button (click)="print()">Print</button> `,
})
class FixtureComponent {
  constructor(private service: FixtureService) {}

  print() {
    this.service.print();
  }
}

test('mocks all functions', () => {
  const mock = createMock(FixtureService);
  expect(mock.print.mock).toBeDefined();
});

test('provides a mock service', async () => {
  await render(FixtureComponent, {
    providers: [provideMock(FixtureService)],
  });
  const service = TestBed.inject(FixtureService);

  fireEvent.click(screen.getByText('Print'));
  expect(service.print).toHaveBeenCalledTimes(1);
});

test('provides a mock service with values', async () => {
  await render(FixtureComponent, {
    providers: [
      provideMockWithValues(FixtureService, {
        bar: 'value',
        concat: jest.fn(() => 'a concatenated value'),
      }),
    ],
  });

  const service = TestBed.inject(FixtureService);

  fireEvent.click(screen.getByText('Print'));

  expect(service.bar).toEqual('value');
  expect(service.concat()).toEqual('a concatenated value');
  expect(service.print).toHaveBeenCalled();
});

test('is possible to write a mock implementation', async () => {
  await render(FixtureComponent, {
    providers: [provideMock(FixtureService)],
  });

  const service = TestBed.inject(FixtureService) as Mock<FixtureService>;

  fireEvent.click(screen.getByText('Print'));
  expect(service.print).toHaveBeenCalled();
});
