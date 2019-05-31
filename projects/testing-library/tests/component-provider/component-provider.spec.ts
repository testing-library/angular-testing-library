import { Injectable } from '@angular/core';
import { Component, Input } from '@angular/core';
import { render } from '../../src/public_api';
import { TestBed } from '@angular/core/testing';

// tslint:disable: no-use-before-declare
// tslint:disable: no-use-before-declare
test('shows the service value', async () => {
  const { getByText } = await render(FixtureComponent, {});
  getByText('foo');
});

test('shows the provided service value', async () => {
  const { getByText } = await render(FixtureComponent, {
    providers: [
      {
        provide: Service,
        useValue: {
          foo() {
            return 'bar';
          },
        },
      },
    ],
  });

  getByText('bar');
});

@Injectable()
export class Service {
  foo() {
    return 'foo';
  }
}

@Component({
  template: '{{service.foo()}}',
  providers: [Service],
})
export class FixtureComponent {
  constructor(public service: Service) {}
}
