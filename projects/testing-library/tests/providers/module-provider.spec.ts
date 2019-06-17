import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { render } from '../../src/public_api';
import { TestBed } from '@angular/core/testing';

// tslint:disable: no-use-before-declare
test('shows the service value', async () => {
  const { getByText } = await render(FixtureComponent, {
    providers: [Service],
  });

  getByText('foo');
});

test('shows the service value with template syntax', async () => {
  const { getByText } = await render('<fixture-component></fixture-component>', {
    declarations: [FixtureComponent],
    providers: [Service],
  });

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

test('shows the provided service value with template syntax', async () => {
  const { getByText } = await render('<fixture-component></fixture-component>', {
    declarations: [FixtureComponent],
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
  selector: 'fixture-component',
  template: '{{service.foo()}}',
})
export class FixtureComponent {
  constructor(public service: Service) {}
}
