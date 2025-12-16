import { provideZoneChangeDetection } from '@angular/core';
import { aliasedInput, render, screen } from '@testing-library/angular';
import { HostDirectiveComponent } from './23-host-directive';

test('can set input properties of host directives using aliasedInput', async () => {
  await render(HostDirectiveComponent, {
    inputs: {
      ...aliasedInput('atlText', 'Hello world'),
    },
    providers: [provideZoneChangeDetection()],
  });

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});

test('can set input properties of host directives using componentInputs', async () => {
  await render(HostDirectiveComponent, {
    componentInputs: {
      atlText: 'Hello world',
    },
    providers: [provideZoneChangeDetection()],
  });

  expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});
