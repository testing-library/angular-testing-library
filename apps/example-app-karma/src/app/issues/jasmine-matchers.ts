import { render, screen } from '@testing-library/angular';

it('can use jasmine matchers', async () => {
  await render(`<div>Hello {{ name}}</div>`, {
    componentProperties: {
      name: 'Sarah',
    },
  });

  expect(screen.getByText('Hello Sarah')).toBeVisible();
});
