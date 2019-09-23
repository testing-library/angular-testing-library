import { render } from '@testing-library/angular';

import { DataInjectedComponent, DATA } from './10-inject-token-dependency';

test('injects data into the component', async () => {
  const component = await render(DataInjectedComponent, {
    providers: [
      {
        provide: DATA,
        useValue: { text: 'Hello boys and girls' },
      },
    ],
  });

  expect(component.getByText(/Hello boys and girls/i)).toBeInTheDocument();
});
