import { render, screen } from '@testing-library/angular';

import { CellComponent } from './11-ng-content';

test('it is possible to test ng-content without selector', async () => {
  const projection = 'it should be showed into a p element!';
  
  await render(`<app-fixture data-testid="one-cell-with-ng-content">${projection}</app-fixture>`, {
    declarations: [CellComponent]
  });

  expect(screen.getByText(projection)).toBeInTheDocument();
  expect(screen.getByTestId('one-cell-with-ng-content')).toContainHTML(`<p>${projection}</p>`);
});
