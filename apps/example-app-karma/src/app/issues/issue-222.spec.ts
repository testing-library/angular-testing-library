import { render, screen } from '@testing-library/angular';

it('https://github.com/testing-library/angular-testing-library/issues/222', async () => {
  const { rerender } = await render(`<div>Hello {{ name}}</div>`, {
    componentProperties: {
      name: 'Sarah',
    },
  });

  screen.getByText('Hello Sarah');
  rerender({ name: 'Mark' });
  screen.getByText('Hello Mark');
});
