import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { render, screen } from '../../src/public_api';

test('shows the service value', async () => {
  await render(FixtureComponent, {
    providers: [Service],
  });

  expect(screen.getByText('foo')).toBeInTheDocument();
});

test('shows the service value with template syntax', async () => {
  await render(FixtureComponent, {
    providers: [Service],
  });

  expect(screen.getByText('foo')).toBeInTheDocument();
});

test('shows the provided service value', async () => {
  await render(FixtureComponent, {
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

  expect(screen.getByText('bar')).toBeInTheDocument();
});

test('shows the provided service value with template syntax', async () => {
  await render(FixtureComponent, {
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

  expect(screen.getByText('bar')).toBeInTheDocument();
});

@Injectable()
class Service {
  foo() {
    return 'foo';
  }
}

@Component({
  selector: 'atl-fixture',
  template: '{{service.foo()}}',
})
class FixtureComponent {
  constructor(public service: Service) {}
}
