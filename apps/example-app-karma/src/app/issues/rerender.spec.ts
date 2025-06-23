import { render, screen } from '@testing-library/angular';

it('can rerender component', async () => {
  const { rerender } = await render(`<div>Hello {{ name}}</div>`, {
    componentProperties: {
      name: 'Sarah',
    },
  });

  expect(screen.getByText('Hello Sarah')).toBeInTheDocument();

  await rerender({ componentProperties: { name: 'Mark' } });

  expect(screen.getByText('Hello Mark')).toBeInTheDocument();
});
