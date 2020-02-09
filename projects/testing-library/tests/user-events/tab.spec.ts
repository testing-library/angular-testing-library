import { Component } from '@angular/core';
import { render } from '../../src/public_api';

test('cycles through elements in document tab order', async () => {
  @Component({
    selector: 'fixture',
    template: `
      <div>
        <input data-testid="element" type="checkbox" />
        <input data-testid="element" type="radio" />
        <input data-testid="element" type="number" />
      </div>
    `,
  })
  class FixtureComponent {}

  const component = await render(FixtureComponent);
  const [checkbox, radio, number] = component.getAllByTestId('element');

  expect(document.body).toHaveFocus();

  component.tab();

  expect(checkbox).toHaveFocus();

  component.tab();

  expect(radio).toHaveFocus();

  component.tab();

  expect(number).toHaveFocus();

  component.tab();

  // cycle goes back to first element
  expect(checkbox).toHaveFocus();
});
