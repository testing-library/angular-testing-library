import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { ComponentWithAttributeSelectorComponent } from './17-component-with-attribute-selector';

// Note: At this stage it is not possible to use the render(ComponentWithAttributeSelectorComponent, {...}) syntax
// for components with attribute selectors!
test('is possible to set input of component with attribute selector through template', async () => {
  await render(
    `<atl-fixture-component-with-attribute-selector [value]="42"></atl-fixture-component-with-attribute-selector>`,
    {
      imports: [ComponentWithAttributeSelectorComponent],
    },
  );

  const valueControl = screen.getByTestId('value');

  expect(valueControl).toHaveTextContent('42');
});
