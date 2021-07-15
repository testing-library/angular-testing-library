import { render, screen } from '@testing-library/angular';

it('https://github.com/testing-library/angular-testing-library/issues/222', async () => {
  const { rerender } = await render(`<div>Hello {{ name}}</div>`, {
    componentProperties: {
      name: 'Sarah',
    },
  });

  expect(screen.getByText('Hello Sarah')).toBeTruthy();
  rerender({ name: 'Mark' });

  expect(screen.getByText('Hello Mark')).toBeTruthy();
});
