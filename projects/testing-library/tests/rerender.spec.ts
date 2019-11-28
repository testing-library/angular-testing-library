import { Component, Input } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `
    {{ name }}
  `,
})
class FixtureComponent {
  @Input() name = 'Sarah';
}

test('will rerender the component with updated props', async () => {
  const component = await render(FixtureComponent);
  component.getByText('Sarah');

  const name = 'Mark';
  component.rerender({
    name,
  });

  component.getByText(name);
});
