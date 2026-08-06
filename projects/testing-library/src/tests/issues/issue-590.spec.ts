import { Component } from '@angular/core';
import { test, expect } from 'vitest';
import { render, queries, queryHelpers } from '../../public_api';

const myQueryByTestId = queryHelpers.queryByAttribute.bind(null, 'data-test-id');

test('custom queries passed to render are available on the render result', async () => {
  const view = await render(FixtureComponent, {
    queries: {
      ...queries,
      myQueryByTestId,
    },
  });

  expect(view.myQueryByTestId('my-fixture')).not.toBeNull();
  // eslint-disable-next-line testing-library/prefer-screen-queries
  expect(view.myQueryByTestId('my-fixture')).toBe(view.getByText('Hello world'));
});

@Component({
  selector: 'atl-fixture',
  template: `<div data-test-id="my-fixture">Hello world</div>`,
})
class FixtureComponent {}
