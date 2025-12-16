import { render, screen } from '@testing-library/angular';
import { StandaloneComponent, StandaloneWithChildComponent } from './19-standalone-component';
import { provideZoneChangeDetection } from '@angular/core';

test('can render a standalone component', async () => {
  await render(StandaloneComponent, {
    providers: [provideZoneChangeDetection()],
  });

  const content = screen.getByTestId('standalone');

  expect(content).toHaveTextContent('Standalone Component');
});

test('can render a standalone component with a child', async () => {
  await render(StandaloneWithChildComponent, {
    componentProperties: { name: 'Bob' },
    providers: [provideZoneChangeDetection()],
  });

  const childContent = screen.getByTestId('standalone');
  expect(childContent).toHaveTextContent('Standalone Component');

  expect(screen.getByText('Hi Bob')).toBeInTheDocument();
  expect(screen.getByText('This has a child')).toBeInTheDocument();
});
