import { render, screen } from '@testing-library/angular';
import { StandaloneComponent, StandaloneWithChildComponent } from './19-standalone-component';

test('can render a standalone component', async () => {
  await render(StandaloneComponent);

  const content = screen.getByTestId('standalone');

  expect(content).toHaveTextContent('Standalone Component');
});

test('can render a standalone component with a child', async () => {
  await render(StandaloneWithChildComponent, {
    componentProperties: { name: 'Bob' },
  });

  const childContent = screen.getByTestId('standalone');
  expect(childContent).toHaveTextContent('Standalone Component');

  expect(screen.getByText('Hi Bob')).toBeInTheDocument();
  expect(screen.getByText('This has a child')).toBeInTheDocument();
});
