import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { render } from '../../src/public_api';

test('shows the service value', async () => {
  const { getByText } = await render(FixtureComponent);

  getByText('foo');
});

test('shows the provided service value', async () => {
  const { getByText } = await render(FixtureComponent, {
    componentProviders: [
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
  const { getByText } = await render(FixtureComponent, {
    componentProviders: [
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
  selector: 'atl-fixture',
  template: '{{service.foo()}}',
  providers: [Service],
})
export class FixtureComponent {
  constructor(public service: Service) {}
}
