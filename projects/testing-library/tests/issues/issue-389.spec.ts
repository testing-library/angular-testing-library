import { Component, Input } from '@angular/core';
import { render, screen } from '../../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: `Hello {{ name }}`,
})
class TestComponent {
  @Input('aliasName') name = '';
}

test('allows you to set componentInputs using the name alias', async () => {
  await render(TestComponent, { componentInputs: { aliasName: 'test' } });
  expect(screen.getByText('Hello test')).toBeInTheDocument();
});
