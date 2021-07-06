import { Component } from '@angular/core';
import { render, fireEvent, screen } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: ` <input type="text" data-testid="input" /> `,
})
class FixtureComponent {}

test('does not call detect changes when fixture is destroyed', async () => {
  const { fixture } = await render(FixtureComponent);

  fixture.destroy();

  // should otherwise throw
  fireEvent.input(screen.getByTestId('input'), { target: { value: 'Bonjour' } });
});
