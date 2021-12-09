import { Component, Input } from '@angular/core';
import { render, screen } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: ` {{ firstName }} {{ lastName }} `,
})
class FixtureComponent {
  @Input() firstName = 'Sarah';
  @Input() lastName?: string;
}

test('rerenders the component with updated props', async () => {
  const { rerender } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const firstName = 'Mark';
  await rerender({ firstName });

  expect(screen.getByText(firstName)).toBeInTheDocument();
});

test('rerenders the component with updated props and resets other props', async () => {
  const firstName = 'Mark';
  const lastName = 'Peeters';
  const { rerender } = await render(FixtureComponent, {
    componentProperties: {
      firstName,
      lastName,
    },
  });

  expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();

  const firstName2 = 'Chris';
  rerender({ firstName: firstName2 });

  expect(screen.queryByText(`${firstName2} ${lastName}`)).not.toBeInTheDocument();
  expect(screen.queryByText(firstName2)).not.toBeInTheDocument();
});
