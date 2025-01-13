import { aliasedInput, render, screen } from '@testing-library/angular';
import { HostDirectiveComponent } from './23-host-directive';

test('can set input properties of host directives using aliasedInput', async () => {
  await render(HostDirectiveComponent, {
    inputs: {
      ...aliasedInput('atlText', 'Hello world'),
    },
  });

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});

test('can set input properties of host directives using componentInputs', async () => {
  await render(HostDirectiveComponent, {
    componentInputs: {
      atlText: 'Hello world',
    },
  });

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});
