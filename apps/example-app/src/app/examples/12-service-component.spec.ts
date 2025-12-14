import { of } from 'rxjs';
import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { createMock } from '@testing-library/angular/vitest-utils';

import { Customer, CustomersComponent, CustomersService } from './12-service-component';

test('renders the provided customers with manual mock', async () => {
  const customers: Customer[] = [
    {
      id: '1',
      name: 'sarah',
    },
    {
      id: '2',
      name: 'charlotte',
    },
  ];
  await render(CustomersComponent, {
    componentProviders: [
      {
        provide: CustomersService,
        useValue: {
          load() {
            return of(customers);
          },
        },
      },
    ],
  });

  const listItems = screen.getAllByRole('listitem');
  expect(listItems).toHaveLength(customers.length);

  customers.forEach((customer) => screen.getByText(new RegExp(customer.name, 'i')));
});

test('renders the provided customers with createMock', async () => {
  const customers: Customer[] = [
    {
      id: '1',
      name: 'sarah',
    },
    {
      id: '2',
      name: 'charlotte',
    },
  ];

  const customersService = createMock(CustomersService);
  customersService.load = vi.fn(() => of(customers)) as any;

  await render(CustomersComponent, {
    componentProviders: [
      {
        provide: CustomersService,
        useValue: customersService,
      },
    ],
  });

  const listItems = screen.getAllByRole('listitem');
  expect(listItems).toHaveLength(customers.length);

  customers.forEach((customer) => screen.getByText(new RegExp(customer.name, 'i')));
});
