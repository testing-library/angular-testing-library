import { render, screen } from '@testing-library/angular';

it('https://github.com/testing-library/angular-testing-library/issues/222 with rerender', async () => {
  const { rerender } = await render(`<div>Hello {{ name}}</div>`, {
    componentProperties: {
      name: 'Sarah',
    },
  });

  expect(screen.getByText('Hello Sarah')).toBeTruthy();

  await rerender({ componentProperties: { name: 'Mark' } });

  expect(screen.getByText('Hello Mark')).toBeTruthy();
});

it('https://github.com/testing-library/angular-testing-library/issues/222 with change', async () => {
  const { change } = await render(`<div>Hello {{ name}}</div>`, {
    componentProperties: {
      name: 'Sarah',
    },
  });

  expect(screen.getByText('Hello Sarah')).toBeTruthy();
  await change({ name: 'Mark' });

  expect(screen.getByText('Hello Mark')).toBeTruthy();
});
