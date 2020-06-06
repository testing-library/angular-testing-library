import { Component } from '@angular/core';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: ` <input type="text" data-testid="input" /> `,
})
class FixtureComponent {}

test('does not call detect changes when fixture is destroyed', async () => {
  const component = await render(FixtureComponent);

  component.fixture.destroy();

  // should otherwise throw
  component.input(component.getByTestId('input'), { target: { value: 'Bonjour' } });
  component.type(component.getByTestId('input'), 'Alles klar');
});
