import { render, screen } from '@testing-library/angular';

import { DataInjectedComponent, DATA } from './10-inject-token-dependency';

test('injects data into the component', async () => {
  await render(DataInjectedComponent, {
    providers: [
      {
        provide: DATA,
        useValue: { text: 'Hello boys and girls' },
      },
    ],
  });

  expect(screen.getByText(/Hello boys and girls/i)).toBeInTheDocument();
});
